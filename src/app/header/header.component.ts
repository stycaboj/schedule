import { Component, computed, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { GroupsService } from '../../core/services/groups.service';
import { GroupModel } from '../../core/models/group.model';
import { WeekService } from '../../core/services/week.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatSelectModule, NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  public groups = signal<Array<GroupModel>>([]);
  public isLightWeek = computed(() => this.weekService.currentWeek());

  constructor(
    private readonly groupsService: GroupsService,
    private readonly weekService: WeekService
  ) {}

  public ngOnInit(): void {
    this.groupsService.get().subscribe((groups) => this.groups.set(groups));
  }

  public get iterableGroups(): GroupModel[] {
    return this.groups();
  }
}