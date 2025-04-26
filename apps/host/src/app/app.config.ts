import { ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { RemoteRegistryService } from '@mfe-prototype/shared-services';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(appRoutes),
    {
      provide: 'APP_INITIALIZER',
      useFactory: () => {
        const service = inject(RemoteRegistryService);
        const router = inject(Router);
        return () => service.loadDefaultRemote(router);
      },
      deps: [],
      multi: true
    }
  ]
};
