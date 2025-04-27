import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RemoteApp, RemoteRegistryService, RemoteStatusService, RemoteStatus } from '@mfe-prototype/shared-services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [CommonModule]
})
export class SidebarComponent implements OnInit {
  private readonly remoteRegistryService = inject(RemoteRegistryService);
  private readonly remoteStatusService = inject(RemoteStatusService);
  private readonly router = inject(Router);

  remotes: RemoteApp[] = [];
  statuses: RemoteStatus[] = [];
  activeRoute = '';
  isLoading = false;

  async ngOnInit() {
    this.remotes = await this.remoteRegistryService.getAllRegisteredRemotes();
    this.remotes = this.remotes.filter(remote => remote.name !== RemoteRegistryService.DEFAULT_LAYOUT);
    this.statuses = this.remoteStatusService.getStatuses();

    this.router.events.subscribe(() => {
      this.activeRoute = this.router.url.replace('/', '');
    });
  }

  getRemoteColor(remoteName: string): string {
    const remote = this.statuses.find(r => r.name === remoteName);
    if (!remote) return 'gray';
    return remote.status === 'healthy' ? 'green' : 'red';
  }
  
  getRemoteTooltip(remoteName: string): string {
    const remote = this.statuses.find(r => r.name === remoteName);
    if (!remote) return 'Unknown';
    if (!remote.metadata) return `${remote.status}`;
    return `v${remote.metadata.version} • ${remote.metadata.uptimeSeconds}s uptime`;
  }  

  async navigateToRemote(remote: RemoteApp) {
    try {
      this.isLoading = true;
      await this.remoteRegistryService.loadRemoteByName(remote.name);
      this.isLoading = false;
      this.router.navigateByUrl(`/${remote.routePath}`);
    } catch (_) {
      this.isLoading = false;
      alert(`Failed to load remote: ${remote.name}`);
    }
  }

  isHealthy(remoteName: string): boolean {
    const status = this.statuses.find(s => s.name === remoteName);
    return status?.status === 'healthy';
  }  
}
