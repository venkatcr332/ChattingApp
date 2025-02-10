import { UserService } from './../../services/users.service';
import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-message',
  standalone: false,

  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
})
export class MessageComponent implements OnInit {
  currentUser!: string;
  selectedUser!: string;
  newMessage: string = '';

  constructor(
    private chatService: ChatService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    });

    this.userService.getSelectedUser().subscribe((user) => {
      this.selectedUser = user;
    });
  }

  sendMessage() {
    console.log(this.newMessage);
    if (this.newMessage.trim() && this.currentUser && this.selectedUser) {
      this.chatService
        .sendMessage(this.currentUser, this.selectedUser, this.newMessage)
        .subscribe(
          (response) => {
            console.log('Message sent:', response);
            this.newMessage = ''; // Clear input after sending
          },
          (error) => {
            console.log('Error sending message:', error);
          }
        );
    }
  }
}
