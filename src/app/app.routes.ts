import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'schedule',
    pathMatch: 'full',
  },
  {
    path: 'schedule',
    loadComponent: () =>
      import('./schedule/schedule.component').then((m) => m.ScheduleComponent),
  },
  {
    path: 'session',
    loadComponent: () =>
      import('./session/session.component').then((m) => m.SessionComponent),
  },
];