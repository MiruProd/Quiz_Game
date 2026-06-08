import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  start(seconds: number): Observable<number> {
    return interval(1000).pipe(
      map((tick) => seconds - tick - 1),
      take(seconds),
    );
  }
}
