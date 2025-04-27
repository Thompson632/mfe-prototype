import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RemoteStatus } from './remote-status.model';
import { RemoteApp } from './remote-app.model'; // <- assume you have this

@Injectable({
  providedIn: 'root'
})
export class RemoteStatusService {
  remoteStatuses: RemoteStatus[] = [];

  constructor(private http: HttpClient) {}

  async checkStatuses(remotes: RemoteApp[]): Promise<void> {
    const checks = remotes.map(async (remote) => {
      const healthUrl = remote.healthUrl; // 🔥 Use provided healthUrl

      if (!healthUrl) {
        console.warn(`Remote [${remote.name}] missing healthUrl.`);
        this.updateStatus(remote.name, remote.routePath, '', false, null);
        return;
      }

      try {
        const res = await this.http.get<any>(healthUrl).toPromise(); // Expecting JSON response
        const healthy = res?.status === 'ok'; // 🔥 Based on JSON field

        this.updateStatus(remote.name, remote.routePath, healthUrl, healthy, res);
      } catch (error) {
        console.error(`Health check failed for [${remote.name}] at ${healthUrl}:`, error);
        this.updateStatus(remote.name, remote.routePath, healthUrl, false, null);
      }
    });

    await Promise.all(checks);
  }

  getStatuses(): RemoteStatus[] {
    return this.remoteStatuses;
  }

  private updateStatus(
    name: string,
    routePath: string,
    healthUrl: string,
    healthy: boolean,
    extraMetadata: any | null
  ): void {
    const existing = this.remoteStatuses.find(r => r.name === name);

    const statusEntry: RemoteStatus = {
      name,
      routePath,
      healthUrl,
      status: healthy ? 'healthy' : 'unavailable',
      metadata: extraMetadata || {}
    };

    if (existing) {
      Object.assign(existing, statusEntry);
    } else {
      this.remoteStatuses.push(statusEntry);
    }
  }
}
