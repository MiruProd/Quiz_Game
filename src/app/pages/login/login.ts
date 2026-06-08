import { Component, inject, signal, DestroyRef } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthStore } from '../../services/auth-store.service';
import { BgDecorations } from './components/bg-decorations/bg-decorations';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, BgDecorations],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);
  private readonly destroyRef = inject(DestroyRef);

  readonly isRegisterMode = signal(false);
  readonly isSubmitting = signal(false);
  readonly authError = signal<string | null>(null);

  readonly loginForm = this.fb.nonNullable.group({
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        Validators.pattern(/^[a-zA-Zа-яА-Я0-9_]+$/),
      ],
    ],
  });

  toggleMode(): void {
    this.isRegisterMode.set(!this.isRegisterMode());
    this.authError.set(null);
    this.loginForm.reset();
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.isSubmitting()) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.authError.set(null);

    const { username } = this.loginForm.getRawValue();

    const authRequest$ = this.isRegisterMode()
      ? this.authStore.register(username)
      : this.authStore.login(username);

    authRequest$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/quizzes']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.authError.set(err.message || 'Ошибка авторизации');
      },
    });
  }
}
