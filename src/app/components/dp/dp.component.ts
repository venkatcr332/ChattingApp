import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dp',
  standalone: false,

  templateUrl: './dp.component.html',
  styleUrl: './dp.component.css',
})
export class DpComponent {
  @Input() photo: string | null = null;
}
