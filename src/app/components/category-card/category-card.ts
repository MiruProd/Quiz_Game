import { Component, input, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../../models/quiz.model';

@Component({
  selector: 'app-category-card',
  imports: [RouterLink],
  templateUrl: './category-card.html',
  styleUrl: './category-card.scss',
})
export class CategoryCard {
  readonly category = input.required<Category>();

  /* Вычисляем класс иконки на основе ID категории */
  readonly iconClass = computed(() => {
    switch (this.category().id) {
      case 'technologies':
        return 'icon-rocket';
      case 'geography':
        return 'icon-planet';
      case 'science':
        return 'icon-flask';
      case 'cinema':
        return 'icon-trophy';
      default:
        return 'icon-question';
    }
  });
}
