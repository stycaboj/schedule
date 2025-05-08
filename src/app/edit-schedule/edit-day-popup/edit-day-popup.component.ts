import { Component, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DayModel } from "../../../core/models/day.model";
import { Timestamp } from '@angular/fire/firestore';
import { DatePipe, TitleCasePipe } from "@angular/common";
import { MatDividerModule } from '@angular/material/divider';

@Component({
    selector: "app-edit-day-popup",
    standalone: true,
    imports: [DatePipe, TitleCasePipe, MatDividerModule],
    templateUrl: "./edit-day-popup.component.html",
    styleUrl: "./edit-day-popup.component.scss",
})
export class EditDayPopupComponent {
    readonly dialogRef = inject(MatDialogRef<EditDayPopupComponent>);
    readonly data = inject<DayModel>(MAT_DIALOG_DATA);

    public getDate(timestamp: Timestamp): Date {
        return timestamp.toDate();
    }

    public onCancel(): void {
        this.dialogRef.close();
    }

    public onSave(): void {
        // Здесь будет логика сохранения
        this.dialogRef.close(this.data);
    }
}
