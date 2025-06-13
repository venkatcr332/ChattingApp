import { CurrentUserService } from './../../services/current-user.service';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthenticationService } from '../../services/authentication.service';
import { ThemeService } from '../../services/theme.service';

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

  isDarkMode: boolean;

  constructor(
    private currentUserService: CurrentUserService,
    private authenticationService: AuthenticationService,
    private fireauth: AngularFireAuth,
    private themeService: ThemeService
  ) {
    this.isDarkMode = this.themeService.isDarkMode();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.isDarkMode = this.themeService.isDarkMode();
  }

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
