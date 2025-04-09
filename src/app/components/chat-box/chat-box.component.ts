import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { ChatsService } from '../../services/chats.service';
import { ElementRef, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-box',
  standalone: false,
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.css',
})
export class ChatBoxComponent implements OnInit, OnDestroy {
  @Input() selectedUser: any;

  messages: any[] = [];
  SenderUid: string | null = null;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  private messageSubscription!: Subscription;

  constructor(
    public chatsService: ChatsService,
    private fireauth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.fireauth.authState.subscribe((user) => {
      if (user) {
        this.SenderUid = user.uid;
        console.log('[ChatBox] Logged in with UID:', this.SenderUid);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedUser'] && this.selectedUser) {
      console.log('[ChatBox] selectedUser changed:', this.selectedUser);

      // Clear previous messages
      this.messages = [];
      this.chatsService.clearMessages();

      // Set new receiver UID
      this.chatsService.setReceiverUid(this.selectedUser);

      // Subscribe to live message stream
      this.subscribeToMessages();
    }
  }

  private subscribeToMessages(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }

    this.messageSubscription = this.chatsService.messages$.subscribe((msgs) => {
      this.messages = msgs;
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  scrollToBottom() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    }
  }
}
