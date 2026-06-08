import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map } from 'rxjs/operators';
import { QuizApi } from '../../services/quiz-api.service';

@Component({
  selector: 'app-quiz-detail',
  imports: [RouterLink],
  templateUrl: './quiz-detail.html',
  styleUrl: './quiz-detail.scss',
})
export class QuizDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly quizApi = inject(QuizApi);
  readonly category = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('categoryId') ?? ''),
      switchMap((id) => this.quizApi.getCategory(id)),
    ),
  );
}
