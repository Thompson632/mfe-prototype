import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { loadRemote } from '@module-federation/enhanced/runtime';
import { RemoteApp } from './remote-app.model';

@Injectable({
  providedIn: 'root'
})
export class RemoteRegistryService {
  private static readonly REMOTES_JSON = 'remotes.json';

  async loadDefaultRemote(router: Router) {
    const response = await fetch(RemoteRegistryService.REMOTES_JSON);
    const remotes: RemoteApp[] = await response.json();

    const defaultRemote = remotes.find((r) => r.isDefault);

    if (defaultRemote) {
      const remotePath = `${defaultRemote.name}/${defaultRemote.exposedModule.replace('./', '')}`;
      console.log(`Building default route as: [${remotePath}]`);

      router.resetConfig([
        {
          path: '',
          loadChildren: () =>
            loadRemote(remotePath).then((m: any) => m.remoteRoutes)
        }
      ]);
    }
  }

  async fetchRemotes(): Promise<RemoteApp[]> {
    const response = await fetch(RemoteRegistryService.REMOTES_JSON);
    return await response.json();
  }
}
