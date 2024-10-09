import { DayModel } from './day.model';

export interface WeekModel {
  type: 'light' | 'dark';
  days: DayModel[];
}
