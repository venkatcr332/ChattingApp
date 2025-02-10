import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<{
    username: string | null;
    name: string | null;
    photo: string | null;
  }>({ username: null, name: null, photo: null });

  user$ = this.userSubject.asObservable();

  setUser(user: { username: string; name: string; photo: string }) {
    this.userSubject.next(user);
  }

  getUser() {
    return this.userSubject.value;
  }
}
