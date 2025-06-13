import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Component, inject } from '@angular/core';
import { RegisterModalComponent } from '../register-modal/register-modal.component';
import { AuthenticationService } from '../../services/authentication.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(
    private authentication: AuthenticationService,
    private modalService: NgbModal
  ) {}

  db: AngularFireDatabase = inject(AngularFireDatabase);

  ngOnInit(): void {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  login() {
    if (this.email == '') {
      alert('Please enter email');
      return;
    }
    if (this.password == '') {
      alert('Please enter password');
      return;
    }

    this.authentication.login(this.email, this.password);
    this.email = '';
    this.password = '';
  }

  openRegisterModal() {
    const modalRef = this.modalService.open(RegisterModalComponent);
    modalRef.result
      .then((result) => {
        if (result) {
          console.log('Registered User:', result);
        }
      })
      .catch(() => {});
  }
}

//   onSubmit() {
//     this.http.get<any[]>('http://localhost:3000/users').subscribe(
//       (users) => {
//         const foundUser = users.find(
//           (u) =>
//             u.username === this.user.username &&
//             u.password === this.user.password
//         );

//         if (foundUser) {
//           console.log('Login Successful!', foundUser);
//           this.userService.setCurrentUser(foundUser.username);
//           this.authService.setUser({
//             username: foundUser.username,
//             name: foundUser.name,
//             photo: foundUser.photo,
//           });
//         } else {
//           console.log('Login Not Successful!');
//         }
//       },
//       (error) => {
//         console.error('Error fetching users', error);
//       }
//     );
//   }
// }
