import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username = '';
  password = '';
  showPassword = false;

  private http = inject(HttpClient);
  private router = inject(Router);

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    const loginData = { username: this.username, password: this.password };

    const apiUrl = `${environment.apiUrl}auth/login`;

    this.http.post(apiUrl, loginData).subscribe({
      next: (response: any) => {
        console.log('Login successful:', response);
        localStorage.setItem('authToken', response.token);

        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials and try again.');
      },
    });
  }
}
