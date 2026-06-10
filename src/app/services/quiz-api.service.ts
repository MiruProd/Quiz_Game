import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Category, Question } from '../models/quiz.model';

@Injectable({
  providedIn: 'root',
})
export class QuizApi {
  private readonly api = inject(ApiService);

  /* Хранилище результата последнего сыгранного раунда */
  readonly activeResult = signal<{
    score: number;
    total: number;
    categoryId: string;
    timeSpent: string;
  } | null>(null);

  /* Получение списка всех категорий */
  getCategories(): Observable<Category[]> {
    return this.api.get<Category[]>('categories');
  }

  /* Получение категории по ID */
  getCategory(id: string): Observable<Category> {
    return this.api.get<Category>(`categories/${id}`);
  }

  /* Получение списка вопросов для конкретной категории */
  getQuestions(categoryId: string): Observable<Question[]> {
    return this.getCategory(categoryId).pipe(map((category) => category.questions ?? []));
  }
}
