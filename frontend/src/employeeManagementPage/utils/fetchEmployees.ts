import { environment } from "../../environments/environment";

export function fetchEmployees(this: any) {

  const apiUrl = `${environment.apiUrl}employees`;
  const token = localStorage.getItem('authToken');
  console.log('fetchEmployees: authToken present?', !!token);

  // Attach Authorization header explicitly for debugging purposes.
  // The app uses an interceptor to set this header; this helps confirm header behavior.
  const options = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};

  this.http.get(apiUrl, options).subscribe({
    next: (data: any) => {
      console.log('Fetched employees:', data);
      this.employees = data;
      this.filteredEmployees = [...this.employees];
      console.log('Filtered employees updated:', this.filteredEmployees);
      this.cdr.detectChanges();
    },
    error: (error: any) => {
      console.error('Error fetching employees:', error);
      alert('Failed to fetch employees. Please try again.');
      if (error.status === 401 || error.status === 403) {
        alert('Session expired. Please login again.');

        localStorage.removeItem('authToken');
        // Redirect to login page
        window.location.href = '/login';
      }
    },
  });
}