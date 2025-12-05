import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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

  private http = inject(HttpClient);
  private router = inject(Router);

  onLogin() {
    const loginData = { username: this.username, password: this.password };

    const apiUrl = 'http://localhost:8080/api/auth/login';

    this.http.post(apiUrl, loginData).subscribe({
      next: (response: any) => {
        console.log('Login successful:', response);

        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials and try again.');
      },
    });
  }
}
