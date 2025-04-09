import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ChatsService } from '../../services/chats.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-message-card',
  standalone: false,
  templateUrl: './message-card.component.html',
  styleUrl: './message-card.component.css',
})
export class MessageCardComponent implements OnInit {
  currentUser: string | null = null;
  latestMessage: string = 'Loading...';
  latestTime: string = '';
  @Input() user: any;
  @Output() userSelected = new EventEmitter<any>();

  private latestMessageSub!: Subscription;

  constructor(
    private fireauth: AngularFireAuth,
    private chatsService: ChatsService
  ) {}

  selectUser() {
    this.userSelected.emit(this.user);
  }

  ngOnInit() {
    this.fireauth.authState.subscribe((user) => {
      if (user && this.user?.uid) {
        this.currentUser = user.uid;
        this.subscribeToLatestMessage();
      }
    });
  }
  subscribeToLatestMessage() {
    if (!this.currentUser || !this.user?.uid) return;

    const stream$ = this.chatsService.listenToLatestMessage(
      this.currentUser,
      this.user.uid
    );
    this.latestMessageSub = stream$.subscribe((data) => {
      this.latestMessage = data.message;
      if (data.timestamp !== '') {
        this.latestTime = this.formatTime(data.timestamp);
      }
    });
  }
  formatTime(iso: string): string {
    const date = new Date(iso);
    const now = new Date();

    const timeDiff = now.getTime() - date.getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    if (timeDiff < oneDay) {
      // If within 24 hours, show time
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      // Else, show date like 'Apr 24'
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }

  ngOnDestroy() {
    if (this.latestMessageSub) this.latestMessageSub.unsubscribe();
  }
}
