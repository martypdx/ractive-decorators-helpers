Ractive.js helpers decorator plugin
===================================

[See the demo here.](martypdx.github.io/Ractive-decorator-helpers)

*Find more Ractive.js plugins at [ractivejs.org/plugins](http://ractivejs.org/plugins)*


Usage
-----

Include this file on your page below Ractive, e.g:

```html
<script src='lib/Ractive.js'></script>
<script src='lib/Ractive-decorators-helpers.js'></script>
```

Or, if you're using a module loader, require this module:

```js
// requiring the plugin will 'activate' it - no need to use the return value
require( 'Ractive-decorators-helpers' );
```

Currently two helper methods:
- `create()` for simple decorators that need no teardown and use the same function for initial load and update.
- `combine()` for combining decorators. Ractive currently only allows one dectorator per element. This function creates a decorator that allows the use of multiple decorators
		
The helper functions are exposed as `Ractive.decorators.create` and `Ractive.decorators.combine`. 
Please note that they are meant to be invoked and thus will __not__ work as decorators themeselves.

#### `.create(_fn_)`

Wraps the supplied function as a decorator, called both at load and update. No-op teardown functionality.
`this` in the function refers to the decorated node.
```
colorize: Ractive.decorators.create(function(color){
	//"this" refers to the decorated node
	this.style.color = color 
})
```
		
#### `.combine(_[ { n1: d1 }, { n2: d2 }, ... ]_)`

Wraps the supplied decorators as a single decorator. The supplied array order is preserved in load and update.

The decorator is used in the template as:
```
decorator="alias: { decorator1: [arg1, arg2, argn], decorator1: [arg1, arg2, argn]}"
```
For single argument decortors, the array is optional:
```
decorator="alias: { decorator1: arg1, decorator1: [arg1, arg2]}"
```
Example usage:
```
var decorators = Ractive.decorators,
	combined = decorators.combine([
		{
			color: decorators.create(function(color){
				this.style.color = color 
			})
		},
		{
			font: decorators.create(function(weight, pt){
				this.style.fontWeight = weight
				this.style.fontSize = pt + 'pt'
			})		
		}
	]),
	ractive = new Ractive({
		el: '#demo-combine',
		template: '#demo-template-combine',
		decorators: {
			styleMe: combined
		},
		data : {
			color: 'green',
			pt: 20
		}
	})
```

[See the demo for full examples.](martypdx.github.io/Ractive-decorator-helpers)

License
-------

Copyright (c) 2014 Marty Nelson. Licensed MIT

Created with the [Ractive.js plugin template](https://github.com/RactiveJS/Plugin-template) for Grunt.
