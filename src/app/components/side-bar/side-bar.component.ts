import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from '../../services/users.service';

@Component({
  selector: 'app-side-bar',
  standalone: false,

  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent implements OnInit {
  users: any[] = []; // Stores all users from JSON
  filteredUsers: any[] = []; // Stores filtered users

  @Output() userSelected = new EventEmitter<any>(); // Emit user selection

  constructor(private http: HttpClient, private userService: UserService) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/users').subscribe((data) => {
      this.users = data;
      this.filteredUsers = data; // Initially, show all users
    });
  }

  onSearch(term: string) {
    this.filteredUsers = this.users.filter(
      (user) =>
        user.name.toLowerCase().includes(term.toLowerCase()) ||
        user.username.toLowerCase().includes(term.toLowerCase())
    );
  }

  onUserSelected(user: any) {
    this.userSelected.emit(user); // Emit selected user to parent component
    this.userService.setSelectedUser(user.username); // Set selected user in UserService
  }
}
