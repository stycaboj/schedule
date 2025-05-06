import { SubjectModel } from './subject.model';
import { Timestamp } from '@angular/fire/firestore';

export interface DayModel {
  id: number;
  name: string;
  date: Timestamp; // TODO: перевести в ISO
  subjects: SubjectModel[];
}