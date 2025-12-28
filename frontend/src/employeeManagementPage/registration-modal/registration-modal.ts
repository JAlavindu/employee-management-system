import { NgIf, CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { 
  FormGroup,
  FormsModule,
  ReactiveFormsModule, } from '@angular/forms';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { fetchEmployees } from '../utils/fetchEmployees';
import { onFileChange } from '../utils/onFileChange';
import { MapPickerComponent } from '../../map-picker/map-picker.component';

@Component({
  selector: 'app-registration-modal',
  standalone: true,
  templateUrl: './registration-modal.html',
  styleUrls: ['./registration-modal.css'],
  imports: [CommonModule, NgIf, ReactiveFormsModule, FormsModule, MapPickerComponent],
})
export class RegistrationModal {
  @Output() closeModal = new EventEmitter<boolean>();
  @Input() isModalOpen!: boolean;
  @Input() employeeForm!: FormGroup;
  @Input() callToggleMap!: () => void;
  @Input() designations: string[] = [];

  viewModal=false;
  private http = inject(HttpClient);
  @Input() showMapPicker=false;

  toggleMapPicker(){
    this.callToggleMap();
  }

  closeModalFunc() {
    this.closeModal.emit(false);
  }

  onSubmitForm(){
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

          // CREATE (POST)
            const apiUrl = `${environment.apiUrl}employee`;
            this.http.post(apiUrl, formData).subscribe({
              next: (response: any) => {
                console.log('Employee added successfully:', response);
                alert('Employee added successfully!');
                this.closeModal.emit(false);
                fetchEmployees.call(this);
              },
              error: (error: any) => {
                console.error('Error adding employee:', error);
                alert('Failed to add employee. Please try again.');
              },
            });
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

  fileChange(event: Event) {
    onFileChange.call(this, event, this);
  }
}
