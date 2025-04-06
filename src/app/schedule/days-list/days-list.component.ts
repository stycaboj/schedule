import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DayModel } from '../../../core/models/day.model';
import { DayComponent } from './day/day.component';

@Component({
  selector: 'app-days-list',
  standalone: true,
  imports: [DayComponent],
  templateUrl: './days-list.component.html',
  styleUrl: './days-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DaysListComponent {
  public days = input<DayModel[]>([]);
}