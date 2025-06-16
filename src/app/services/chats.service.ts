import { Injectable, NgZone } from '@angular/core';
import { Database, ref, push, onValue } from '@angular/fire/database';
import { BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  private senderUid: string | null = null;
  private receiverUid: string | null = null;

  private messagesSubject = new BehaviorSubject<any[]>([]);
  messages$ = this.messagesSubject.asObservable();

  constructor(
    private db: Database,
    private fireauth: AngularFireAuth,
    private ngZone: NgZone
  ) {
    this.fireauth.authState.subscribe((user) => {
      if (user) {
        this.senderUid = user.uid;
      }
    });
  }

  setReceiverUid(user: any) {
    this.receiverUid = user.uid;
    console.log('[ChatsService] Receiver UID set to:', this.receiverUid);

    if (this.senderUid && this.receiverUid) {
      this.listenToMessages(this.senderUid, this.receiverUid);
    }
  }

  sendNewMessage(message: string) {
    if (!this.senderUid || !this.receiverUid) {
      console.error('[ChatsService] Sender or Receiver UID not set.');
      return;
    }

    const newMessage = {
      timestamp: new Date().toISOString(),
      sender: this.senderUid,
      receiver: this.receiverUid,
      message: message,
    };

    const chatsRef = ref(this.db, 'chats/');
    push(chatsRef, newMessage)
      .then(() => console.log('[ChatsService] Message sent:', newMessage))
      .catch((err) =>
        console.error('[ChatsService] Error sending message:', err)
      );
  }

  private listenToMessages(senderUid: string, receiverUid: string) {
    const chatsRef = ref(this.db, 'chats/');

    onValue(chatsRef, (snapshot) => {
      this.ngZone.run(() => {
        const allMessages: any[] = [];
        snapshot.forEach((child) => {
          const msg = child.val();
          const msgSender = msg.sender?.trim?.();
          const msgReceiver = msg.receiver?.trim?.();

          const isSent = msgSender === senderUid && msgReceiver === receiverUid;
          const isReceived =
            msgSender === receiverUid && msgReceiver === senderUid;

          if (isSent || isReceived) {
            allMessages.push({ id: child.key, ...msg });
          }
        });

        const sortedMessages = allMessages.sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        this.messagesSubject.next(sortedMessages);
      });
    });
  }

  clearMessages() {
    this.messagesSubject.next([]);
  }

  listenToLatestMessage(
    uid1: string,
    uid2: string
  ): Subject<{ message: string; timestamp: string }> {
    const latestMessage$ = new Subject<{
      message: string;
      timestamp: string;
    }>();
    const chatsRef = ref(this.db, 'chats/');

    onValue(chatsRef, (snapshot) => {
      this.ngZone.run(() => {
        const allMessages: any[] = [];
        snapshot.forEach((child) => {
          const msg = child.val();
          const isBetween =
            (msg.sender === uid1 && msg.receiver === uid2) ||
            (msg.sender === uid2 && msg.receiver === uid1);
          if (isBetween) {
            allMessages.push({ id: child.key, ...msg });
          }
        });

        allMessages.sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        const latest = allMessages[allMessages.length - 1];
        if (latest) {
          latestMessage$.next({
            message: latest.message,
            timestamp: latest.timestamp,
          });
        } else {
          latestMessage$.next({
            message: '',
            timestamp: '',
          });
        }
      });
    });

    return latestMessage$;
  }

  getInteractedUserUids(currentUid: string): Promise<Set<string>> {
    const chatsRef = ref(this.db, 'chats/');
    return new Promise((resolve) => {
      onValue(
        chatsRef,
        (snapshot) => {
          this.ngZone.run(() => {
            const interactedUids = new Set<string>();

            snapshot.forEach((child) => {
              const msg = child.val();
              if (msg.sender === currentUid) interactedUids.add(msg.receiver);
              if (msg.receiver === currentUid) interactedUids.add(msg.sender);
            });

            resolve(interactedUids);
          });
        },
        { onlyOnce: true }
      );
    });
  }

  async getLastMessageTimestamp(uid1: string, uid2: string): Promise<string> {
    const chatsRef = ref(this.db, 'chats/');

    return new Promise((resolve) => {
      onValue(
        chatsRef,
        (snapshot) => {
          const allMessages: any[] = [];

          snapshot.forEach((child) => {
            const msg = child.val();
            const isBetween =
              (msg.sender === uid1 && msg.receiver === uid2) ||
              (msg.sender === uid2 && msg.receiver === uid1);
            if (isBetween) {
              allMessages.push({ id: child.key, ...msg });
            }
          });

          allMessages.sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );

          const latest = allMessages[allMessages.length - 1];
          resolve(latest?.timestamp || '');
        },
        { onlyOnce: true }
      );
    });
  }
}
