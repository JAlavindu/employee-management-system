import { environment } from "../../environments/environment";

export function fetchEmployees(this: any) {

  const apiUrl = `${environment.apiUrl}employees`;
  
  this.http.get(apiUrl).subscribe({
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
        window.location.href = '/login';
      }
    },
  });
}