import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatsService } from '../../services/chats.service';

@Component({
  selector: 'app-message',
  standalone: false,

  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
})
export class MessageComponent {
  newMessage: string = '';

  constructor(private chatsService: ChatsService) {}

  sendMessage() {
    if (this.newMessage.trim()) {
      this.chatsService.sendNewMessage(this.newMessage);
      this.newMessage = '';
    }
  }
}
