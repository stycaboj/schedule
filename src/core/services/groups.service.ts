import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GroupModel } from '../models/group.model';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private apiUrl = 'http://localhost:3000'

  constructor(private readonly httpClient: HttpClient) {}

  public httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  public get(): Observable<Array<GroupModel>> {
    return this.httpClient.get<Array<GroupModel>>(`${this.apiUrl}/groups`);
  }
}
