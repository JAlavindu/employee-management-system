import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

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

  isEditMode = false;
  employeeForm!: FormGroup;
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
}
