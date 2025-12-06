import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-employee-management-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './employee-management-page.component.html',
  styleUrls: ['./employee-management-page.component.css'],
})
export class EmployeeManagementPageComponent implements OnInit {
  showModal = false;
  showViewModal = false;
  selectedEmployee: any = null;
  employeeForm: FormGroup;

  // Search State
  searchCode = '';
  searchNic = '';
  searchName = '';
  searchStatus = 'All';

  // Data State
  employees: any[] = [];
  filteredEmployees: any[] = [];

  designations = [
    'Software Engineer',
    'Senior Engineer',
    'Tech Lead',
    'QA Engineer',
    'Project Manager',
    'HR Manager',
  ];

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.employeeForm = this.fb.group({
      employeeCode: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: [''],
      nic: ['', Validators.required],
      mobileNo: ['', Validators.required],
      gender: ['male', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      designation: ['', Validators.required],
      profileImage: [null],
      dob: ['', Validators.required],
      status: ['Active', Validators.required],
    });
  }

  ngOnInit() {
    this.fetchEmployees();
  }

  fetchEmployees() {
    // TODO: Replace with actual API call
    // const apiUrl = `${environment.apiUrl}employee`;
    // this.http.get(apiUrl).subscribe(...)

    const apiUrl = `${environment.apiUrl}employees`;
    const token = localStorage.getItem('authToken');

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    this.http.get(apiUrl, { headers }).subscribe({
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

  onSearch() {
    this.filteredEmployees = this.employees.filter((emp) => {
      const matchCode = this.searchCode
        ? emp.empCode.toLowerCase().includes(this.searchCode.toLowerCase())
        : true;
      const matchNic = this.searchNic
        ? emp.nic.toLowerCase().includes(this.searchNic.toLowerCase())
        : true;
      const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
      const matchName = this.searchName ? fullName.includes(this.searchName.toLowerCase()) : true;
      const matchStatus = this.searchStatus !== 'All' ? emp.status === this.searchStatus : true;

      return matchCode && matchNic && matchName && matchStatus;
    });
  }

  onView(employee: any) {
    console.log('View employee:', employee);
    this.selectedEmployee = employee;
    this.showViewModal = true;
  }

  downloadReport(format: 'pdf' | 'excel') {
    if (!this.selectedEmployee) return;

    const empCode = this.selectedEmployee.empCode;
    // Construct URL: e.g., /api/employee/{empCode}/download/pdf
    const apiUrl = `${environment.apiUrl}employee/${empCode}/download/${format}`;
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get(apiUrl, { headers, responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Employee_${empCode}_Report.${format === 'excel' ? 'xlsx' : 'pdf'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error(`Error downloading ${format} report:`, error);
        alert(
          `Failed to download ${format.toUpperCase()} report. Please ensure the backend supports this feature.`
        );
      },
    });
  }

  onEdit(employee: any) {
    console.log('Edit employee:', employee);
    // Implement Edit Logic (e.g., populate form and open modal)
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.employeeForm.reset({ gender: 'male', status: 'Active' });
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedEmployee = null;
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      console.log('Form Value:', this.employeeForm.value);
      const formValue = this.employeeForm.value;
      const formData = new FormData();

      // 1. Prepare the Employee JSON Object
      // We create a copy and remove the profileImage because that goes in a separate part
      const employeeData = { ...formValue };
      delete employeeData.profileImage;

      // 2. Append the 'employee' part as a JSON Blob
      // This fixes the "Required part 'employee' is not present" error
      formData.append(
        'employee',
        new Blob([JSON.stringify(employeeData)], {
          type: 'application/json',
        })
      );

      // 3. Append the 'imageFile' part
      // The backend expects the key to be "imageFile", not "profileImage"
      const file = formValue.profileImage;
      if (file) {
        formData.append('imageFile', file);
      }

      // 4. Send to Backend
      const apiUrl = `${environment.apiUrl}employee`;
      const token = localStorage.getItem('authToken');

      // Note: Do NOT set 'Content-Type': 'multipart/form-data' manually.
      // The browser sets it automatically with the correct boundary when using FormData.
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      this.http.post(apiUrl, formData, { headers }).subscribe({
        next: (response: any) => {
          console.log('Employee added successfully:', response);
          alert('Employee added successfully!');
          this.closeModal();
          // Optional: Refresh your list here
          this.fetchEmployees();
        },
        error: (error: any) => {
          console.error('Error adding employee:', error);
          alert('Failed to add employee. Please try again.');
        },
      });
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.employeeForm.patchValue({ profileImage: file });
    } else {
      this.employeeForm.patchValue({ profileImage: null });
    }
  }
}
