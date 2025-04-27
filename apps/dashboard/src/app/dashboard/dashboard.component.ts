import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { init, loadRemote } from '@module-federation/enhanced/runtime';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { RemoteApp } from '@mfe-prototype/shared-services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [RouterModule, TopbarComponent, SidebarComponent, CommonModule]
})
export class DashboardComponent implements OnInit {
  private static readonly DEFAULT_LAYOUT = 'dashboard';
  private static readonly REMOTES_JSON = 'remotes.json';
  private static initialized = false;

  isLoading = true;

  private readonly router = inject(Router);

  async ngOnInit() {
    if (DashboardComponent.initialized) {
      console.log('[ Dashboard ] Already initialized, skipping init.');
      this.isLoading = false;
      return;
    }

    console.log(`[ Dashboard ] Fetching dashboard [${DashboardComponent.REMOTES_JSON}]`);

    try {
      const response = await fetch(DashboardComponent.REMOTES_JSON);
      const remotes = (await response.json()) as RemoteApp[];

      const nonDefaultRemotes = remotes.filter(remote => remote.name !== DashboardComponent.DEFAULT_LAYOUT);

      const manifest = nonDefaultRemotes.map((remote: RemoteApp) => ({
        name: remote.name,
        entry: remote.remoteEntry
      }));

      await init({ name: 'dashboard', remotes: manifest });

      const childRoutes = nonDefaultRemotes.map((remote: RemoteApp) => ({
        path: remote.routePath,
        loadChildren: () =>
          loadRemote(`${remote.name}/${remote.exposedModule.replace('./', '')}`)
            .then((m: any) => m.remoteRoutes)
      }));

      this.router.resetConfig([
        ...this.router.config,
        {
          path: '',
          component: DashboardComponent,
          children: childRoutes
        }
      ]);

      console.log('[ Dashboard ] Routes registered:', JSON.stringify(childRoutes));

      DashboardComponent.initialized = true;
    } catch (error) {
      console.error('[ Dashboard ] Failed to initialize:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
