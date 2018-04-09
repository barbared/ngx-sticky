// Credits: Brian Love @ http://brianflove.com/2016/10/10/angular-2-window-scroll-event-using-hostlistener/

import { ClassProvider, FactoryProvider, InjectionToken, Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/fromEvent';

export function _window(): any {
  return window;
}

export const WINDOW = new InjectionToken('WindowToken');

export abstract class WindowRef {
  get nativeWindow(): Window {
    throw new Error('Not implemented.');
  }
}

export class BrowserWindowRef extends WindowRef {
  constructor() {
    super();
  }

  get nativeWindow(): Window {
    return _window();
  }
}

export const browserWindowProvider: ClassProvider = {
  provide: WindowRef,
  useClass: BrowserWindowRef
};
export const windowProvider: FactoryProvider = {
  provide: WINDOW,
  useFactory: _window,
  deps: []
};
export const WINDOW_PROVIDERS = [
  browserWindowProvider,
  windowProvider
];


@Injectable()
export class ScrollService {
  public y: Observable<number>;
  private ySubject = new BehaviorSubject<number>(0);
  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window,
  ) {
    this.y = this.ySubject.asObservable();
    this.ySubject.next(this.computeScrollOffsetSnapshot());
    Observable.fromEvent(window, 'scroll').subscribe((event) => {
      this.ySubject.next(this.computeScrollOffsetSnapshot());
    });
    // window.addEventListener('scroll', (event) => {
    //   this.y.next(this.computeScrollOffsetSnapshot());
    // });
  }

  private computeScrollOffsetSnapshot () {
    return this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
  }
}
