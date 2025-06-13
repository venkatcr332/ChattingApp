import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: false,

  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  selectedUser: any = null;
  private themeSubscription!: Subscription;
  isDarkMode: boolean = false; // Initialize dark mode state

  constructor(private themeService: ThemeService) {
    this.themeSubscription = this.themeService.darkTheme$.subscribe(
      (isDark) => (this.isDarkMode = isDark)
    );
  }

  onUserSelected(user: any) {
    this.selectedUser = user; // Update selected user
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
