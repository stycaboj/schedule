import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { WeekService } from '../../core/services/week.service';
import { DataService } from '../../core/services/data.service';
import { NgClass } from '@angular/common';
import { GroupModel } from '../../core/models/group.model';
import { GroupsService } from '../../core/services/groups.service';
import { DayModel } from '../../core/models/day.model';
import { DaysListComponent } from './days-list/days-list.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [NgClass, DaysListComponent],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent implements OnInit, OnDestroy {
  public days = signal<DayModel[]>([]);
  private destroy$ = new Subject();

  constructor(
    private readonly dataService: DataService,
    private readonly groupsService: GroupsService,
    private readonly weekService: WeekService
  ) {}

  public ngOnInit(): void {
    this.weekService
      .getWeek()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLightWeek) => {
        this.getSelectedGroup(isLightWeek);
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  private getSelectedGroup(isLightWeek: boolean, baseDate: Date = new Date()): void {
    this.groupsService
      .getSelectedGroup()
      .pipe(takeUntil(this.destroy$))
      .subscribe((group) => this.loadWeekSchedule(group, isLightWeek, baseDate));
  }


  private loadWeekSchedule(group: GroupModel | null, isLightWeek: boolean, baseDate: Date = new Date()): void {
    if (group) {
      const weekType = isLightWeek ? 'light' : 'dark';
      const week = group.weeks.find((w) => w.type === weekType);
  
      if (week) {
        const startOfWeek = this.dataService.getStartOfWeek(baseDate);
        const weekDates = this.dataService.getWeekDates(startOfWeek);
  
        const updatedDays = week.days.map((day, index) => ({
          ...day,
          date: weekDates[index].toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
          }),
        }));
  
        this.days.set(updatedDays);
      } else {
        this.days.set([]);
      }
    }
  }
  

  public getDateForDay(dayIndex: number): string {
    const startOfWeek = this.dataService.getStartOfWeek(new Date());
    const dayDate = new Date(startOfWeek);
    dayDate.setDate(startOfWeek.getDate() + dayIndex);
    return dayDate.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
    });
  }

  public setLightWeek(): void {
    if (!this.weekService.currentWeek$.value) {
      this.weekService.toggleWeek();
      const nextWeekDate = new Date();
      nextWeekDate.setDate(this.dataService.getStartOfWeek(new Date()).getDate() + 7);
      this.getSelectedGroup(true, nextWeekDate);
    }
  }
  
  public setDarkWeek(): void {
    if (this.weekService.currentWeek$.value) {
      this.weekService.toggleWeek();
      const nextWeekDate = new Date();
      nextWeekDate.setDate(this.dataService.getStartOfWeek(new Date()).getDate() + 7);
      this.getSelectedGroup(false, nextWeekDate);
    }
  }
}
