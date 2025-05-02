import { DatePipe, TitleCasePipe } from "@angular/common";
import { Component, input } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";
import { Timestamp } from '@angular/fire/firestore';

@Component({
    selector: "app-day",
    standalone: true,
    imports: [MatDividerModule, DatePipe, TitleCasePipe],
    templateUrl: "./day.component.html",
    styleUrl: "./day.component.scss",
})
export class DayComponent {
    public day = input.required<any>();

    public getDate(timestamp: Timestamp): Date {
        return timestamp.toDate();
    }
}
