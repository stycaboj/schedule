import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  // Возвращает понедельник для указанной даты
  public getStartOfWeek(date: Date): Date {
    const day = date.getDay() || 7; // Если воскресенье (0), возвращаем 7
    return new Date(date.setDate(date.getDate() - day + 1));
  }

  // Определяет, светлая ли неделя
  public isLightWeek(date: Date): boolean {
    const firstSeptember = new Date(date.getFullYear(), 8, 1);
    const weekDiff = Math.floor(
      (date.getTime() - this.getStartOfWeek(firstSeptember).getTime()) / (7 * 24 * 60 * 60 * 1000)
    );
    return weekDiff % 2 === 0; // Чётные недели – светлые
  }

  // Возвращает все дни недели (понедельник-воскресенье)
  public getWeekDates(startDate: Date): Date[] {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      return date;
    });
  }
}