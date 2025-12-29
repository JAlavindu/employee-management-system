import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { fetchEmployees } from '../utils/fetchEmployees';


@Component({
  selector: 'app-employee-view-edit-component',
  imports: [NgIf, ReactiveFormsModule, NgTemplateOutlet],
  templateUrl: './employee-view-edit-component.html',
  styleUrls: ['./employee-view-edit-component.css'],
  host: {
    class: 'employee-view-edit'
  },
})
export class EmployeeViewEditComponent implements OnChanges {
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
      console.log('Before reset - employeeCode control value:', this.employeeForm.get('employeeCode')?.value);
      console.log('Before reset - form raw value:', this.employeeForm.getRawValue());
      this.employeeForm.reset({ gender: this.selectedEmployee.gender ?? 'male', status: this.selectedEmployee.status ?? 'Active' });
      this.employeeForm.get('employeeCode')?.enable();
      this.employeeForm.get('gender')?.enable();
      this.employeeForm.get('dob')?.enable();

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
      console.log('After patch - employeeCode control value:', this.employeeForm.get('employeeCode')?.value);
      console.log('After patch - form raw value:', this.employeeForm.getRawValue());

      this.employeeForm.get('employeeCode')?.disable();
      this.employeeForm.get('gender')?.disable();
      this.employeeForm.get('dob')?.disable();
      this.employeeForm.get('profileImage')?.clearValidators();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['selectedEmployee'] || changes['employeeActiveTab']) && this.selectedEmployee && this.employeeActiveTab === 'edit') {
      this.populateFormFromSelected();
    }
  }

  private populateFormFromSelected() {
    if (!this.selectedEmployee) return;
    this.isEditMode = true;
    this.employeeForm.reset({ gender: this.selectedEmployee.gender ?? 'male', status: this.selectedEmployee.status ?? 'Active' });

    this.employeeForm.get('employeeCode')?.enable();
    this.employeeForm.get('gender')?.enable();
    this.employeeForm.get('dob')?.enable();

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

    console.log('After patch - employeeCode control value:', this.employeeForm.get('employeeCode')?.value);
    console.log('After patch - form raw value:', this.employeeForm.getRawValue());
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
      const formValue = this.employeeForm.getRawValue();
      const formData = new FormData();

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

      formData.append(
        'employee',
        new Blob([JSON.stringify(employeeData)], {
          type: 'application/json',
        })
      );

    
      const file = this.employeeForm.get('profileImage')?.value;
      if (file) {
        formData.append('imageFile', file);
      }

      if (this.isEditMode && this.selectedEmployee) {
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
      }
    } else {
      this.employeeForm.markAllAsTouched();
      alert('Please fill in all required fields correctly.');
    }
  }
}
