import { ApplicationConfig, APP_INITIALIZER, inject, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { appRoutes } from './app.routes';
import { RemoteRegistryService, REMOTES_PATH } from '@mfe-prototype/shared-services'; // Import REMOTES_PATH token
import { environment } from '../environments/environment';

export function initDefaultRemote() {
  return () => {
    const remoteService = inject(RemoteRegistryService);
    const router = inject(Router);
    return remoteService.initDefaultRoute(router);
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(appRoutes),
    {
      provide: REMOTES_PATH,
      useValue: environment.remotesPath
    },
    RemoteRegistryService,
    {
      provide: APP_INITIALIZER,
      useFactory: initDefaultRemote,
      multi: true,
      deps: []
    }
  ]
};
