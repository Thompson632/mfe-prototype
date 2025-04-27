import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'about',
  exposes: {
    './Routes': 'apps/about/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
