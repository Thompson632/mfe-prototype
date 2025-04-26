import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from './layout/topbar/topbar.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HealthDashboardComponent } from './layout/health-dashboard/health-dashboard.component';

@Component({
  selector: 'app-dashboard-root',
  standalone: true,
  imports: [
    CommonModule,
    TopbarComponent,
    SidebarComponent,
    HealthDashboardComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {}
