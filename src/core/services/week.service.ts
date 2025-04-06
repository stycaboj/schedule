import { Injectable, signal } from '@angular/core';
import { DataService } from './data.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeekService {
  public currentWeek$ = new BehaviorSubject<boolean>(true);

  constructor(private readonly dataService: DataService) {}

  public getWeek(): Observable<boolean> {
    return this.currentWeek$.asObservable();
  }

  public initWeek(): void {
    const today = new Date();
    const isLight = this.isLightWeek(today);
    this.currentWeek$.next(isLight);
    sessionStorage.setItem('currentWeek', JSON.stringify(isLight));
    this.applyTheme(isLight);
  }

  public toggleWeek(): void {
    const newWeek = !this.currentWeek$.value; // TODO: .value решить
    this.currentWeek$.next(newWeek);
    sessionStorage.setItem('currentWeek', JSON.stringify(newWeek));
    this.applyTheme(newWeek);
  }

  private applyTheme(isLight: boolean): void {
    const body = document.body;
    body.classList.toggle('light-theme', isLight);
    body.classList.toggle('dark-theme', !isLight);
  }

  private isLightWeek(date: Date): boolean {
    const firstSeptember = new Date(date.getFullYear(), 8, 1);
    const weekDiff = Math.floor(
      (date.getTime() - this.dataService.getStartOfWeek(firstSeptember).getTime()) / (7 * 24 * 60 * 60 * 1000)
    );
    return weekDiff % 2 === 0;
  }
}