# General Helpers
General helper classes reside in `src/helpers/general.scss`

## - Float -
Classes that help with floating elements

## .is-pulled-left
Floats an element to the left

### Usage
```html
<div class="is-pulled-left">
  Everything in here is floated to the left
</div>
```

## .is-pulled-right
Floats an element to the right

### Usage
```html
<div class="is-pulled-right">
  Everything in here is floated to the right
</div>
```

## .is-clearfix
Fixes an element's floating children

### Usage
```html
<div class="is-clearfix">
  <div class="is-pulled-left is-clearfix">Sidebar</div>
  <!-- No Clearing div required because you used is-clearfix -->
</div>
```

## - Overflow -
Classes that help with overflow

## .is-clipped
Adds overflow **hidden**

## .is-not-clipped
Adds overflow **visible**

## - Misc -
Classes that are hard to categorize right now

## .is-radiusless
Removes any **radius**

## .is-shadowless
Removes any **shadow**

## .is-100vh
Make an element 100vh