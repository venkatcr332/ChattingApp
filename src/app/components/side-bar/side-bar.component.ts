import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Database, ref, get } from '@angular/fire/database';
import { debounceTime, Subject } from 'rxjs';
import { ChatsService } from '../../services/chats.service';

@Component({
  selector: 'app-side-bar',
  standalone: false,

  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent implements OnInit {
  users: any[] = []; // Stores all users from JSON
  filteredUsers: any[] = []; // Stores filtered users
  private searchSubject = new Subject<string>();

  @Output() userSelected = new EventEmitter<any>(); // Emit user selection

  constructor(private db: Database, private chatsService: ChatsService) {}

  async ngOnInit() {
    const userRef = ref(this.db, 'user/');
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const usersObject = snapshot.val();
      this.users = Object.values(usersObject); // Convert object to array
      this.filteredUsers = [...this.users]; // Copy array for filtering
      console.log(this.users);
    } else {
      console.log('User data not found');
    }

    this.searchSubject.pipe(debounceTime(300)).subscribe((term) => {
      this.filteredUsers = this.users.filter(
        (user) =>
          user.name.toLowerCase().includes(term.toLowerCase()) ||
          user.uid.toLowerCase().includes(term.toLowerCase())
      );
    });
  }

  onSearch(term: string) {
    this.searchSubject.next(term);
  }

  onUserSelected(user: any) {
    console.log('[SideBarComponent] User selected:', user);
    if (!user?.uid) {
      console.warn('[SideBarComponent] No UID found in selected user');
      return;
    }

    this.chatsService.setReceiverUid(user.uid);
    this.userSelected.emit(user);
  }
}
