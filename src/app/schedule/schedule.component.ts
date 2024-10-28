import { Component, computed, OnInit } from '@angular/core';
import { WeekService } from '../../core/services/week.service';
import { DataService } from '../../core/services/data.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [NgClass],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent {
  public isLightWeek = computed(() => this.weekService.currentWeek());

  constructor(private readonly weekService: WeekService) {}

  public setLightWeek(): void {
    if (!this.isLightWeek()) {
      this.weekService.toggleWeek();
    }
  }

  public setDarkWeek(): void {
    if (this.isLightWeek()) {
      this.weekService.toggleWeek();
    }
  }
}
