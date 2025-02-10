import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: any[] = [];
  private currentUserSubject = new BehaviorSubject<any>(null);
  private selectedUserSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  // Fetch users from JSON endpoint
  fetchUsers(): Observable<any[]> {
    return this.http.get<any[]>('https://example.com/users.json').pipe(
      map((data) => {
        this.users = data;
        return this.users;
      })
    );
  }

  // Access the users array
  getUsers(): any[] {
    return this.users;
  }

  setCurrentUser(user: any): void {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  // Set & Get selected user
  setSelectedUser(user: any): void {
    this.selectedUserSubject.next(user);
  }

  getSelectedUser(): Observable<any> {
    return this.selectedUserSubject.asObservable();
  }
}
