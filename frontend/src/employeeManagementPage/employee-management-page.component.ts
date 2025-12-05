import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-employee-management-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-management-page.component.html',
  styleUrls: ['./employee-management-page.component.css'],
})
export class EmployeeManagementPageComponent {
  showModal = false;
  employeeForm: FormGroup;

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

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.employeeForm.reset({ gender: 'male', status: 'Active' });
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
      const apiUrl = 'http://localhost:8080/api/employee';
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
