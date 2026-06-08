import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly storageKey = 'quiz_user_session';
  private readonly apiUrl = 'http://localhost:3000/users';

  readonly currentUser = signal<User | null>(this.loadSession());
  readonly isAuthenticated = computed(() => !!this.currentUser());

  login(username: string): Observable<User> {
    const cleanUsername = username.trim();

    return this.http.get<User[]>(`${this.apiUrl}?username=${cleanUsername}`).pipe(
      switchMap((users) => {
        if (users.length > 0) {
          return of(users[0]);
        }
        return throwError(
          () =>
            new Error('Пользователь с таким именем не найден. Пожалуйста, пройдите регистрацию.'),
        );
      }),
      tap((user) => {
        this.currentUser.set(user);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.storageKey, JSON.stringify(user));
        }
      }),
    );
  }

  register(username: string): Observable<User> {
    const cleanUsername = username.trim();

    return this.http.get<User[]>(`${this.apiUrl}?username=${cleanUsername}`).pipe(
      switchMap((users) => {
        if (users.length > 0) {
          return throwError(
            () => new Error('Этот никнейм уже занят. Пожалуйста, выберите другое имя.'),
          );
        }

        const userId = crypto.randomUUID();
        const fakeToken = btoa(encodeURIComponent(`${cleanUsername}:${Date.now()}`));
        const now = new Date().toISOString();

        const newUser: User = {
          id: userId,
          username: cleanUsername,
          token: fakeToken,
          loginTime: now,
          createdAt: now,
          level: 1,
          xp: 0,
          avatarUrl: 'avatars/default.png',
          achievements: [],
          stats: {
            gamesPlayed: 0,
            totalScore: 0,
            averagePercentage: 0,
            categoryHighScores: {},
          },
        };

        return this.http.post<User>(this.apiUrl, newUser);
      }),
      tap((user) => {
        this.currentUser.set(user);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.storageKey, JSON.stringify(user));
        }
      }),
    );
  }

  logout(): void {
    this.currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.storageKey);
    }
  }

  private loadSession(): User | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      console.error('Ошибка восстановления сессии:', err);
      return null;
    }
  }
}
