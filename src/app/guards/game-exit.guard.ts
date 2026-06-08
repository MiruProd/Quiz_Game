import { CanDeactivateFn } from '@angular/router';
import { GamePlay } from '../pages/game-play/game-play';

export const gameExitGuard: CanDeactivateFn<GamePlay> = (component) => {
  // Если раунд полностью завершен и отвечен последний вопрос, разрешаем выход без предупреждения
  if (component.currentQuestionIndex() + 1 === component.totalQuestions && component.isAnswered()) {
    return true;
  }

  return confirm('Раунд не завершён, результаты будут потеряны.');
};
