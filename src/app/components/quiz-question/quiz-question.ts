import { Component, input, output } from '@angular/core';
import { Question } from '../../models/quiz.model';

@Component({
  selector: 'app-quiz-question',
  imports: [],
  templateUrl: './quiz-question.html',
  styleUrl: './quiz-question.scss',
})
export class QuizQuestion {
  readonly question = input.required<Question>();
  readonly selectedAnswerIndex = input<number | null>(null);
  readonly isAnswered = input<boolean>(false);

  readonly selectAnswer = output<number>();

  onOptionClick(index: number): void {
    if (this.isAnswered()) return;
    this.selectAnswer.emit(index);
  }
}
