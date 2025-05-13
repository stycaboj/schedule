import { SubjectModel } from './subject.model';
import { Timestamp } from '@angular/fire/firestore';

export interface DayModel {
  id: string;
  name: string;
  date: Timestamp; // TODO: перевести в ISO
  groupId: string;
  subjects: SubjectModel[];
}