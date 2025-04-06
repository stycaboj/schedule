import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, Subject, switchMap } from 'rxjs';
import { GroupModel } from '../models/group.model';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private selectedGroupId$ = new BehaviorSubject<string | null>(null);
  private apiUrl = 'http://localhost:3000';

  constructor(private readonly httpClient: HttpClient) {}

  public httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  public get(): Observable<Array<GroupModel>> {
    return this.httpClient.get<Array<GroupModel>>(`${this.apiUrl}/groups`);
  }

  public saveSelectedGroup(groupId: string): void {
    localStorage.setItem('selectedGroup', groupId);
    this.selectedGroupId$.next(groupId);
  }
  
  public getSelectedGroup(): Observable<GroupModel | null> {
    return this.selectedGroupId$.pipe(
      switchMap(id => this.getGroupById(Number(id)))
    );
  }

  public getGroupById(id: number): Observable<GroupModel> {
    return this.httpClient.get<GroupModel>(`${this.apiUrl}/groups/${id}`);
  }
}
