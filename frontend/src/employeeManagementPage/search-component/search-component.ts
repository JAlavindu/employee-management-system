import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-component.html',
  styleUrls: ['./search-component.css'],
})
export class SearchComponent {
  searchCode = '';
  searchNic = '';
  searchName = '';
  searchStatus = 'All';

  @Output() searchEvent = new EventEmitter<{ searchCode: string; searchNic: string; searchName: string; searchStatus: string }>();

  onSearch() {
    this.searchEvent.emit({
      searchCode: this.searchCode,
      searchNic: this.searchNic,
      searchName: this.searchName,
      searchStatus: this.searchStatus,
    });
  }
}
