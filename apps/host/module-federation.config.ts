import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'host',
  remotes: [],
  additionalShared: [
    ['@angular/core', { singleton: true, strictVersion: true, eager: true }],
    ['@angular/common', { singleton: true, strictVersion: true, eager: true }],
    ['@angular/router', { singleton: true, strictVersion: true, eager: true }],
    ['@angular/platform-browser', { singleton: true, strictVersion: true, eager: true }],
    ['@angular/core/primitives/signals', { singleton: true, strictVersion: true, eager: true }],
    ["@angular/common/http", { singleton: true, strictVersion: true, eager: true }],
    ["rxjs", { singleton: true, strictVersion: false, eager: true }],
    ["rxjs/operators", { singleton: true, strictVersion: false, eager: true }],
    ['@mfe-prototype/shared-services', { singleton: true, strictVersion: false, eager: true }], 
  ]
};

export default config;
