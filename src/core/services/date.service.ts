// date.service.ts
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class DateService {
    public selectedDate$ = new BehaviorSubject<Date>(new Date()); // TODO: переписать сабжекты на сигналы по возможности

    public setDate(date: Date) {
        this.selectedDate$.next(date);
    }

    public getCurrentWeekDates(date: Date): { start: Date; end: Date } {
        const start = new Date(date);
        start.setDate(
            date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)
        ); // Понедельник

        const end = new Date(start);
        end.setDate(start.getDate() + 6); // Воскресенье

        return { start, end };
    }
}