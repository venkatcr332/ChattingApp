import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-receive-message',
  standalone: false,

  templateUrl: './receive-message.component.html',
  styleUrl: './receive-message.component.css',
})
export class ReceiveMessageComponent {
  @Input() message!: any;
}
