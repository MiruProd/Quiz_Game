import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Произошла непредвиденная ошибка сети.';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Сбой на стороне клиента: ${error.error.message}`;
      } else {
        switch (error.status) {
          case 0:
            errorMessage =
              'Локальный бэкенд-сервер недоступен. Проверьте, запущен ли json-server (npm run backend).';
            break;
          case 404:
            errorMessage = `Ресурс не найден (404). Не удалось загрузить данные по адресу: ${req.url}`;
            break;
          case 500:
            errorMessage = 'Внутренняя ошибка сервера (500). Сбой в работе mock-бэкенда.';
            break;
          default:
            errorMessage = `Ошибка сервера (Код ${error.status}): ${error.message}`;
        }
      }
      console.error('httpErrorInterceptor detected:', errorMessage);
      return throwError(() => new Error(errorMessage));
    }),
  );
};
