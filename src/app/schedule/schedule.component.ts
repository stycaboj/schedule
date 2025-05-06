import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { DataService } from "../../core/services/data.service";
import { GroupModel } from "../../core/models/group.model";
import { GroupsService } from "../../core/services/groups.service";
import { DayModel } from "../../core/models/day.model";
import { DaysListComponent } from "./days-list/days-list.component";
import { Subject, takeUntil, combineLatest } from "rxjs";
import { FirebaseService } from "../../core/services/firebase.service";
import { SelectedGroupService } from "../../core/services/selected-group.service";
import { DateService } from "../../core/services/date.service";

@Component({
    selector: "app-schedule",
    standalone: true,
    imports: [DaysListComponent],
    templateUrl: "./schedule.component.html",
    styleUrl: "./schedule.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent implements OnInit, OnDestroy {
    public days = signal<DayModel[]>([]); // TODO: типизация везде
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
