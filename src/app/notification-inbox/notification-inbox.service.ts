import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, combineLatest, delay, map, of, shareReplay, startWith, switchMap, take, tap } from 'rxjs';
import { FakeNotificationApi } from './fake-notification-api';
import {
  InboxNotification,
  INITIAL_VIEW_MODEL,
  NotificationFilter,
  NotificationViewModel,
} from './notification.models';

@Injectable()
export class NotificationInboxService {
  private readonly api = inject(FakeNotificationApi);

  private readonly reload$ = new Subject<boolean>();
  private readonly filter$ = new BehaviorSubject<NotificationFilter>('all');
  private readonly markRead$ = new Subject<string>();

  /**
   * TODO: replace placeholder with the inbox pipeline.
   * Requirements and suggested acceptance scenarios are in README.md.
   */
  readonly viewModel$: Observable<NotificationViewModel> = combineLatest([
    this.reload$.pipe(startWith(false), switchMap(()=> this.api.load().pipe(
      catchError((error) => {
      return of(null);
    })))),
    this.filter$
  ]).pipe(
    tap(()=> console.log('1')),
    map(([resp, filter]) => {
      if(resp == null){
          return{
          status: 'error',
          notifications: [],
          filter: this.filter$.value,
          unreadCount: 0,
          actionError: '',
          loadError: ''
        } as NotificationViewModel
      }
      const respFiltered = filter != 'all' ? resp?.filter(r => !r.read) : resp;
      return {
        status: 'success',
        notifications: respFiltered,
        filter: filter,
        unreadCount: 0,
      } as NotificationViewModel;
    })
  )

  setFilter(filter: NotificationFilter): void {
    this.filter$.next(filter);
  }

  markAsRead(id: string): void {
    this.markRead$.next(id);
  }

  retryLoad(): void {
    this.reload$.next(true);
  }
}
