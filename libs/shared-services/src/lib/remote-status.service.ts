import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RemoteStatus } from './remote-status.model';

@Injectable({
  providedIn: 'root'
})
export class RemoteStatusService {
  remoteStatuses: RemoteStatus[] = [];

  constructor(private http: HttpClient) {}

  async checkStatuses(remotes: any[]) {
    const checks = remotes.map(async (remote) => {
      const healthUrl = remote.remoteEntry.replace('mf-manifest.json', 'healthz');
      try {
        const res = await this.http.get(healthUrl, { responseType: 'text' }).toPromise();
        const healthy = res === 'OK';

        this.updateStatus(remote.name, remote.routePath, healthUrl, healthy);
      } catch {
        this.updateStatus(remote.name, remote.routePath, healthUrl, false);
      }
    });

    await Promise.all(checks);
  }

  getStatuses(): RemoteStatus[] {
    return this.remoteStatuses;
  }

  private updateStatus(name: string, routePath: string, healthUrl: string, healthy: boolean) {
    const existing = this.remoteStatuses.find(r => r.name === name);
    if (existing) {
      existing.status = healthy ? 'healthy' : 'unavailable';
    } else {
      this.remoteStatuses.push({
        name,
        routePath,
        healthUrl,
        status: healthy ? 'healthy' : 'unavailable'
      });
    }
  }
}
