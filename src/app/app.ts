import { Component } from '@angular/core';
import { NotificationInboxComponent } from './notification-inbox/notification-inbox.component';

@Component({
  selector: 'app-root',
  imports: [NotificationInboxComponent],
  template: '<app-notification-inbox />',
})
export class App {}
