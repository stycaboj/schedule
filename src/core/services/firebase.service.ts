import { inject, Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Observable, map } from "rxjs";
import { DayModel } from "../models/day.model";
import { Timestamp } from "@angular/fire/firestore";

@Injectable({
    providedIn: "root",
})
export class FirebaseService {
    readonly firestore = inject(AngularFirestore);

    public getGroups(): Observable<any[]> { // TODO: все any убрать
        return this.firestore.collection('groups').valueChanges({ idField: 'id' });
    }

    public getTimes(): Observable<any[]> {
        return this.firestore.collection('times').valueChanges({ idField: 'id' });
    }

    public getSubjectTypes(): Observable<any[]> {
        return this.firestore.collection('subject-types').valueChanges({ idField: 'id' });
    }

    public getDaysByGroupAndDateRange(groupId: string, startDate: string, endDate: string): Observable<DayModel[]> {
        // Устанавливаем время 00:00:00 для начальной даты
        const startDateTime = new Date(startDate);
        startDateTime.setHours(0, 0, 0, 0);
        
        // Устанавливаем время 23:59:59 для конечной даты
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        
        const startTimestamp = Timestamp.fromDate(startDateTime);
        const endTimestamp = Timestamp.fromDate(endDateTime);

        // Сначала получим все дни для группы, чтобы проверить данные
        this.firestore.collection<DayModel>('days', ref =>
            ref.where('groupId', '==', groupId)
        ).get().subscribe(snapshot => {
            console.log('Все дни для группы:', snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
                date: doc.data().date?.toDate()
            })));
        });
        
        return this.firestore.collection<DayModel>('days', ref =>
            ref.where('groupId', '==', groupId)
                .where('date', '>=', startTimestamp)
                .where('date', '<=', endTimestamp)
                .orderBy('date')
            ).valueChanges().pipe(
                map(days => days.map(day => ({
                    ...day,
                    subjects: Array.isArray(day.subjects) ? day.subjects : [day.subjects]
                })))
            );
    }
    
    public create(collection: string, data: any) {
        return this.firestore.collection(collection).add(data);
    }

    public getAll(collection: string): Observable<any[]> {
        return this.firestore.collection(collection).valueChanges();
    }

    public getById(collection: string, id: string): Observable<any> {
        return this.firestore.collection(collection).doc(id).valueChanges();
    }

    public update(collection: string, id: string, data: any) {
        return this.firestore.collection(collection).doc(id).update(data);
    }

    public delete(collection: string, id: string) {
        return this.firestore.collection(collection).doc(id).delete();
    }

    private generateDayId(groupId: string, date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${groupId}_${year}-${month}-${day}`;
    }

    public createDay(day: DayModel): Observable<void> {
        return new Observable(observer => {
            const dayId = this.generateDayId(day.groupId, day.date.toDate());
            this.firestore.collection('days').doc(dayId).set({
                ...day,
                id: dayId,
                updatedAt: Timestamp.now()
            }).then(() => {
                observer.next();
                observer.complete();
            }).catch(error => {
                observer.error(error);
            });
        });
    }

    public updateDay(day: DayModel): Observable<void> {
        return new Observable(observer => {
            const dayId = this.generateDayId(day.groupId, day.date.toDate());
            
            // Сначала проверяем существование документа
            this.firestore.collection('days').doc(dayId).get().subscribe(doc => {
                if (!doc.exists) {
                    // Если документа нет, создаем его
                    this.createDay({
                        ...day,
                        id: dayId
                    }).subscribe({
                        next: () => {
                            observer.next();
                            observer.complete();
                        },
                        error: (error) => {
                            observer.error(error);
                        }
                    });
                } else {
                    // Если документ существует, обновляем его
                    this.firestore.collection('days').doc(dayId).update({
                        subjects: day.subjects,
                        updatedAt: Timestamp.now()
                    }).then(() => {
                        observer.next();
                        observer.complete();
                    }).catch(error => {
                        observer.error(error);
                    });
                }
            });
        });
    }

    public clearDay(day: DayModel): Observable<void> {
        return new Observable(observer => {
            const dayId = this.generateDayId(day.groupId, day.date.toDate());
            
            // Сначала проверяем существование документа
            this.firestore.collection('days').doc(dayId).get().subscribe(doc => {
                if (!doc.exists) {
                    // Если документа нет, создаем его с пустым списком предметов
                    this.createDay({
                        ...day,
                        id: dayId,
                        subjects: []
                    }).subscribe({
                        next: () => {
                            observer.next();
                            observer.complete();
                        },
                        error: (error) => {
                            observer.error(error);
                        }
                    });
                } else {
                    // Если документ существует, обновляем его
                    this.firestore.collection('days').doc(dayId).update({
                        subjects: [],
                        updatedAt: Timestamp.now()
                    }).then(() => {
                        observer.next();
                        observer.complete();
                    }).catch(error => {
                        observer.error(error);
                    });
                }
            });
        });
    }
}
