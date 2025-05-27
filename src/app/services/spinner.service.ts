import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  show() {
    setTimeout(() => this.loadingSubject.next(true));
  }

  hide() {
    setTimeout(() => this.loadingSubject.next(false));
  }
}
