import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sent-message',
  standalone: false,

  templateUrl: './sent-message.component.html',
  styleUrl: './sent-message.component.css',
})
export class SentMessageComponent {
  @Input() message!: any;
}
