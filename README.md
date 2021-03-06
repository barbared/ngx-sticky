# ngx-sticky

**Angular sticky boxes**

[![npm](https://img.shields.io/npm/v/ngx-sticky.svg?maxAge=2592000?style=flat-square)](https://www.npmjs.com/package/ngx-sticky)
[![npm](https://img.shields.io/npm/dm/ngx-sticky.svg)](https://www.npmjs.com/package/ngx-sticky)

## Description
Angular attribute directive for the creation of sticky boxes in the web-pages of your applications.
Compatible __Angular4+__.

This directive will have a result similar to the CSS3 property __position: sticky__ but it also allows to set sticky boxes in respect to the bottom baseline of the view.

## Installation

To install this component to an external project, follow the procedure:

1. __npm install ngx-sticky --save__

2. Add __NgxStickyModule__ import to your __@NgModule__ like example below
```ts
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';

    import { NgxStickyModule } from 'ngx-sticky';

    import { MyTestApp } from './my-test-app';

    @NgModule({
        imports: [ 
          BrowserModule,
          NgxStickyModule 
        ],
        declarations: [ MyTestApp ],
        bootstrap:    [ MyTestApp ]
    })
    export class MyTestAppModule {}
```
    
## Usage

Apply the __appSticky__ directive to your HTML tags and use the following attributes to manage its options.

```html
    <div appSticky position="top" margin="50" id="myElement"> </div>
```
    
## Attributes

| Option         | Default        | Type | Description |
| :------------- | :------------- | :---------- | :---------- |
| __position__     | 'top' | string | Position of reference for the sticky.  __top__: the element will stick in respect to the top line. __bottom__: the element will stick in respect to the bottom line. |
| __margin__   | 0 | number | Number of pixel for the element margin in respect of the reference _position_ while it is sticky. |

## Compatibility (tested with)
* Firefox (latest)
* Chrome (latest)
* Edge
* IE10
* Safari

## License
* License: MIT

## Author
* Author: barbared

## Keywords
* sticky
* Angular2+
* typescript
