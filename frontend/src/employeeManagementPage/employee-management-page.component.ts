import { CommonModule } from '@angular/common';
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
      console.log('Form Data:', this.employeeForm.value);
      // TODO: Send data to backend
      this.closeModal();
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
