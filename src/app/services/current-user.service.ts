import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Database, ref, get } from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class CurrentUserService {
  user: any;
  constructor(private fireauth: AngularFireAuth, private db: Database) {}
  async getCurrentUser() {
    const user = await this.fireauth.currentUser;
    if (user) {
      const uid = user.uid;
      const userRef = ref(this.db, 'user/' + uid);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        console.log(snapshot);
        return snapshot.val();
      } else {
        console.log('User data not found');
        return null;
      }
    }
  }
}
