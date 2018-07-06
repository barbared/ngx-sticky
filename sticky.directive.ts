import { Subscription } from 'rxjs/Subscription';
import { Directive, OnInit, OnDestroy, AfterViewInit, AfterViewChecked, HostListener, Renderer2, ElementRef, Input, NgZone } from '@angular/core';
import { ScrollService } from './services/window.service';

@Directive({
  selector: '[appSticky]'
})
export class StickyDirective implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  @Input() position: 'top' | 'bottom' = 'top'; // Only 'top' or 'bottom' value possible
  @Input() margin: number = 0; // Number of pixels from the reference position in terms of margin
  fixed: boolean = false;
  ypos: number;
  y: number;
  screenh: number;
  elWidth: number;
  elHeight: number;
  stickyanchor: any;
  subscription: Subscription;
  idTimeout: any;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private ngzone: NgZone,
    private scroll: ScrollService,
  ) { }

  ngOnInit() {

  }

  ngAfterViewInit() {// Retrieve initial coordinates of the DOM element

    this.screenh = window.innerHeight; // View Height

    // Element sizes
    this.elWidth = this.elRef.nativeElement.offsetWidth;
    this.elHeight = this.elRef.nativeElement.offsetHeight;

    // Element position and anchor
    // this.ypos = this.elRef.nativeElement.getBoundingClientRect().top;
    this.stickyanchor = this.renderer.createElement('stickyanchor');
    this.renderer.setStyle(this.stickyanchor, 'display', 'block');
    this.renderer.setStyle(this.stickyanchor, 'height', '0px');
    this.renderer.setStyle(this.stickyanchor, 'width', this.elWidth + 'px');
    this.renderer.setStyle(this.stickyanchor, 'visibility', 'hidden');
    this.renderer.insertBefore(this.elRef.nativeElement.parentNode, this.stickyanchor, this.elRef.nativeElement);

    this.subscription = this.scroll.y.subscribe( (y) => { // on-scroll
      this.y = y;
      if (this.elRef.nativeElement.offsetWidth !== 0 ) { // is visible? (no one of the parent is set to display: none)
        this.stickyfunction(y);
      }
    });

    // const y = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    this.ypos = this.stickyanchor.getBoundingClientRect().top + this.y;

    // console.log(this.elRef.nativeElement.className, ' == INIT == sreenh: ' + this.screenh + ' - ypos: ' + this.ypos + ' - elWidth: ' + this.elWidth + ' - elHeight: ' + this.elHeight);
  }

  ngAfterViewChecked() {

    // console.log('ngAfterViewChecked');

    if (this.elRef.nativeElement.offsetWidth !== 0) { // is visible? (no one of the parent is set to display: none)

      // ### GRACETIME ###
      // If the ngAfterViewChecked is trggered multiple times in few milliseconds, only the last call is executed
      // NgZone runOutsideAngular is used in order to not trigger the ngAfterViewChecked continously

      this.ngzone.runOutsideAngular(() => {

        clearTimeout(this.idTimeout);

          this.idTimeout = setTimeout(() => {

              const newpos = this.stickyanchor.getBoundingClientRect().top + this.y;

              if ( !(Math.round(this.ypos) === Math.round(newpos)) ) {

                this.ngzone.run(() => {
                  this.reset();
                  // console.log(this.elRef.nativeElement.className, ' == HARD_RESET == sreenh: ' + this.screenh + ' - ypos: ' + this.ypos + ' - newpos: ' + newpos + ' - elWidth: ' + this.elWidth + ' - elHeight: ' + this.elHeight);
                  this.ypos = newpos;
                  this.stickyfunction(this.y);
                });

              }

          }, 50);

      });

    }

    this.elHeight = this.elRef.nativeElement.offsetHeight; // frequently updates the element height in order to listen for internal changes

  }

  // @HostListener("window:scroll", [])
  // onWindowScroll() {
  //     if (this.elRef.nativeElement.offsetWidth !== 0 ) { // is visible? (no one of the parent is set to display: none)
  //       this.stickyfunction();
  //     }
  //   }
  @HostListener("window:resize") onResize() {
    this.reset();
  }

   private stickyfunction(y: number, reset?: boolean) {

    const fixtop = y > (this.ypos - this.margin) && this.position === 'top';
    const fixbottom = y < (this.ypos - this.screenh + this.margin + this.elHeight) && this.position === 'bottom';
    const unfixtop = y <= (this.ypos - this.margin) && this.position === 'top';
    const unfixbottom = y >= (this.ypos - this.screenh + this.margin + this.elHeight) && this.position === 'bottom';

      if ( (fixtop || fixbottom) && !this.fixed) {

        // EXTEND ANCHOR
        this.renderer.setStyle(this.stickyanchor, 'height', this.elHeight + 'px');

        // SET FIXED
        this.renderer.setStyle(this.elRef.nativeElement, 'width', this.elWidth + 'px');
        this.renderer.setStyle(this.elRef.nativeElement.parentElement, 'position', 'relative');
        this.renderer.setStyle(this.elRef.nativeElement, 'position', 'fixed');
        this.renderer.setStyle(this.elRef.nativeElement, 'z-index', '50');
        this.renderer.setStyle(this.elRef.nativeElement, this.position, this.margin + 'px');

        this.fixed = true;
      }
      if ( (unfixtop || unfixbottom || reset)  && this.fixed ) {

        // SET UNFIXED
        this.renderer.removeStyle(this.elRef.nativeElement, 'width');
        this.renderer.removeStyle(this.elRef.nativeElement.parentElement, 'position');
        this.renderer.removeStyle(this.elRef.nativeElement, 'position');
        this.renderer.removeStyle(this.elRef.nativeElement, 'z-index');
        this.renderer.removeStyle(this.elRef.nativeElement, this.position);

        // COLLAPSE ANCHOR
        this.renderer.setStyle(this.stickyanchor, 'height', '0px');

        this.fixed = false;
      }

    }

    public reset() {
      this.screenh = window.innerHeight;
      this.elWidth = this.elRef.nativeElement.offsetWidth;
      this.elHeight = this.elRef.nativeElement.offsetHeight;
      this.renderer.setStyle(this.stickyanchor, 'width', this.elWidth + 'px');
      this.stickyfunction(this.y, true);
    }

    ngOnDestroy() {
      this.subscription.unsubscribe();
    }

}
