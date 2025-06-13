import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private darkTheme = new BehaviorSubject<boolean>(false);
  darkTheme$ = this.darkTheme.asObservable();

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    this.darkTheme.next(isDark);
    this.updateThemeClass(isDark);
  }
  toggleTheme() {
    const current = !this.darkTheme.value;
    this.darkTheme.next(current);
    localStorage.setItem('theme', current ? 'dark' : 'light');
    this.updateThemeClass(current);
  }

  private updateThemeClass(isDark: boolean) {
    document.body.classList.toggle('dark-theme', isDark);
  }

  isDarkMode(): boolean {
    return this.darkTheme.value;
  }
}
