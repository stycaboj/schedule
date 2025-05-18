import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { DayModel } from "../../core/models/day.model";
import { combineLatest, Subject, takeUntil } from "rxjs";
import { FirebaseService } from "../../core/services/firebase.service";
import { SelectedGroupService } from "../../core/services/selected-group.service";
import { DateService } from "../../core/services/date.service";
import { DaysListComponent } from "../schedule/days-list/days-list.component";
import { Timestamp } from "@angular/fire/firestore";

@Component({
    selector: "app-edit-schedule",
    standalone: true,
    imports: [DaysListComponent],
    templateUrl: "./edit-schedule.component.html",
    styleUrl: "./edit-schedule.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditScheduleComponent implements OnInit, OnDestroy {
    public days = signal<DayModel[]>([]);
    public isEdit = true;
    private readonly destroy$ = new Subject<void>();
    private readonly firebaseService: FirebaseService = inject(FirebaseService);
    private readonly selectedGroupService: SelectedGroupService = inject(SelectedGroupService);
    private readonly dateService: DateService = inject(DateService);

    constructor() {}

    public ngOnInit(): void {
        combineLatest([
            this.selectedGroupService.getSelectedGroup(),
            this.dateService.selectedDate$
        ]).pipe(
            takeUntil(this.destroy$)
        ).subscribe(([groupId, _]) => {
            if (!groupId) {
                console.warn('Группа не выбрана');
                return;
            }
            this.loadSchedule(groupId);
        });
    }

    private loadSchedule(groupId: string): void {
        const selectedDate = this.dateService.selectedDate$.value;
        const { start, end } = this.dateService.getCurrentWeekDates(selectedDate);
        const startDate = this.formatDate(start);
        const endDate = this.formatDate(end);
        
        console.log('Загрузка расписания:', { groupId, startDate, endDate });
        
        this.firebaseService.getDaysByGroupAndDateRange(groupId, startDate, endDate)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (firebaseDays) => {
                    console.log('Дни из Firebase:', firebaseDays);
                    if (firebaseDays.length === 0) {
                        // Если дней нет, создаем пустые дни
                        const emptyDays = this.createEmptyDays(groupId, start);
                        this.days.set(emptyDays);
                    } else {
                        // Проверяем наличие всех дней недели
                        const allDays = this.ensureAllDaysExist(firebaseDays, groupId, start);
                        this.days.set(allDays);
                    }
                },
                error: (error) => {
                    console.error('Ошибка при получении дней:', error);
                }
            });
    }

    private createEmptyDays(groupId: string, startDate: Date): DayModel[] {
        const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        return daysOfWeek.map((name, index) => {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + index);
            
            return {
                id: this.firebaseService.generateDayId(groupId, date),
                name,
                date: Timestamp.fromDate(date),
                groupId,
                subjects: []
            };
        });
    }

    private ensureAllDaysExist(existingDays: DayModel[], groupId: string, startDate: Date): DayModel[] {
        const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        const result: DayModel[] = [];

        // Создаем мапу существующих дней по дате
        const existingDaysMap = new Map(
            existingDays.map(day => [day.date.toDate().toDateString(), day])
        );

        // Проходим по всем дням недели
        daysOfWeek.forEach((name, index) => {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + index);
            const dateString = date.toDateString();

            // Если день существует, добавляем его, иначе создаем пустой
            if (existingDaysMap.has(dateString)) {
                result.push(existingDaysMap.get(dateString)!);
            } else {
                result.push({
                    id: this.firebaseService.generateDayId(groupId, date),
                    name,
                    date: Timestamp.fromDate(date),
                    groupId,
                    subjects: []
                });
            }
        });

        return result;
    }

    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
