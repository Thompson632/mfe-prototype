import { ApplicationConfig, APP_INITIALIZER, inject, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { appRoutes } from './app.routes';
import { RemoteRegistryService } from '@mfe-prototype/shared-services';

export function initDefaultRemote() {
  return () => {
    const remoteService = inject(RemoteRegistryService);
    const router = inject(Router);
    return remoteService.loadDefaultRemote(router);
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(appRoutes),
    RemoteRegistryService,
    {
      provide: APP_INITIALIZER,
      useFactory: initDefaultRemote,
      multi: true,
      deps: []
    }
  ]
};
