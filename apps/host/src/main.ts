
import { init } from '@module-federation/enhanced/runtime';
import { RemoteApp } from '@mfe-prototype/shared-services';

fetch('remotes.json')
  .then((response) => response.json())
  .then((remotes: RemoteApp[]) =>
    remotes
      .filter((remote) => remote.isDefault)
      .map(({ name, remoteEntry }) => ({ name, entry: remoteEntry }))
  )
  .then((remotes) => init({ name: 'host', remotes }))
  .then(() => import('./bootstrap').catch((err) => console.error(err)));
