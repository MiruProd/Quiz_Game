import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { QuizApi } from '../../services/quiz-api.service';
import { CategoryCard } from '../../components/category-card/category-card';

@Component({
  selector: 'app-quiz-list',
  imports: [CategoryCard],
  templateUrl: './quiz-list.html',
  styleUrl: './quiz-list.scss',
})
export class QuizList {
  private readonly quizApi = inject(QuizApi);
  readonly categories = toSignal(this.quizApi.getCategories(), { initialValue: [] });
}
