import { Component, inject, signal } from "@angular/core";
import { DayModel } from "../../core/models/day.model";
import { combineLatest, Subject, takeUntil } from "rxjs";
import { FirebaseService } from "../../core/services/firebase.service";
import { SelectedGroupService } from "../../core/services/selected-group.service";
import { DateService } from "../../core/services/date.service";
import { DaysListComponent } from "../schedule/days-list/days-list.component";

@Component({
    selector: "app-edit-schedule",
    standalone: true,
    imports: [DaysListComponent],
    templateUrl: "./edit-schedule.component.html",
    styleUrl: "./edit-schedule.component.scss",
})
export class EditScheduleComponent {
    public days = signal<DayModel[]>([]); // TODO: типизация везде
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
                    this.days.set(firebaseDays);
                },
                error: (error) => {
                    console.error('Ошибка при получении дней:', error);
                }
            });
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
