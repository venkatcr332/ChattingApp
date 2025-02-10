import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: any[] = [];

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
}
