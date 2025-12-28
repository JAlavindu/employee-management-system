import { NgFor, NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-employee-view-table-component',
  imports: [NgFor, NgIf],
  templateUrl: './employee-view-table-component.html',
  styleUrls: ['./employee-view-table-component.css'],
  standalone: true,
})
export class EmployeeViewTableComponent{
  @Input() filteredEmployees: any[] = [];
  @Output() viewEmployee = new EventEmitter<any>();
  selectedEmployee: any = null;

   onView(employee: any) {
    console.log('View employee:', employee);
    this.selectedEmployee = employee;
    this.viewEmployee.emit(employee);
  }
}
