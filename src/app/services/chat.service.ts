import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://localhost:3000/messages';

  constructor(private http: HttpClient) {}

  // Get messages between two users
  getMessages(currentUser: string, selectedUser: string): Observable<any[]> {
    return this.http
      .get<any[]>(this.apiUrl)
      .pipe(
        map((messages) =>
          messages.filter(
            (msg) =>
              (msg.sender === currentUser && msg.receiver === selectedUser) ||
              (msg.sender === selectedUser && msg.receiver === currentUser)
          )
        )
      );
  }

  getLatestMessage(currentUser: string, otherUser: string): Observable<any> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(
        (messages) =>
          messages
            .filter(
              (msg) =>
                (msg.sender === currentUser && msg.receiver === otherUser) ||
                (msg.sender === otherUser && msg.receiver === currentUser)
            )
            .sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
            )[0] // Sort by latest first // Get the latest message
      )
    );
  }

  sendMessage(
    sender: string,
    receiver: string,
    message: string
  ): Observable<any> {
    const newMessage = {
      sender,
      receiver,
      message,
      timestamp: new Date().toISOString(),
    };

    return this.http.post(this.apiUrl, newMessage);
  }
}
