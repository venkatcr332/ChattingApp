import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  standalone: false,

  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent {
  searchTerm: string = '';

  @Output() searchEvent = new EventEmitter<string>();

  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
    this.searchEvent.emit(this.searchTerm);
  }
}
