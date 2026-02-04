import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { EventCalendar } from './features/event-calendar/event-calendar';
import { Spaces } from './features/spaces/spaces';
import { SpaceForm } from './common/space-form/space-form';

export const routes: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'events', component: EventCalendar },
  { path: 'spaces', component: Spaces },
  { path: 'space-form', component: SpaceForm },
  { path: 'space-form/:id', component: SpaceForm },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
