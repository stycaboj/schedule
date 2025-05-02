import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class FirebaseService {
    constructor(private firestore: AngularFirestore) {}

    public getGroups(): Observable<any[]> {
        return this.firestore.collection('groups').valueChanges({ idField: 'id' });
    }

    public getDaysByGroup(groupId: string): Observable<any[]> {
        return this.firestore.collection('days', ref =>
            ref.where('groupId', '==', groupId)
              .orderBy('date', 'asc')  // Сортировка по дате (от старых к новым)
        ).valueChanges({ idField: 'docId' });  // Добавляем ID документа в данные
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
