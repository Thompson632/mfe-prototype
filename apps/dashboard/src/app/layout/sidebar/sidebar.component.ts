import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RemoteRegistryService } from '@mfe-prototype/shared-services';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  remotes: any[] = [];

  constructor(private remoteRegistry: RemoteRegistryService) {}

  async ngOnInit() {
    this.remotes = await this.remoteRegistry.fetchRemotes();
  }

  openRemote(remote: any) {
    window.open(remote.remoteEntry.replace('/remoteEntry.js', ''), '_blank');
  }
}
