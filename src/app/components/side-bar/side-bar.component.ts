import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Database, ref, get } from '@angular/fire/database';
import { Subject } from 'rxjs';
import { ChatsService } from '../../services/chats.service';
import { CurrentUserService } from '../../services/current-user.service';

interface User {
  email: string;
  name: string;
  photo: string;
  uid: string;
  hasActiveChat?: boolean; // Optional property to indicate active chat status
}

@Component({
  selector: 'app-side-bar',
  standalone: false,

  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent implements OnInit {
  users: User[] = [];
  interactedUsers: User[] = [];
  filteredUsers: User[] = [];
  private searchSubject = new Subject<string>();

  @Output() userSelected = new EventEmitter<User>();

  constructor(
    private db: Database,
    private currentUserService: CurrentUserService,
    private chatsService: ChatsService
  ) {}

  async ngOnInit() {
    try {
      const userRef = ref(this.db, 'user/');
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        console.warn('No users found in database.');
        return;
      }

      const usersObject = snapshot.val();
      const allUsers: User[] = Object.values(usersObject);

      const currentUser = await this.currentUserService.getCurrentUser();
      if (!currentUser?.uid) {
        console.warn('Current user not found.');
        return;
      }

      const interactedUids = await this.chatsService.getInteractedUserUids(
        currentUser.uid
      );

      const interactedUidSet = new Set(interactedUids);
      this.users = allUsers
        .filter((u) => u.uid !== currentUser.uid)
        .map((user) => ({
          ...user,
          hasActiveChat: interactedUidSet.has(user.uid),
        }));
      this.interactedUsers = this.users.filter((user) => user.hasActiveChat);
      this.filteredUsers = [...this.interactedUsers];
    } catch (err) {
      console.error('Error initializing sidebar:', err);
    }

    this.searchSubject.subscribe((term: string) => {
      const trimmed = term.trim().toLowerCase();
      if (trimmed.length === 0) {
        this.filteredUsers = this.interactedUsers.map((user) => ({ ...user }));
        console.log(
          'Filtered users after clearing search:',
          this.filteredUsers
        );
      } else {
        this.filteredUsers = this.users
          .filter((user) => user.name.toLowerCase().includes(trimmed))
          .map((user) => ({ ...user }));
        console.log('Filtered users after search:', this.filteredUsers);
      }
    });
  }

  onSearch(term: string) {
    this.searchSubject.next(term);
  }

  onUserSelected(user: User) {
    if (!user?.uid) {
      console.warn('Selected user has no UID.');
      return;
    }
    this.userSelected.emit(user);
  }
}
