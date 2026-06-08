import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
    title: 'Вход',
    canActivate: [guestGuard],
  },
  {
    path: 'quizzes',
    loadComponent: () => import('./pages/quiz-list/quiz-list').then((m) => m.QuizList),
    title: 'Выбор викторины',
    canActivate: [authGuard],
  },
  {
    path: 'quiz/:categoryId',
    loadComponent: () => import('./pages/quiz-detail/quiz-detail').then((m) => m.QuizDetail),
    title: 'Описание викторины',
    canActivate: [authGuard],
  },
  {
    path: 'quiz/:categoryId/play',
    loadComponent: () => import('./pages/game-play/game-play').then((m) => m.GamePlay),
    title: 'Игра',
    canActivate: [authGuard],
  },
  {
    path: 'results',
    loadComponent: () => import('./pages/results/results').then((m) => m.Results),
    title: 'Итоги раунда',
    canActivate: [authGuard],
  },
  {
    path: 'leaderboard',
    loadComponent: () => import('./pages/leaderboard/leaderboard').then((m) => m.Leaderboard),
    title: 'Таблица лидеров',
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
