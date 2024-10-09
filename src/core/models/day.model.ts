import { SubjectModel } from './subject.model';

export interface DayModel {
  name: string;
  subjects: SubjectModel[];
}
