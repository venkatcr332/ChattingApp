import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../services/users.service';

@Component({
  selector: 'app-chat-box',
  standalone: false,
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.css',
})
export class ChatBoxComponent implements OnInit, OnChanges {
  @Input() selectedUser!: string;

  selecteduser!: string;
  currentUser!: string;
  messages: any[] = [];

  constructor(
    private chatService: ChatService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      this.fetchMessages();
    });

    this.userService.getSelectedUser().subscribe((user) => {
      this.selecteduser = user;
      this.fetchMessages();
    });
  }

  ngOnChanges() {
    this.fetchMessages();
  }

  private fetchMessages() {
    if (this.currentUser && this.selecteduser) {
      this.chatService
        .getMessages(this.currentUser, this.selecteduser)
        .subscribe((data) => {
          this.messages = data;
        });
    }
  }
}
