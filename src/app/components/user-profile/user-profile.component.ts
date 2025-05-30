import { CurrentUserService } from './../../services/current-user.service';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-user-profile',
  standalone: false,

  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent {
  username: string | null = null;
  name: string | null = null;
  photo: string | null = null;
  userData: any;

  constructor(
    private currentUserService: CurrentUserService,
    private authenticationService: AuthenticationService,
    private fireauth: AngularFireAuth
  ) {}

  logout() {
    this.authenticationService.logout();
  }

  async ngOnInit() {
    this.fireauth.authState.subscribe(async (user) => {
      if (user) {
        this.userData = await this.currentUserService.getCurrentUser();
        // console.log('User Data:', this.userData);

        if (this.userData) {
          this.username = this.userData.uid;
          this.name = this.userData.name;
          this.photo = 'assets/users/' + this.userData.photo;
        }
      } else {
        console.log('No user is logged in');
      }
    });
  }
}
// Complete task by default
// Genertion of the code snippet is complete
// Task: Add the following code snippet to the file src/app/components/user-profile/user-profile.component.html
// Task: Add the following code snippet to the file src/app/components/user-profile/user-profile.component.css
// Updating tasks is the ability to update the status of a task
// Task: Add the following code snippet to the file src/app/components/user-profile/user-profile.component.html
