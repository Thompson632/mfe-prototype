import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { RemoteApp, RemoteRegistryService } from '@mfe-prototype/shared-services';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [CommonModule]
})
export class SidebarComponent implements OnInit {
  private readonly remoteRegistryService = inject(RemoteRegistryService);
  private readonly router = inject(Router);

  remotes: RemoteApp[] = [];
  activeRoute = '';
  isLoading = false;

  async ngOnInit() {
    this.remotes = await this.remoteRegistryService.getAllRegisteredRemotes();
    this.remotes = this.remotes.filter(remote => remote.name !== RemoteRegistryService.DEFAULT_LAYOUT);

    this.router.events.subscribe(() => {
      this.activeRoute = this.router.url.replace('/', '');
    });
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

  async navigateToHealthDashboard() {
    try {
      this.isLoading = true;
      await this.router.navigateByUrl('/health-dashboard');
    } catch (error) {
      console.error('Failed to navigate to Health Dashboard:', error);
      alert('Failed to navigate to Health Dashboard.');
    } finally {
      this.isLoading = false;
    }
  }
}
