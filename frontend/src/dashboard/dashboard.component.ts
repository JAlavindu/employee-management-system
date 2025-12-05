import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  // Hardcoded data for now. You can fetch this from your backend later.
  totalEmployees = 150;
  activeEmployees = 142;
  deactivatedEmployees = 8;
}
