import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Database, ref, set } from '@angular/fire/database';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private fireauth: AngularFireAuth, private router: Router) {}
  private db = inject(Database);

  //login method
  login(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password).then(
      () => {
        alert('Login successful');
        this.router.navigate(['/home']);
      },
      (err) => {
        alert('something went wrong');
        console.error(err);
        this.router.navigate(['/login']);
      }
    );
  }

  // register user
  register(name: string, photo: string, email: string, password: string) {
    this.fireauth.createUserWithEmailAndPassword(email, password).then(
      (userCredential) => {
        if (userCredential.user) {
          const uid = userCredential.user.uid;
          const url = 'user/' + uid;
          const dbRef = ref(this.db, url);
          const userData = {
            name: name,
            email: email,
            photo: photo,
            uid: uid,
          };
          set(dbRef, userData)
            .then(() => {
              alert('Registration successful');
              this.router.navigate(['/login']);
            })
            .catch((error) => {
              console.error('Error saving user details:', error);
              alert('Error saving user details');
            });
        }
      },
      (err) => {
        alert('Something went wrong');
        console.error(err);
      }
    );
  }

  //logout user
  logout() {
    this.fireauth.signOut().then(
      () => {
        localStorage.removeItem('token');
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['/login']);
        console.log('Logged out successfully');
      },
      (err) => {
        console.log(err);
        alert('something went wrong');
      }
    );
  }
}
