import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private router = inject(Router);

  onLogout() {
    // Implement logout logic here (e.g., clear tokens, session data, etc.)
    console.log('User logged out');
    this.router.navigate(['/login']);
  }
}
