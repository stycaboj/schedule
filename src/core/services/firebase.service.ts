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
}
