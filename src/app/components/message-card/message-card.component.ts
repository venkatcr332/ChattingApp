import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../services/users.service';
@Component({
  selector: 'app-message-card',
  standalone: false,
  templateUrl: './message-card.component.html',
  styleUrl: './message-card.component.css',
})
export class MessageCardComponent implements OnInit {
  currentUser!: string; // Logged-in user
  otherUser!: string; // Chat partner
  latestMessage: string = 'Loading...';
  @Input() user: any;
  @Output() userSelected = new EventEmitter<any>();
  constructor(
    private chatService: ChatService,
    private userService: UserService
  ) {}
  selectUser() {
    this.userSelected.emit(this.user); // Emit selected user
  }
  ngOnInit() {
    this.fetchLatestMessage();
    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    });
    this.userService.getSelectedUser().subscribe((user) => {
      this.otherUser = user;
    });
  }
  fetchLatestMessage() {
    this.chatService
      .getLatestMessage(this.currentUser, this.otherUser)
      .subscribe((message) => {
        if (message) {
          this.latestMessage = message.text; // Assuming `text` is the message content
        } else {
          this.latestMessage = 'No messages yet';
        }
      });
  }
}
