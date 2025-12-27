import { NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-registration-modal',
  templateUrl: './registration-modal.html',
  styleUrls: ['./registration-modal.css'],
  imports: [NgIf],
})
export class RegistrationModal {
  @Output() closeModal = new EventEmitter<boolean>();
  @Input() isModalOpen!: boolean;
  @Input() employeeForm!: FormGroup;

  viewModal=false;

  closeModalFunc() {
    this.closeModal.emit(false);
  }
}
