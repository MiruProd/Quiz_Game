import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'quiz_app_theme';

  readonly currentTheme = signal<'light' | 'dark'>(this.loadTheme());

  toggleTheme(): void {
    const nextTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.currentTheme.set(nextTheme);
    this.applyTheme(nextTheme);
  }

  private loadTheme(): 'light' | 'dark' {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.storageKey);
      if (saved === 'light' || saved === 'dark') {
        this.applyTheme(saved);
        return saved;
      }
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const defaultTheme = prefersDark ? 'dark' : 'light';
      this.applyTheme(defaultTheme);
      return defaultTheme;
    }
    return 'light';
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(this.storageKey, theme);
    }
  }
}
