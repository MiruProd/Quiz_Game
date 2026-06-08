import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { QuizApi } from '../services/quiz-api.service';
import { Question } from '../models/quiz.model';
export const questionsResolver: ResolveFn<Question[]> = (route: ActivatedRouteSnapshot) => {
  const quizApi = inject(QuizApi);
  const categoryId = route.paramMap.get('categoryId') ?? '';
  return quizApi.getQuestions(categoryId);
};
