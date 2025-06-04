import { DatePipe, TitleCasePipe } from "@angular/common";
import { Component, inject, input } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Timestamp } from '@angular/fire/firestore';
import { DayModel } from "../../../../core/models/day.model";
import { EditDayPopupComponent } from "../../../edit-schedule/edit-day-popup/edit-day-popup.component";

@Component({
    selector: "app-day",
    standalone: true,
    imports: [MatDividerModule, DatePipe, TitleCasePipe, MatDialogModule],
    templateUrl: "./day.component.html",
    styleUrl: "./day.component.scss",
})
export class DayComponent {
    public day = input.required<DayModel>();
    public isEdit = input<boolean>();
    readonly dialog = inject(MatDialog);

    public getDate(timestamp: Timestamp): Date {
        return timestamp.toDate();
    }

    public hasSubjects(): boolean {
        return this.day().subjects.length > 0 && this.day().subjects.every(subject => subject !== undefined && subject !== null);
    }

    public openEditDialog(): void {
        this.dialog.open(EditDayPopupComponent, {
            width: '500px',
            data: this.day()
        });
    }

    public isCurrentDay(): boolean {
        const today = new Date();
        const dayDate = this.getDate(this.day().date);
        return today.getDate() === dayDate.getDate() && today.getMonth() === dayDate.getMonth() && today.getFullYear() === dayDate.getFullYear();
    }

    public isCurrentSubject(time: string): boolean {
        const now = new Date();
        
        if (!this.isCurrentDay()) {
            return false;
        }

        const [startTime, endTime] = time.split('-').map(t => {
            const [hours, minutes] = t.trim().split(':').map(Number);
            const date = new Date();
            date.setHours(hours, minutes, 0, 0);
            return date;
        });

        return now >= startTime && now <= endTime;
    }

    private isExam(): boolean {
        return true;
    }
}
