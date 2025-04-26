import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RemoteStatusService, RemoteRegistryService, RemoteStatus } from '@mfe-prototype/shared-services';

@Component({
  selector: 'app-health-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './health-dashboard.component.html',
  styleUrls: ['./health-dashboard.component.scss']
})
export class HealthDashboardComponent implements OnInit {
  statuses: RemoteStatus[] = [];

  constructor(
    private remoteStatusService: RemoteStatusService,
    private remoteRegistry: RemoteRegistryService
  ) {}

  async ngOnInit() {
    const remotes = await this.remoteRegistry.fetchRemotes();
    await this.remoteStatusService.checkStatuses(remotes);
    this.statuses = this.remoteStatusService.getStatuses();

    setInterval(async () => {
      await this.remoteStatusService.checkStatuses(remotes);
      this.statuses = this.remoteStatusService.getStatuses();
    }, 30000);
  }
}
