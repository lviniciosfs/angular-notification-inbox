import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, Subject, catchError, combineLatest, delay, filter, map, of, shareReplay, startWith, switchMap, take, tap } from 'rxjs';
import { FakeNotificationApi } from './fake-notification-api';
import {
  InboxNotification,
  INITIAL_VIEW_MODEL,
  MAX_NOTIFICATIONS,
  NotificationFilter,
  NotificationViewModel,
} from './notification.models';

@Injectable()
export class NotificationInboxService {
  private readonly api = inject(FakeNotificationApi);

  private readonly reload$ = new Subject<boolean>();
  private readonly filter$ = new BehaviorSubject<NotificationFilter>('all');
  private readonly markRead$ = new Subject<string>();
  private notificationsCache = new BehaviorSubject<InboxNotification[]>([]);

  /**
   * TODO: replace placeholder with the inbox pipeline.
   * Requirements and suggested acceptance scenarios are in README.md.
   */
  readonly viewModel$: Observable<NotificationViewModel> = combineLatest([
    this.reload$.pipe(startWith(false), switchMap(()=> this.api.load().pipe(
      catchError(() => { return of(null) })
    ))),
    this.filter$,
    this.api.watch().pipe(startWith(null))
  ]).pipe(
    map(([resp, filter, watched]) => {
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
      const notificationCached = this.notificationsCache.getValue();
      if(watched){
        this.notificationsCache.next([watched, ...notificationCached])  
      } else {
        this.notificationsCache.next([...resp]);
      }
      let respFiltered = filter != 'all' ? this.notificationsCache.getValue()?.filter(r => !r.read) : this.notificationsCache.getValue();
      return {
        status: 'success',
        notifications: respFiltered.filter(n => n.id !== watched?.id).slice(0, MAX_NOTIFICATIONS),
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
