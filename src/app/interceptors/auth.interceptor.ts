import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../services/auth-store.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const user = authStore.currentUser();

  if (user?.token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    return next(clonedReq);
  }

  return next(req);
};
