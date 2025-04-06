import { SubjectModel } from './subject.model';

export interface DayModel {
  id: number;
  name: string;
  date: string;
  subjects: SubjectModel[];
}