import { Component, Input, OnInit } from '@angular/core';
import { CurrentUserService } from '../../services/current-user.service';

@Component({
  selector: 'app-header',
  standalone: false,

  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Input() selectedUser: any; // Receive selected user
}
