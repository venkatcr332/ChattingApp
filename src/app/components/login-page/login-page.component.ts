import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent {
  user = { username: '', password: '' };
  errorMessage = '';

  constructor(private http: HttpClient, private authService: AuthService) {}

  onSubmit() {
    this.http.get<any[]>('http://localhost:3000/users').subscribe(
      (users) => {
        const foundUser = users.find(
          (u) =>
            u.username === this.user.username &&
            u.password === this.user.password
        );

        if (foundUser) {
          console.log('Login Successful!', foundUser);
          this.authService.setUser({
            username: foundUser.username,
            name: foundUser.name,
            photo: foundUser.photo,
          });
        } else {
          console.log('Login Not Successful!');
        }
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }
}
