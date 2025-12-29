import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { minimumAgeValidator } from './utils/minimumAgeValidator';
import { MapPickerComponent } from '../map-picker/map-picker.component';
import { EventEmitter } from '@angular/core';
import { RegistrationModal } from './registration-modal/registration-modal';
import { fetchEmployees } from './utils/fetchEmployees';
import { onFileChange } from './utils/onFileChange';
import { SearchComponent } from './search-component/search-component';
import { EmployeeViewTableComponent } from './employee-view-table-component/employee-view-table-component';
import { EmployeeViewEditComponent } from './employee-view-edit-component/employee-view-edit-component';

@Component({
  selector: 'app-employee-management-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MapPickerComponent, RegistrationModal, SearchComponent, EmployeeViewTableComponent, EmployeeViewEditComponent],
  templateUrl: './employee-management-page.component.html',
  styleUrls: ['./employee-management-page.component.css'],
})
export class EmployeeManagementPageComponent implements OnInit {
  @Output() showModalChange = new EventEmitter<boolean>();

  showModal = false;
  showViewModal = false;
  isEditMode = false;
  selectedEmployee: any = null;
  employeeForm!: FormGroup;
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
    fetchEmployees.call(this);
  }

  fileChange(event: Event) {
    onFileChange.call(this, event, this);
  }

  onView(employee: any) {
    console.log('View employee:', employee);
    console.log('modal opened in employee management page');
    this.selectedEmployee = employee;
    this.showViewModal = true;
    this.activeTab = 'details';
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedEmployee = null;
    this.activeTab = 'details';
    // Reset the shared form to avoid stale values when next opening edit/create
    this.employeeForm.reset({ gender: 'male', status: 'Active' });
    this.employeeForm.get('employeeCode')?.enable();
    this.employeeForm.get('gender')?.enable();
    this.employeeForm.get('dob')?.enable();
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
    // Reset form to ensure no stale values from previously viewed/edited employee
    this.employeeForm.reset({ gender: 'male', status: 'Active' });
    // Re-enable fields for new employee
    this.employeeForm.get('employeeCode')?.enable();
    this.employeeForm.get('gender')?.enable();
    this.employeeForm.get('dob')?.enable();

    // Clear any previously set file value and add required validator back for profileImage
    this.employeeForm.get('profileImage')?.setValue(null);
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

  onAddressSelected(address: string) {
    // Update the form control with the address from the map
    this.employeeForm.patchValue({ address: address });
    this.employeeForm.get('address')?.markAsDirty();
  }
}
