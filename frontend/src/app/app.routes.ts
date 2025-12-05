import { Routes } from '@angular/router';
import { LandingPageComponent } from '../landingPage/landing-page.component';
import { LoginComponent } from '../login/login.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
];
