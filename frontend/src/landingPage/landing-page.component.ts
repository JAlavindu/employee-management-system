import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  features = [
    { title: 'Employee Tracking', description: 'Monitor employee performance and attendance with ease.', icon: '📊' },
    { title: 'Payroll Management', description: 'Automate payroll calculations and ensure timely payments.', icon: '💰' },
    { title: 'Team Collaboration', description: 'Foster teamwork with integrated communication tools.', icon: '🤝' }
  ];
}
