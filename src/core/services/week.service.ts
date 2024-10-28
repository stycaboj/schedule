import { Injectable, signal } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class WeekService {
  public currentWeek = signal<boolean>(true);

  constructor(private readonly dataService: DataService) {}

  public initWeek(): void {
    const today = new Date();
    const isLight = this.dataService.isLightWeek(today);
    this.currentWeek.set(isLight);
    sessionStorage.setItem('currentWeek', JSON.stringify(isLight));
    this.applyTheme(isLight);
  }

  public toggleWeek(): void {
    const newWeek = !this.currentWeek();
    this.currentWeek.set(newWeek);
    sessionStorage.setItem('currentWeek', JSON.stringify(newWeek));
    this.applyTheme(newWeek);
  }

  private applyTheme(isLight: boolean): void {
    const body = document.body;
    body.classList.toggle('light-theme', isLight);
    body.classList.toggle('dark-theme', !isLight);
  }
}