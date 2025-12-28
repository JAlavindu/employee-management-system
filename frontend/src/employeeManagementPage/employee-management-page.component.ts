import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { environment } from '../environments/environment';
import { minimumAgeValidator } from './utils/minimumAgeValidator';
import { MapPickerComponent } from '../map-picker/map-picker.component';
import { EventEmitter } from '@angular/core';
import { RegistrationModal } from './registration-modal/registration-modal';
import { fetchEmployees } from './utils/fetchEmployees';
import { onFileChange } from './utils/onFileChange';
import { SearchComponent } from './search-component/search-component';
import { EmployeeViewTableComponent } from './employee-view-table-component/employee-view-table-component';

@Component({
  selector: 'app-employee-management-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MapPickerComponent, RegistrationModal, SearchComponent, EmployeeViewTableComponent],
  templateUrl: './employee-management-page.component.html',
  styleUrls: ['./employee-management-page.component.css'],
})
export class EmployeeManagementPageComponent implements OnInit {
  @Output() showModalChange = new EventEmitter<boolean>();

  showModal = false;
  showViewModal = false;
  isEditMode = false;
  selectedEmployee: any = null;
  employeeForm: FormGroup;
  showMapPicker = false;
  activeTab: string = 'details';

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
      employeeCode: ['', [Validators.required, Validators.pattern(/^(EMP|emp)\d{3}$/)]],
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      address: ['', Validators.required],
      nic: ['', [Validators.required, Validators.pattern(/^(\d{9}[vVxX]|\d{12})$/)]],
      mobileNo: ['', [Validators.required, Validators.pattern(/^(07\d{8}|07\d \d{3} \d{4})$/)]],
      gender: ['male', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      designation: ['', Validators.required],
      profileImage: [null, Validators.required],
      dob: ['', [Validators.required, minimumAgeValidator(18)]],
      status: ['Active', Validators.required],
    });
  }

  toggleMap() {
    this.showMapPicker = !this.showMapPicker;
  }

  ngOnInit() {
    //this.fetchEmployees();
    fetchEmployees.call(this);
  }

  fileChange(event: Event) {
    onFileChange.call(this, event, this);
  }

  onView(employee: any) {
    console.log('View employee:', employee);
    this.selectedEmployee = employee;
    this.showViewModal = true;
    this.activeTab = 'details';
  }

  setActiveTab(tabName: string) {
    this.activeTab = tabName;

    if (tabName === 'edit' && this.selectedEmployee) {
      this.isEditMode = true;
      console.log('Patching form with:', this.selectedEmployee);
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

    // if( tabName === 'view' && this.selectedEmployee)
  }

  downloadReport(format: 'pdf' | 'excel') {
    if (!this.selectedEmployee) return;

    const empCode = this.selectedEmployee.empCode;
    // Construct URL: e.g., /api/employee/{empCode}/download/pdf
    const apiUrl = `${environment.apiUrl}employee/${empCode}/download/${format}`;
    //const token = localStorage.getItem('authToken');
    //const headers = { Authorization: `Bearer ${token}` };

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

  onEdit(employee: any) {
    console.log('Edit employee:', employee);
    this.isEditMode = true;
    this.selectedEmployee = employee;
    this.showModal = true;

    // Patch values
    this.employeeForm.patchValue({
      employeeCode: employee.empCode,
      firstName: employee.firstName,
      lastName: employee.lastName,
      address: employee.address,
      nic: employee.nic,
      mobileNo: employee.mobileNo,
      gender: employee.gender,
      email: employee.email,
      designation: employee.designation,
      dob: employee.dob,
      status: employee.status,
      profileImage: null, // Reset file input
    });

    // Disable fields that cannot be edited
    this.employeeForm.get('employeeCode')?.disable();
    this.employeeForm.get('gender')?.disable();
    this.employeeForm.get('dob')?.disable();

    // Remove required validator for profileImage in edit mode (optional update)
    this.employeeForm.get('profileImage')?.clearValidators();
    this.employeeForm.get('profileImage')?.updateValueAndValidity();
  }

  openModal() {
    this.showModalChange.emit(true);
    this.showModal = true;
    this.isEditMode = false;
    // Re-enable fields for new employee
    this.employeeForm.get('employeeCode')?.enable();
    this.employeeForm.get('gender')?.enable();
    this.employeeForm.get('dob')?.enable();

    // Add required validator back for profileImage
    this.employeeForm.get('profileImage')?.setValidators(Validators.required);
    this.employeeForm.get('profileImage')?.updateValueAndValidity();
  }

  closeModal(event?: boolean) {
    this.showModalChange.emit(false);
    this.showModal = event ?? false;
    this.isEditMode = false;
    this.selectedEmployee = null;
    this.employeeForm.reset({ gender: 'male', status: 'Active' });

    // Re-enable fields just in case
    this.employeeForm.get('employeeCode')?.enable();
    this.employeeForm.get('gender')?.enable();
    this.employeeForm.get('dob')?.enable();
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedEmployee = null;
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
        nic: formValue.nic, // Try lowercase 'nic' first, as Jackson usually maps getters like getNIC() to 'nic'
        NIC: formValue.nic, // Send both to be safe if unsure about Jackson configuration
        mobileNo: formValue.mobileNo,
        gender: formValue.gender,
        email: formValue.email,
        designation: formValue.designation,
        status: formValue.status,
        dob: formValue.dob,
      };

      // delete employeeData.profileImage; // No longer needed as we constructed a new object

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

      // 4. Send to Backend
      // const token = localStorage.getItem('authToken');
      // const headers = {
      //   Authorization: `Bearer ${token}`,
      // };

      if (this.isEditMode && this.selectedEmployee) {
        // UPDATE (PUT)
        const apiUrl = `${environment.apiUrl}employee/${this.selectedEmployee.empCode}`;
        this.http.put(apiUrl, formData).subscribe({
          next: (response: any) => {
            console.log('Employee updated successfully:', response);
            alert('Employee updated successfully!');
            this.closeModal();
            fetchEmployees();
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
            this.closeModal();
            fetchEmployees();
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

  onAddressSelected(address: string) {
    // Update the form control with the address from the map
    this.employeeForm.patchValue({ address: address });
    this.employeeForm.get('address')?.markAsDirty();
    // Optionally close map after selection
    // this.showMapPicker = false;
  }
}
