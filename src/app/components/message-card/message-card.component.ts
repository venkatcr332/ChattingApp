import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';
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
    private chatsService: ChatsService,
    private cdRef: ChangeDetectorRef
  ) {}

  selectUser() {
    this.userSelected.emit(this.user);
  }

  ngOnInit() {
    this.fireauth.authState.subscribe((user) => {
      if (user) {
        this.currentUser = user.uid;
        // Initial subscription can happen here if user is already present
        if (this.user?.uid) {
          this.subscribeToLatestMessage();
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && this.user?.uid && this.currentUser) {
      console.log('MessageCard ngOnChanges user:', this.user);
      if (this.user.hasActiveChat) {
        this.latestMessage = 'Loading...';
      } else {
        this.latestMessage = 'No messages yet';
      }
      this.latestTime = '';
      this.subscribeToLatestMessage();
    }
  }

  subscribeToLatestMessage() {
    if (!this.currentUser || !this.user?.uid) return;
    if (this.latestMessageSub) {
      this.latestMessageSub.unsubscribe();
    }
    if (!this.user.hasActiveChat) {
      console.log('No active chat for user:', this.user);
      // No subscription needed for users without active chat
      return;
    }
    console.log(
      'Subscribing to latest message for:',
      this.currentUser,
      this.user.uid
    );
    const stream$ = this.chatsService.listenToLatestMessage(
      this.currentUser,
      this.user.uid
    );
    this.latestMessageSub = stream$.subscribe((data) => {
      console.log(
        'Latest message data received:',
        data,
        'for user:',
        this.user
      );
      this.latestMessage = data.message;
      if (data.timestamp !== '') {
        this.latestTime = this.formatTime(data.timestamp);
      }
      this.cdRef.detectChanges(); // <-- force UI update
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
