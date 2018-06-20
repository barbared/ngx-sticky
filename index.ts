import { CommonModule } from '@angular/common';
import {StickyDirective} from './sticky.directive';
import { NgModule } from '@angular/core';
import { ScrollService, WINDOW, WINDOW_PROVIDERS } from './services/window.service';

@NgModule({
 imports: [
   CommonModule
 ],
 exports: [StickyDirective],
 declarations: [StickyDirective],
 providers: [WINDOW_PROVIDERS, ScrollService]
})
export class NgxStickyModule { }