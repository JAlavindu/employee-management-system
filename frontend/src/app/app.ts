import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  showNavbar = false;
  pshowNavbar = false;
  private router = inject(Router);

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const currentUrl = event.urlAfterRedirects;

        // Hide navbar on landing page (exactly '/') and login page (starts with '/login')
        const isHidden = currentUrl === '/' || currentUrl.startsWith('/login');

        this.showNavbar = !isHidden;
      });
  }
  protected readonly title = signal('my-first-project');
}
