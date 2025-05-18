import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { BehaviorSubject, Observable, Subject, switchMap } from "rxjs";
import { GroupModel } from "../models/group.model";
import { FirebaseService } from "./firebase.service";

@Injectable({
    providedIn: "root",
})
export class GroupsService {
    private selectedGroupId$ = new BehaviorSubject<string | null>(null);
    private apiUrl = "http://localhost:3000";
    private isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
    private readonly firebaseService: FirebaseService = inject(FirebaseService);

    constructor(private readonly httpClient: HttpClient) {}

    public httpOptions = {
        headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };

    public get(): Observable<GroupModel[]> {
        return this.firebaseService.getGroups();
    }

    public saveSelectedGroup(groupId: string): void {
        localStorage.setItem("selectedGroup", groupId);
        this.selectedGroupId$.next(groupId);
    }

    public getSelectedGroup(): Observable<GroupModel | null> {
        return this.selectedGroupId$.pipe(
            switchMap((id) => this.getGroupById(Number(id)))
        );
    }

    public getGroupById(id: number): Observable<GroupModel> {
        return this.httpClient.get<GroupModel>(`${this.apiUrl}/groups/${id}`);
    }
}
