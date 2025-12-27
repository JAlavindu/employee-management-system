import { NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-registration-modal',
  templateUrl: './registration-modal.html',
  styleUrls: ['./registration-modal.css'],
  imports: [NgIf],
})
export class RegistrationModal {
  @Output() closeModal = new EventEmitter<boolean>();
  @Input() isModalOpen!: boolean;

  // modal=false;

  closeModalFunc(){
    this.closeModal.emit(false);
  }
}
