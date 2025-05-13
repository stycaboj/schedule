import { Component, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DayModel } from "../../../core/models/day.model";
import { Timestamp } from '@angular/fire/firestore';
import { DatePipe, TitleCasePipe } from "@angular/common";
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { FirebaseService } from '../../../core/services/firebase.service';
import { Time } from '../../../core/models/time.model';
import { SubjectType } from '../../../core/models/subject-type.model';

@Component({
    selector: "app-edit-day-popup",
    standalone: true,
    imports: [
        DatePipe, 
        TitleCasePipe, 
        MatDividerModule, 
        MatSelectModule, 
        MatFormFieldModule, 
        MatInputModule, 
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: "./edit-day-popup.component.html",
    styleUrl: "./edit-day-popup.component.scss",
})
export class EditDayPopupComponent {
    readonly dialogRef = inject(MatDialogRef<EditDayPopupComponent>);
    readonly data = inject<DayModel>(MAT_DIALOG_DATA);
    private firebaseService = inject(FirebaseService);
    private fb = inject(FormBuilder);
    
    times: Time[] = [];
    types: SubjectType[] = [];
    subjectsForm: FormGroup;

    constructor() {
        this.subjectsForm = this.fb.group({
            subjects: this.fb.array([])
        });
        
        this.loadTimes();
        this.initializeSubjects();
    }

    private initializeSubjects() {
        const subjectsArray = this.subjectsForm.get('subjects') as FormArray;
        
        if (this.data.subjects && this.data.subjects.length > 0) {
            this.data.subjects.forEach(subject => {
                subjectsArray.push(this.createSubjectFormGroup(subject));
            });
        } else {
            // Добавляем один пустой предмет по умолчанию
            subjectsArray.push(this.createSubjectFormGroup());
        }
    }

    private createSubjectFormGroup(subject?: any): FormGroup {
        return this.fb.group({
            time: [subject?.time || null],
            name: [subject?.name || ''],
            room: [subject?.room || ''],
            type: [subject?.type || null],
            teacher: [subject?.teacher || '']
        });
    }

    get subjects() {
        return this.subjectsForm.get('subjects') as FormArray;
    }

    addSubject() {
        const subjectsArray = this.subjectsForm.get('subjects') as FormArray;
        subjectsArray.push(this.createSubjectFormGroup());
    }

    removeSubject(index: number) {
        const subjectsArray = this.subjectsForm.get('subjects') as FormArray;
        subjectsArray.removeAt(index);
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

    public onDelete(): void {
        this.firebaseService.clearDay(this.data.id).subscribe({
            next: () => {
                this.dialogRef.close({ ...this.data, subjects: [] });
            },
            error: (error) => {
                console.error('Ошибка при очистке дня:', error);
            }
        });
    }

    public onSave(): void {
        if (this.subjectsForm.valid) {
            const updatedData = {
                ...this.data,
                subjects: this.subjectsForm.value.subjects
            };
            
            this.firebaseService.updateDay(updatedData).subscribe({
                next: () => {
                    this.dialogRef.close(updatedData);
                },
                error: (error) => {
                    console.error('Ошибка при сохранении дня:', error);
                }
            });
        }
    }
}
