import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  totalEmployees = 0;
  activeEmployees = 0;
  deactivatedEmployees = 0;

  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.fetchDashboardStats();
  }

  fetchDashboardStats() {
    const apiUrl = `${environment.apiUrl}dashboard-stats`;
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any>(apiUrl, { headers }).subscribe({
      next: (data) => {
        console.log('Dashboard stats received:', data);
        this.totalEmployees = data.totalEmployees;
        this.activeEmployees = data.activeEmployees;
        this.deactivatedEmployees = data.deactivatedEmployees;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching dashboard stats:', error);
      },
    });
  }
}
