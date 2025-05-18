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

  // Возвращает все дни недели (понедельник-воскресенье)
  public getWeekDates(startDate: Date): Date[] {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      return date;
    });
  }
}