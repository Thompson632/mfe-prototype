export interface RemoteApp {
  name: string;
  remoteEntry: string;
  exposedModule: string;
  routePath: string;
  isDefault: boolean;
  version: string;
}
