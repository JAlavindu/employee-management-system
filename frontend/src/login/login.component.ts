import { Component, inject } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
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
  private route = inject(ActivatedRoute);

  ngOnInit() {
    //check if URL has tokens
    this.route.queryParams.subscribe((params) => {
      const accessToken = params['accessToken'];
      const refreshToken = params['refreshToken'];

      if (accessToken && refreshToken) {
        //store tokens in localstorage
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        console.log('OAuth LOgin Successful');
        this.router.navigate(['/dashboard']);
      }
    });
  }

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

  loginWithGoogle() {
    // Redirects browser to Spring Boot's OAuth endpoint
    // Spring Boot will then redirect to Google
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }
}
