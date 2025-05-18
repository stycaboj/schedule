import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SelectedGroupService { // TODO: добавить везде типизацию
    private selectedGroup$ = new BehaviorSubject<string | null>(null);

    public getSelectedGroup() {
        return this.selectedGroup$.asObservable();
    }

    public setSelectedGroup(groupId: string | null) {
        this.selectedGroup$.next(groupId);
    }
} 