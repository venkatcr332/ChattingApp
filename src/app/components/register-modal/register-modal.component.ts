import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-register-modal',
  standalone: false,
  templateUrl: './register-modal.component.html',
  styleUrl: './register-modal.component.css',
})
export class RegisterModalComponent {
  name: string = '';
  photo: string = '';
  email: string = '';
  password: string = '';

  constructor(
    public activeModal: NgbActiveModal,
    private authentication: AuthenticationService
  ) {}

  ngOnInit(): void {}

  register() {
    if (this.email == '') {
      alert('Please enter email');
      return;
    }
    if (this.password == '') {
      alert('Please enter password');
      return;
    }

    this.authentication.register(
      this.name,
      this.photo,
      this.email,
      this.password
    );
    this.email = '';
    this.password = '';
    this.name = '';
    this.photo = '';

    this.closeModal();
  }

  closeModal() {
    this.activeModal.close();
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.photo = file.name; // Get only the file name
    }
  }

  onSubmit(form: any) {
    if (form.valid) {
      console.log('Form Submitted:', form.value);
      this.activeModal.close(form.value);
    }
  }
}
