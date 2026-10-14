import { Injectable, inject } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { FakeNotificationApi } from './fake-notification-api';
import {
  INITIAL_VIEW_MODEL,
  NotificationFilter,
  NotificationViewModel,
} from './notification.models';

@Injectable()
export class NotificationInboxService {
  private readonly api = inject(FakeNotificationApi);

  private readonly reload$ = new Subject<void>();
  private readonly filter$ = new Subject<NotificationFilter>();
  private readonly markRead$ = new Subject<string>();

  /**
   * TODO: replace placeholder with the inbox pipeline.
   * Requirements and suggested acceptance scenarios are in README.md.
   */
  readonly viewModel$: Observable<NotificationViewModel> = of(INITIAL_VIEW_MODEL);

  setFilter(filter: NotificationFilter): void {
    this.filter$.next(filter);
  }

  markAsRead(id: string): void {
    this.markRead$.next(id);
  }

  retryLoad(): void {
    this.reload$.next();
  }
}
