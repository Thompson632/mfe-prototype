import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

declare const __webpack_init_sharing__: any;
declare const __webpack_share_scopes__: any;

@Injectable({
  providedIn: 'root'
})
export class RemoteRegistryService {
  constructor() {}

  async loadDefaultRemote(router: Router) {
    const response = await fetch('/assets/remotes.json');
    const remotes = await response.json();

    const defaultRemote = remotes.find((r: any) => r.isDefault);

    if (defaultRemote) {
      router.resetConfig([
        {
          path: '',
          loadChildren: () => loadRemoteModule(defaultRemote).then((m) => m[Object.keys(m)[0]])
        }
      ]);
    }
  }

  async fetchRemotes() {
    const response = await fetch('/assets/remotes.json');
    return await response.json();
  }
}

async function loadRemoteModule(remote: any) {
  await __webpack_init_sharing__('default');
  const container = (window as any)[remote.name];
  await container.init(__webpack_share_scopes__.default);
  const factory = await container.get(remote.exposedModule);
  return factory();
}
