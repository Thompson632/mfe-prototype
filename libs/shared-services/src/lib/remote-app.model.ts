export interface RemoteApp {
  name: string;
  remoteEntry: string;
  exposedModule: string;
  routePath: string;
  healthUrl: string;
}
