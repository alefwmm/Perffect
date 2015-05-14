# Perffect
## An easy to use layout tool

Based on [Masonry](http://masonry.desandro.com/), the idea is to get the elements to fit
columns, align the container to the center and detect elements resize event.

Only works with **fixed** width elements.

# How to install and import

Install via bower:
```
bower install alefwmm/Perffect
```

Import script:
```html
<script type="text/javascript” src=”path/yo/bower_components/Resizer/dist/Resizer.min.js”></script>
<script type=”text/javascript” src=”path/to/bower_components/Perffect/dist/Perffect.min.js”></script>
```

Import via HTML Import:
```html
<link rel=”import” href=”path/to/bower_components/Perffect/Perffect.html” />
```

# How to use

Document example:
```html
<div id=”container”>
    <div class=”block” style=”width: 300px; height: [randomHeight]”></div>
    <div class=”block” style=”width: 300px; height: [randomHeight]”></div>
    <div class=”block” style=”width: 300px; height: [randomHeight]”></div>
    <div class=”block” style=”width: 300px; height: [randomHeight]”></div>
    <div class=”block” style=”width: 300px; height: [randomHeight]”></div>
    <div class=”block” style=”width: 300px; height: [randomHeight]”></div>
    <div class=”block” style=”width: 300px; height: [randomHeight]”></div>
    <div class=”block” style=”width: 300px; height: [randomHeight]”></div>
    <div class=”block” style=”width: 300px; height: [randomHeight]”></div>
</div>
```

The Constructor:
```javascript
Perffect(config);

/*
config: {
    container: The DOM node of the elements to be managed.
    selector: The selector of the elements to be managed, or a function that returns the elements
    gutter: Distance among the elements (in pixels)
    notAuto: By default, Perffect auto starts, you may disable this (optional) 
}
*/
```

Start-up script:
```javascript
var container = document.getElementById(“container”);

var perffect = new Perffect({container: container, selector: “.block”, gutter: 20});
```

See the [demo](http://alefwmm.github.io/Perffect/) page.

# Rearrange

You may call *rearrange* method by yourself when needed:

```javascript
//New elements added, call rearrange
perffect.rearrange();
```

