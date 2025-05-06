import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnDestroy,
    OnInit,
} from "@angular/core";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule, MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { GroupsService } from "../../core/services/groups.service";
import { GroupModel } from "../../core/models/group.model";
import { WeekService } from "../../core/services/week.service";
import { CommonModule, NgClass } from "@angular/common";
import { BehaviorSubject, Observable, Subject, takeUntil } from "rxjs";
import { SelectedGroupService } from "../../core/services/selected-group.service";
import { DateService } from "../../core/services/date.service";

@Component({
    selector: "app-header",
    standalone: true,
    imports: [MatSelectModule, NgClass, CommonModule, MatDatepickerModule, MatFormFieldModule, MatInputModule],
    templateUrl: "./header.component.html",
    styleUrl: "./header.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
    public groups$ = new BehaviorSubject<Array<GroupModel> | null>(null);
    public selectedGroup$ = new BehaviorSubject<string | null>(null);
    public isLightWeek$: Observable<boolean>; // TODO: лучше ли это
    private destroy$ = new Subject();
    private readonly dateService: DateService = inject(DateService);

    constructor(
        private readonly groupsService: GroupsService,
        private readonly weekService: WeekService,
        private readonly selectedGroupService: SelectedGroupService
    ) {
        this.isLightWeek$ = this.weekService.getWeek();
    }

    public ngOnInit(): void {
        this.getGroupsList();
        const storedGroup = localStorage.getItem("selectedGroup");
        if (storedGroup) {
            this.selectedGroup$.next(storedGroup);
            this.selectedGroupService.setSelectedGroup(storedGroup);
        }
    }

    public ngOnDestroy(): void {
        this.destroy$.next(null);
        this.destroy$.complete();
    }

    public getGroupsList(): void {
        this.groupsService
            .get()
            .pipe(takeUntil(this.destroy$))
            .subscribe((groups) => {
                this.groups$.next(groups);
            });
    }

    public onGroupChange(groupId: string): void {
        this.selectedGroup$.next(groupId);
        this.selectedGroupService.setSelectedGroup(groupId);
        this.groupsService.saveSelectedGroup(groupId);
    }

    public onDateSelected(date: MatDatepickerInputEvent<Date>): void {
        if (date && date.value) {
            this.dateService.setDate(date.value);
        }
    }
}
