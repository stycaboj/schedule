import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { DataService } from "../../core/services/data.service";
import { GroupModel } from "../../core/models/group.model";
import { GroupsService } from "../../core/services/groups.service";
import { DayModel } from "../../core/models/day.model";
import { DaysListComponent } from "./days-list/days-list.component";
import { Subject, takeUntil } from "rxjs";
import { FirebaseService } from "../../core/services/firebase.service";

@Component({
    selector: "app-schedule",
    standalone: true,
    imports: [DaysListComponent],
    templateUrl: "./schedule.component.html",
    styleUrl: "./schedule.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent implements OnInit, OnDestroy {
    public days = signal<DayModel[]>([]);
    private readonly destroy$ = new Subject<void>();
    private readonly firebaseService: FirebaseService = inject(FirebaseService);

    constructor() {}

    public ngOnInit(): void {
        this.firebaseService.getAll('days')
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

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
