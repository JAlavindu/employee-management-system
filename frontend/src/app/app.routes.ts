import { Routes } from '@angular/router';
import { LandingPageComponent } from '../landingPage/landing-page.component';
import { LoginComponent } from '../login/login.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { authGuard } from './auth.guard';
import { EmployeeManagementPageComponent } from '../employeeManagementPage/employee-management-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  {
    path: 'employeeManagement',
    component: EmployeeManagementPageComponent,
    canActivate: [authGuard],
  },
];
