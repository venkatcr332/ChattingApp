import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-message-card',
  standalone: false,

  templateUrl: './message-card.component.html',
  styleUrl: './message-card.component.css',
})
export class MessageCardComponent {
  @Input() user: any;
  @Output() userSelected = new EventEmitter<any>();

  selectUser() {
    this.userSelected.emit(this.user); // Emit selected user
  }
}
