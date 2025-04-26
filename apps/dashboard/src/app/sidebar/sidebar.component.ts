import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { RemoteApp, RemoteRegistryService } from '@mfe-prototype/shared-services';
import { loadRemote } from '@module-federation/enhanced/runtime';

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
    this.remotes = await this.remoteRegistryService.fetchRemotes();

    this.router.events.subscribe(() => {
      this.activeRoute = this.router.url.replace('/', '');
    });
  }

  async navigateToRemote(remote: RemoteApp) {
    if (remote.isDefault) {
      this.router.navigateByUrl('/');
      return;
    }

    try {
      this.isLoading = true;
      const routeId = `${remote.name}/${remote.exposedModule.replace('./', '')}`;
      console.log("Trying to load", routeId)
      await loadRemote(routeId);
      this.isLoading = false;
      this.router.navigateByUrl(`/${remote.routePath}`);
    } catch (_) {
      this.isLoading = false;
      alert(`Failed to load remote: ${remote.name}`);
    }
  }
}
