# Display Helpers
Classes that help with displaying & hiding elements live in `/src/helpers/display.scss`

## .is-block
Applies `display: block;` to the element

### Usage:
```html
<span class="is-block">
This span is a block element
</span>
```

## .is-flex
Applies `display: flex;` to the element

### Usage:
```html
<div class="is-flex">
This div is a nifty flex container
</div>
```

## .is-inline
Applies `display: inline;` to the element

### Usage:
```html
<p class="is-inline">
This paragraph is inline
</p>
```

## .is-inline-block
Applies `display: inline-block;` to the element

### Usage:
```html
<div class="is-inline-block">
This div is inline block
</div>
```

## .is-inline-flex
Applies `display: inline-flex;` to the element

### Usage:
```html
<div class="is-inline-flex">
This div is inline flex
</div>
```

## .is-hidden
Hides element via `display: none;`

### Usage:
```html
<div class="is-hidden">
*Waves hand in front of face* You can't see me!
</div>
```

## .is-invisible
Adds `visibility: hidden;`

### Usage:
```html
<div class="is-invisible">
You can't see me but I still exist!  It's magic.
</div>
```

## .is-visible
Adds `visibility: visible;`

### Usage:
```html
<div [ngClass]="{'is-visible' ? someBoolean : 'is-invisible'}">
If someBoolean is true you can see me.  If it's false YOU CAN'T SEE ME *waves hand in front of face*
</div>
```

## .is-sr-only
Hide elements **visually** but keep the element available to be announced by a **screen reader**

### Usage:
```html
<div class="is-sr-only">
You can't see me unless you're using a screen reader. #accessibilitymatters
</div>
```
