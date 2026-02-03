import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { EventCalendar } from './features/event-calendar/event-calendar';
import { Spaces } from './features/spaces/spaces';

export const routes: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'events', component: EventCalendar },
  { path: 'spaces', component: Spaces },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
