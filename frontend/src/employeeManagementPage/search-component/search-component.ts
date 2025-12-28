import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { fetchEmployees } from '../utils/fetchEmployees';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-component.html',
  styleUrls: ['./search-component.css'],
})
export class SearchComponent {
  filterEmployees: any[] = [];
  fetchedEmployees: any[] = [];

  // Search State
  searchCode = '';
  searchNic = '';
  searchName = '';
  searchStatus = 'All';

  onSearch(){
    const res = fetchEmployees();
    this.fetchedEmployees = (res as unknown) as any[];
    this.filterEmployees = this.fetchedEmployees.filter(emp => {
      const matchCode = this.searchCode
        ? emp.empCode.toLowerCase().includes(this.searchCode.toLowerCase())
        : true;
      const matchNic = this.searchNic
        ? emp.nic.toLowerCase().includes(this.searchNic.toLowerCase())
        : true;
      const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
      const matchName = this.searchName ? fullName.includes(this.searchName.toLowerCase()) : true;
      const matchStatus = this.searchStatus !== 'All' ? emp.status === this.searchStatus : true;

      return matchCode && matchNic && matchName && matchStatus;
    });
  }
}
