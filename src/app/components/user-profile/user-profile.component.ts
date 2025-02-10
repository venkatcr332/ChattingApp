import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

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

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.user$.subscribe((userData) => {
      this.username = userData.username;
      this.name = userData.name;
      this.photo = userData.photo;
    });
  }
}
