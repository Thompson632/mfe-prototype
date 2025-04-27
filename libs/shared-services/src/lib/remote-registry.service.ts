import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Router } from '@angular/router';
import { init, loadRemote } from '@module-federation/enhanced/runtime';
import { RemoteApp } from './remote-app.model';

export const REMOTES_PATH = new InjectionToken<string>('REMOTES_PATH');

@Injectable({
  providedIn: 'root'
})
export class RemoteRegistryService {
  public static readonly DEFAULT_LAYOUT = 'dashboard';

  private loadedRemotes = new Map<string, any>();
  private remotes: RemoteApp[] = [];
  private remotesLoaded = false;

  constructor(@Inject(REMOTES_PATH) private readonly remotesPath: string) {}

  async initDefaultRoute(router: Router): Promise<void> {
    await this.ensureRemotesLoaded();

    const defaultRemote = this.remotes.find(r => r.name === RemoteRegistryService.DEFAULT_LAYOUT);
    if (!defaultRemote) {
      console.warn(`[RemoteRegistry] Default remote '${RemoteRegistryService.DEFAULT_LAYOUT}' not found.`);
      return;
    }

    const remotePath = this.buildRemotePath(defaultRemote);
    console.log(`[RemoteRegistry] Setting default route: [${remotePath}]`);

    router.resetConfig([
      {
        path: '',
        loadChildren: () => this.loadRemoteModule(remotePath).then(m => m.remoteRoutes)
      }
    ]);
  }

  async initDefaultMfeRoutes(federationHost: string, excludeNames: string[] = []): Promise<any[]> {
    await this.ensureRemotesLoaded();

    const remotesToLoad = this.remotes.filter(r => !excludeNames.includes(r.name));

    if (remotesToLoad.length === 0) {
      console.warn('[RemoteRegistry] No remotes to initialize.');
      return [];
    }

    const manifest = remotesToLoad.map(remote => ({
      name: remote.name,
      entry: remote.remoteEntry
    }));

    await init({ name: federationHost, remotes: manifest });
    console.log(`[RemoteRegistry] Initialized federation for [${federationHost}] with remotes:`, manifest);

    return remotesToLoad.map(remote => ({
      path: remote.routePath,
      loadChildren: () => this.loadRemoteByName(remote.name).then(m => m.remoteRoutes)
    }));
  }

  async loadRemoteByName(name: string): Promise<any> {
    await this.ensureRemotesLoaded();

    const remote = this.remotes.find(r => r.name === name);
    if (!remote) {
      throw new Error(`[RemoteRegistry] Remote with name '${name}' not found.`);
    }

    const remotePath = this.buildRemotePath(remote);
    return this.loadRemoteModule(remotePath);
  }

  async getAllRegisteredRemotes(): Promise<RemoteApp[]> {
    await this.ensureRemotesLoaded();
    return this.remotes;
  }

  private async ensureRemotesLoaded(): Promise<void> {
    if (this.remotesLoaded) return;

    try {
      const response = await fetch(this.remotesPath);
      this.remotes = await response.json();
      this.remotesLoaded = true;
      console.log(`[RemoteRegistry] Successfully loaded remotes from: [${this.remotesPath}]`);
    } catch (error) {
      console.error('[RemoteRegistry] Failed to fetch remote list:', error);
      throw error;
    }
  }

  private async loadRemoteModule(remotePath: string): Promise<any> {
    if (this.loadedRemotes.has(remotePath)) {
      console.log(`[RemoteRegistry] Remote already loaded: [${remotePath}]`);
      return this.loadedRemotes.get(remotePath);
    }

    try {
      console.log(`[RemoteRegistry] Loading remote: [${remotePath}]`);
      const module = await loadRemote(remotePath);
      this.loadedRemotes.set(remotePath, module);
      console.log(`[RemoteRegistry] Successfully loaded remote: [${remotePath}]`);
      return module;
    } catch (error) {
      console.error(`[RemoteRegistry] Failed to load remote: [${remotePath}]`, error);
      throw error;
    }
  }

  private buildRemotePath(remote: RemoteApp): string {
    return `${remote.name}/${remote.exposedModule.replace('./', '')}`;
  }
}
