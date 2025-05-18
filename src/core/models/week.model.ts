import { DayModel } from './day.model';

export interface WeekModel {
  id: number;
  type: 'light' | 'dark';
  days: DayModel[];
}