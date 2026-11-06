import type { Page, Request } from '@playwright/test';

const POLL_MS = 50;
const MAX_WAIT_MS = 15_000;

/**
 * Tracks the requests that match `isTracked` and waits until none is in flight and none has started for `quietMs`.
 * For debounced calls the app fires on its own (the postcode lookup), where waiting for one response is not enough:
 * a second call can still be on its way, and the app shows nothing on screen while a debounced call is pending.
 * The quiet window starts when wait() is called, so a call the app fires within `quietMs` of wait() is still waited for.
 */
export class NetworkQuiet {
  private inFlight = 0;
  private lastActivity = 0;

  constructor(page: Page, isTracked: (url: string) => boolean) {
    const start = (r: Request) => {
      if (!isTracked(r.url())) return;
      this.inFlight++;
      this.lastActivity = Date.now();
    };
    const end = (r: Request) => {
      if (!isTracked(r.url())) return;
      this.inFlight--;
      this.lastActivity = Date.now();
    };
    page.on('request', start);
    page.on('requestfinished', end);
    page.on('requestfailed', end);
  }

  async wait(quietMs: number): Promise<void> {
    this.lastActivity = Math.max(this.lastActivity, Date.now());
    const deadline = Date.now() + MAX_WAIT_MS;
    while (this.inFlight > 0 || Date.now() - this.lastActivity < quietMs) {
      if (Date.now() > deadline) throw new Error(`Network never went quiet (${this.inFlight} request(s) in flight)`);
      await new Promise((resolve) => setTimeout(resolve, POLL_MS));
    }
  }
}
