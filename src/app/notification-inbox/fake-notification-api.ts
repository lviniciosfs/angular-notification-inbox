// Do not change this file. It simulates a slow, unreliable notification backend.
import { Injectable, computed, signal } from '@angular/core';
import { Observable, interval, map, mergeMap, of, throwError, timer } from 'rxjs';
import { InboxNotification, NotificationCategory } from './notification.models';

export class HttpLikeError extends Error {
  constructor(public readonly status: number) {
    super(`HTTP ${status}`);
  }
}

const SEED_NOTIFICATIONS: readonly InboxNotification[] = [
  {
    id: 'n-101',
    title: 'Order confirmed',
    message: 'Your order #8421 has been confirmed.',
    category: 'orders',
    createdAt: '2026-10-14T08:42:00.000Z',
    read: false,
  },
  {
    id: 'n-102',
    title: 'New sign-in detected',
    message: 'A new sign-in was detected from Lisbon, Portugal.',
    category: 'security',
    createdAt: '2026-10-14T08:15:00.000Z',
    read: false,
  },
  {
    id: 'n-fail-read',
    title: 'Action error demo',
    message: 'Marking this notification as read always fails. Use it to test rollback.',
    category: 'system',
    createdAt: '2026-10-14T07:50:00.000Z',
    read: false,
  },
  {
    id: 'n-104',
    title: 'Delivery update',
    message: 'Your package is on its way.',
    category: 'orders',
    createdAt: '2026-10-13T17:22:00.000Z',
    read: true,
  },
  {
    id: 'n-105',
    title: 'Scheduled maintenance',
    message: 'The service will be unavailable on Sunday from 01:00 to 01:15 UTC.',
    category: 'system',
    createdAt: '2026-10-13T13:10:00.000Z',
    read: true,
  },
];

const LIVE_MESSAGES: readonly {
  title: string;
  message: string;
  category: NotificationCategory;
}[] = [
  { title: 'Order packed', message: 'Your order #8421 is ready to ship.', category: 'orders' },
  { title: 'Price drop alert', message: 'An item on your watchlist is now on sale.', category: 'system' },
  { title: 'Password updated', message: 'Your account password was changed.', category: 'security' },
  { title: 'Delivery update', message: 'Your delivery is expected tomorrow.', category: 'orders' },
];

@Injectable({ providedIn: 'root' })
export class FakeNotificationApi {
  private readonly loadCount = signal(0);
  private readonly readCount = signal(0);
  private readonly liveCount = signal(0);

  readonly stats = computed(() => ({
    loads: this.loadCount(),
    markReadCalls: this.readCount(),
    liveEvents: this.liveCount(),
  }));

  load(): Observable<readonly InboxNotification[]> {
    this.loadCount.update(count => count + 1);
    const requestNumber = this.loadCount();
    const latency = 500 + Math.random() * 500;
    console.debug(`[api] load #${requestNumber} started (${Math.round(latency)}ms)`);

    return timer(latency).pipe(
      mergeMap(() => {
        if (Math.random() < 0.12) {
          console.debug(`[api] load #${requestNumber} failed (503)`);
          return throwError(() => new HttpLikeError(503));
        }
        console.debug(`[api] load #${requestNumber} succeeded`);
        return of(SEED_NOTIFICATIONS.map(notification => ({ ...notification })));
      }),
    );
  }

  watch(): Observable<InboxNotification> {
    return interval(2400).pipe(
      map(index => {
        const message = LIVE_MESSAGES[Math.floor(Math.random() * LIVE_MESSAGES.length)];
        const notification: InboxNotification = {
          ...message,
          id: `live-${index + 1}`,
          createdAt: new Date().toISOString(),
          read: false,
        };
        this.liveCount.update(count => count + 1);
        console.debug(`[api] live event ${notification.id}`);
        return notification;
      }),
    );
  }

  markAsRead(id: string): Observable<void> {
    this.readCount.update(count => count + 1);
    console.debug(`[api] mark read ${id}`);

    return timer(350 + Math.random() * 400).pipe(
      mergeMap(() => {
        if (id === 'n-fail-read' || Math.random() < 0.2) {
          return throwError(() => new HttpLikeError(503));
        }
        return of(void 0);
      }),
    );
  }
}
