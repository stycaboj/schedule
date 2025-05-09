import { Component, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DayModel } from "../../../core/models/day.model";
import { Timestamp } from '@angular/fire/firestore';
import { DatePipe, TitleCasePipe } from "@angular/common";
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../../core/services/firebase.service';
import { Time } from '../../../core/models/time.model';
import { SubjectType } from '../../../core/models/subject-type.model';

@Component({
    selector: "app-edit-day-popup",
    standalone: true,
    imports: [DatePipe, TitleCasePipe, MatDividerModule, MatSelectModule, MatFormFieldModule, MatInputModule, FormsModule],
    templateUrl: "./edit-day-popup.component.html",
    styleUrl: "./edit-day-popup.component.scss",
})
export class EditDayPopupComponent {
    readonly dialogRef = inject(MatDialogRef<EditDayPopupComponent>);
    readonly data = inject<DayModel>(MAT_DIALOG_DATA);
    private firebaseService = inject(FirebaseService);
    
    times: Time[] = [];
    types: SubjectType[] = [];
    selectedType: SubjectType | null = null;

    constructor() {
        this.loadTimes();
    }

    private async loadTimes() {
        this.firebaseService.getTimes().subscribe(times => {
            this.times = times;
        });
        this.firebaseService.getSubjectTypes().subscribe(types => {
            this.types = types;
        });
    }

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
