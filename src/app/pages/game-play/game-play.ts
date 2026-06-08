import { Component, OnInit, inject, signal, computed, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';
import { QuizApi } from '../../services/quiz-api.service';
import { TimerService } from '../../services/timer.service';
import { Question } from '../../models/quiz.model';
import { QuizQuestion } from '../../components/quiz-question/quiz-question';

@Component({
  selector: 'app-game-play',
  imports: [QuizQuestion],
  templateUrl: './game-play.html',
  styleUrl: './game-play.scss',
})
export class GamePlay implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly quizApi = inject(QuizApi);
  private readonly timerService = inject(TimerService);
  private readonly destroyRef = inject(DestroyRef);

  private timerSubscription?: Subscription;
  private startTime = 0;

  /* Извлекаем вопросы, предзагруженные резолвером */
  readonly questions: Question[] = this.route.snapshot.data['questions'] ?? [];
  readonly categoryId = this.route.snapshot.paramMap.get('categoryId') ?? '';

  /* Состояние игры на Сигналах */
  readonly currentQuestionIndex = signal<number>(0);
  readonly score = signal<number>(0);
  readonly selectedAnswerIndex = signal<number | null>(null);
  readonly isAnswered = signal<boolean>(false);
  readonly remainingSeconds = signal<number>(15);

  /* Производные свойства */
  readonly currentQuestion = computed(() => this.questions[this.currentQuestionIndex()]);
  readonly totalQuestions = this.questions.length;
  readonly progressPercentage = computed(() => {
    return (this.currentQuestionIndex() / this.totalQuestions) * 100;
  });

  ngOnInit(): void {
    if (this.questions.length === 0) {
      this.router.navigate(['/quizzes']);
      return;
    }
    this.startTime = Date.now();
    this.startTimer();
  }

  /* Запуск таймера обратного отсчета для текущего вопроса */
  private startTimer(): void {
    this.timerSubscription?.unsubscribe();
    this.remainingSeconds.set(15);

    this.timerSubscription = this.timerService
      .start(15)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (seconds) => this.remainingSeconds.set(seconds),
        complete: () => {
          if (!this.isAnswered()) {
            this.handleTimeout();
          }
        },
      });
  }

  /* Обработка выбора ответа пользователем */
  onSelectAnswer(index: number): void {
    if (this.isAnswered()) return;

    this.timerSubscription?.unsubscribe();
    this.selectedAnswerIndex.set(index);
    this.isAnswered.set(true);

    const isCorrect = index === this.currentQuestion().correctAnswer;
    if (isCorrect) {
      this.score.update((s) => s + 1);
    }
  }

  /* Автоматическая обработка истечения времени */
  private handleTimeout(): void {
    this.selectedAnswerIndex.set(null);
    this.isAnswered.set(true);
  }

  /* Переход к следующему вопросу или завершение игры */
  onNextQuestion(): void {
    const nextIndex = this.currentQuestionIndex() + 1;

    if (nextIndex < this.totalQuestions) {
      this.currentQuestionIndex.set(nextIndex);
      this.selectedAnswerIndex.set(null);
      this.isAnswered.set(false);
      this.startTimer();
    } else {
      this.finishGame();
    }
  }

  /* Завершение раунда, расчет времени и сохранение результатов */
  private finishGame(): void {
    this.timerSubscription?.unsubscribe();

    const timeSpentSec = Math.floor((Date.now() - this.startTime) / 1000);
    const timeSpentFormatted = this.formatTime(timeSpentSec);

    // Временно сохраняем результаты игры в сервисе для страницы результатов
    (this.quizApi as any).activeResult = signal({
      score: this.score(),
      total: this.totalQuestions,
      categoryId: this.categoryId,
      timeSpent: timeSpentFormatted,
    });

    this.router.navigate(['/results']);
  }

  private formatTime(totalSeconds: number): string {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
