import { init } from '@module-federation/enhanced/runtime';
import { environment } from './environments/environment'

const manifestPath = environment.moduleFederationManifestPath;
console.log(`Loading host manifest from: [${manifestPath}]`);

fetch(manifestPath)
  .then((res) => res.json())
  .then((remotes: Record<string, string>) => 
    Object.entries(remotes).map(([name, entry]) => ({name, entry }))
  )
  .then((manifest) => 
    init({ name: 'host', remotes: manifest }))
  .then(() => import('./bootstrap'))
  .catch((err) => console.error(err));
