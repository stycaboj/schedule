import { ChangeDetectionStrategy, Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { GroupsService } from '../../core/services/groups.service';
import { GroupModel } from '../../core/models/group.model';
import { WeekService } from '../../core/services/week.service';
import { CommonModule, NgClass } from '@angular/common';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatSelectModule, NgClass, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {
  public groups$ = new BehaviorSubject<Array<GroupModel> | null>(null);
  public selectedGroup$ = new BehaviorSubject<string | null>(null);
  public isLightWeek$: Observable<boolean>; // TODO: лучше ли это
  private destroy$ = new Subject();

  constructor(
    private readonly groupsService: GroupsService,
    private readonly weekService: WeekService
  ) {
    this.isLightWeek$ = this.weekService.getWeek();
  }

  public ngOnInit(): void {
    console.log(this.selectedGroup$);
    this.getGroupsList();
    const storedGroup = localStorage.getItem('storedGroup');
    if (storedGroup) {
      this.selectedGroup$.next(storedGroup);
      console.log(storedGroup)
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
      .subscribe((items) => this.groups$.next(items));
  }

  public onGroupChange(groupId: string): void {
    this.selectedGroup$.next(groupId);
    this.groupsService.saveSelectedGroup(groupId);
  }
}
