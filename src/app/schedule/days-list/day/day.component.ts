import { DatePipe, TitleCasePipe } from "@angular/common";
import { Component, input } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";
import { Timestamp } from '@angular/fire/firestore';
import { DayModel } from "../../../../core/models/day.model";

@Component({
    selector: "app-day",
    standalone: true,
    imports: [MatDividerModule, DatePipe, TitleCasePipe],
    templateUrl: "./day.component.html",
    styleUrl: "./day.component.scss",
})
export class DayComponent {
    public day = input.required<DayModel>();

    public getDate(timestamp: Timestamp): Date {
        return timestamp.toDate();
    }
}
