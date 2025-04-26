import { init } from '@module-federation/enhanced/runtime';

fetch('remotes.json')
  .then((response) => response.json())
  .then((remotes) => {
    const manifest = remotes.map((remote: any) => ({
      name: remote.name,
      entry: remote.remoteEntry
    }));

    console.log('Remotes Manifest:', JSON.stringify(manifest, null, 2));

    return init({ name: 'host', remotes: manifest });
  })
  .then(() => import('./bootstrap'))
  .catch((err) => console.error(err));
