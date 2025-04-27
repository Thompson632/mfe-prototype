import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RemoteRegistryService, RemoteStatusService, RemoteStatus } from '@mfe-prototype/shared-services';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [RouterModule, TopbarComponent, SidebarComponent, CommonModule]
})
export class DashboardComponent implements OnInit {
  private static initialized = false;

  isLoading = true;
  statuses: RemoteStatus[] = [];

  private readonly router = inject(Router);
  private readonly remoteRegistryService = inject(RemoteRegistryService);
  private readonly remoteStatusService = inject(RemoteStatusService);

  async ngOnInit() {
    if (DashboardComponent.initialized) {
      this.isLoading = false;
      return;
    }

    try {
      const remotes = await this.remoteRegistryService.getAllRegisteredRemotes();
      await this.remoteStatusService.checkStatuses(remotes);
      this.statuses = this.remoteStatusService.getStatuses();

      // Set up health status polling every 30 seconds
      setInterval(async () => {
        await this.remoteStatusService.checkStatuses(remotes);
        this.statuses = this.remoteStatusService.getStatuses();
      }, 30000);

      const childRoutes = await this.remoteRegistryService.initDefaultMfeRoutes(
        RemoteRegistryService.DEFAULT_LAYOUT,
        [RemoteRegistryService.DEFAULT_LAYOUT]
      );

      this.router.resetConfig([
        ...this.router.config,
        {
          path: '',
          component: DashboardComponent,
          children: childRoutes
        }
      ]);

      DashboardComponent.initialized = true;
    } catch (error) {
      console.error('Failed to initialize dashboard:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
