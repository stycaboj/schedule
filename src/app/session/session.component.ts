import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-session',
  standalone: true,
  imports: [],
  templateUrl: './session.component.html',
  styleUrl: './session.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionComponent {

}
