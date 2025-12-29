import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { fetchEmployees } from '../utils/fetchEmployees';


@Component({
  selector: 'app-employee-view-edit-component',
  imports: [NgIf, ReactiveFormsModule, NgTemplateOutlet],
  templateUrl: './employee-view-edit-component.html',
  styleUrl: './employee-view-edit-component.css',
})
export class EmployeeViewEditComponent {
  @Input() showEmployeeViewModal: boolean = false;
  @Input() employeeActiveTab: string = 'details';
  @Input() selectedEmployee: any = null;
  @Output() close = new EventEmitter<void>();
  @Input() formFields: any;
  @Input() employeeForm!: FormGroup;
  @Input() fileChange: any;

  isEditMode = false;
  private http = inject(HttpClient);

  setActiveTab(tabName: string) {
    this.employeeActiveTab = tabName;

    if( tabName === 'edit' && this.selectedEmployee) {
      this.isEditMode = true;
      console.log('Edit mode enabled for employee:', this.selectedEmployee);
      this.employeeForm.patchValue({
        employeeCode: this.selectedEmployee.empCode,
        firstName: this.selectedEmployee.firstName,
        lastName: this.selectedEmployee.lastName,
        address: this.selectedEmployee.address,
        nic: this.selectedEmployee.nic,
        mobileNo: this.selectedEmployee.mobileNo,
        gender: this.selectedEmployee.gender,
        email: this.selectedEmployee.email,
        designation: this.selectedEmployee.designation,
        profileImage: null,
        dob: this.selectedEmployee.dob,
        status: this.selectedEmployee.status,
      });

      this.employeeForm.get('employeeCode')?.disable();
      this.employeeForm.get('gender')?.disable();
      this.employeeForm.get('dob')?.disable();
      this.employeeForm.get('profileImage')?.clearValidators();
    }
  }

  downloadReport(format: 'pdf' | 'excel') {
    if (!this.selectedEmployee) return;

    const empCode = this.selectedEmployee.empCode;
    const apiUrl = `${environment.apiUrl}employee/${empCode}/download/${format}`;

    this.http.get(apiUrl, { responseType: 'blob' }).subscribe({
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

  closeViewModal() {
    this.showEmployeeViewModal = false;
    this.selectedEmployee = null;
    this.close.emit();
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      console.log('Form Value:', this.employeeForm.value);
      // Use getRawValue() to include disabled fields if needed
      const formValue = this.employeeForm.getRawValue();
      const formData = new FormData();

      // 1. Prepare the Employee JSON Object
      // Map frontend form controls to backend model fields
      const employeeData = {
        empCode: formValue.employeeCode,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        address: formValue.address,
        nic: formValue.nic, 
        NIC: formValue.nic, 
        mobileNo: formValue.mobileNo,
        gender: formValue.gender,
        email: formValue.email,
        designation: formValue.designation,
        status: formValue.status,
        dob: formValue.dob,
      };

      // 2. Append the 'employee' part as a JSON Blob
      formData.append(
        'employee',
        new Blob([JSON.stringify(employeeData)], {
          type: 'application/json',
        })
      );

      // 3. Append the 'imageFile' part
      const file = this.employeeForm.get('profileImage')?.value;
      if (file) {
        formData.append('imageFile', file);
      }

      if (this.isEditMode && this.selectedEmployee) {
        // UPDATE (PUT)
        const apiUrl = `${environment.apiUrl}employee/${this.selectedEmployee.empCode}`;
        this.http.put(apiUrl, formData).subscribe({
          next: (response: any) => {
            console.log('Employee updated successfully:', response);
            alert('Employee updated successfully!');
            this.closeViewModal();
            fetchEmployees.call(this);
          },
          error: (error: any) => {
            console.error('Error updating employee:', error);
            alert('Failed to update employee. Please try again.');
          },
        });
      } else {
        // CREATE (POST)
        const apiUrl = `${environment.apiUrl}employee`;
        this.http.post(apiUrl, formData).subscribe({
          next: (response: any) => {
            console.log('Employee added successfully:', response);
            alert('Employee added successfully!');
            this.closeViewModal();
            fetchEmployees.call(this);
          },
          error: (error: any) => {
            console.error('Error adding employee:', error);
            alert('Failed to add employee. Please try again.');
          },
        });
      }
    } else {
      this.employeeForm.markAllAsTouched();
      alert('Please fill in all required fields correctly.');
    }
  }
}
