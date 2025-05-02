import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class FirebaseService {
    constructor(private firestore: AngularFirestore) {}

    // Создание нового документа
    create(collection: string, data: any) {
        return this.firestore.collection(collection).add(data);
    }

    // Получение всех документов из коллекции
    getAll(collection: string): Observable<any[]> {
        return this.firestore.collection(collection).valueChanges();
    }

    // Получение документа по ID
    getById(collection: string, id: string): Observable<any> {
        return this.firestore.collection(collection).doc(id).valueChanges();
    }

    // Обновление документа
    update(collection: string, id: string, data: any) {
        return this.firestore.collection(collection).doc(id).update(data);
    }

    // Удаление документа
    delete(collection: string, id: string) {
        return this.firestore.collection(collection).doc(id).delete();
    }
}
