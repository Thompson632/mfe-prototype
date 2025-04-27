import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
  imports: [CommonModule]
})
export class TopBarComponent {
  constructor(private router: Router) {}

  navigateHome() {
    this.router.navigateByUrl('/');
  }
}
