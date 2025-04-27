import { Route } from '@angular/router';
import { RemoteEntryComponent } from './entry.component';
import { HealthComponent } from '../health/health.component';

export const remoteRoutes: Route[] = [
  { path: '', component: RemoteEntryComponent },
  { path: 'health', component: HealthComponent },
];
