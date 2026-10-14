# Angular + RxJS challenge: Live notification inbox

**Timebox:** 1 hour  
**Stack:** Angular 21.1.1, RxJS 7.8, standalone components, signals, zoneless change detection.

## Run

```bash
npm start
```

Open `http://localhost:4200`.

## Your task

Implement the notification stream in:

```text
src/app/notification-inbox/notification-inbox.service.ts
```

UI, models and fake API are already wired. The service currently returns a placeholder view model.

## Requirements

1. **Initial load:** load notifications once when the view model is first subscribed to. Show `loading`, then `success` or `error`.
2. **Live updates:** after a successful load, subscribe to `FakeNotificationApi.watch()` and add incoming notifications to the inbox.
3. **Deduplication:** never show the same notification ID twice. Sort newest first and keep at most `MAX_NOTIFICATIONS`.
4. **Unread filter:** `all` shows every item; `unread` shows only unread items. `unreadCount` always counts unread items in the full inbox, regardless of filter.
5. **Optimistic mark-read:** clicking **Mark read** immediately marks the item read. Call `api.markAsRead(id)`; if it fails, roll that item back to unread and expose an `actionError`.
6. **Per-item failure:** one failed mark-read operation must not terminate live updates or affect other notifications.
7. **Reload/reconnect:** `retryLoad()` retries the initial load after a load failure. Once successful, live updates resume.
8. **One shared stream:** multiple subscribers to `viewModel$` must not create duplicate API loads or duplicate live streams.
9. **Immutable updates:** do not mutate notification objects or arrays in place.

## Constraints

- Keep implementation in the service; component and fake API are read-only.
- No manual `subscribe()` in the service. Component's `toSignal()` owns the subscription.
- No `setTimeout`, `setInterval`, promises, `async`/`await`, `firstValueFrom` or `toPromise`.
- No `effect()` and no external state-management library.
- Use RxJS operators to compose the stream. `scan` is a good fit for accumulating inbox events.
- Keep the stream alive after load or action errors.

## Try these scenarios

- Load the page: seed notifications appear, then new live notifications arrive every few seconds.
- Switch **All** / **Unread** while events arrive: filter updates immediately; unread count stays global.
- Mark a regular unread notification as read: it disappears from **Unread**.
- Mark **Action error demo** as read: it should revert to unread and show an error. Live events should keep arriving.
- Wait for a load failure (12% chance), then click **Retry**. After reload, live updates resume.
- Open browser DevTools and observe API logs and counters. One component should produce one load and one live stream.

## Evaluation

- Correct use of `scan`, `merge`, `switchMap`/`mergeMap`, `catchError`, `shareReplay` and `takeUntil` where appropriate.
- Per-notification error isolation and correct optimistic rollback.
- No duplicate API subscriptions or stale state.
- Clean immutable state updates and readable RxJS composition.

## Optional stretch goals

- Add a **Mark all read** action with independent rollback behavior.
- Add a maximum retry policy for the live stream with exponential backoff.
- Inject a `SchedulerLike` so stream timing can be controlled.
