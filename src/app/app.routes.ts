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
        path: 'edit-schedule',
        loadComponent: () =>
          import('./edit-schedule/edit-schedule.component').then((m) => m.EditScheduleComponent),
    }
];