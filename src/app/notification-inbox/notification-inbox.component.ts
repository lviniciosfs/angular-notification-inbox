import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { FakeNotificationApi } from './fake-notification-api';
import { NotificationInboxService } from './notification-inbox.service';
import { INITIAL_VIEW_MODEL, NotificationFilter } from './notification.models';

@Component({
  selector: 'app-notification-inbox',
  templateUrl: './notification-inbox.component.html',
  styleUrl: './notification-inbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe],
  providers: [NotificationInboxService],
})
export class NotificationInboxComponent {
  private readonly inbox = inject(NotificationInboxService);

  protected readonly vm = toSignal(this.inbox.viewModel$, { initialValue: INITIAL_VIEW_MODEL });
  protected readonly apiStats = inject(FakeNotificationApi).stats;

  protected setFilter(filter: NotificationFilter): void {
    this.inbox.setFilter(filter);
  }

  protected markAsRead(id: string): void {
    this.inbox.markAsRead(id);
  }

  protected retryLoad(): void {
    this.inbox.retryLoad();
  }
}
