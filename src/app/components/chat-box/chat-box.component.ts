import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-box',
  standalone: false,

  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.css',
})
export class ChatBoxComponent {
  @Input() selectedUser: any; // Receive selected user
}
