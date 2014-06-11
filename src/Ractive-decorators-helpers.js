/*

	Ractive-decorators-helpers
	==========================

	Version <%= VERSION %>.

	Currently two helper methods:
		- .create() for simple decorators that need no teardown and
						use the same function for initial load and update.
		- .combine() for combining decorators. Ractive currently only allows
						one dectorator per element. This function creates a
						decorator that allows the use of multiple decorators

	==========================

	Troubleshooting: If you're using a module system in your app (AMD or
	something more nodey) then you may need to change the paths below,
	where it says `require( 'Ractive' )` or `define([ 'Ractive' ]...)`.

	==========================

	Usage: Include this file on your page below Ractive, e.g:

		<script src='lib/Ractive.js'></script>
		<script src='lib/Ractive-decorators-helpers.js'></script>

	Or, if you're using a module loader, require this module:

		// requiring the plugin will 'activate' it - no need to use
		// the return value
		require( 'Ractive-decorators-helpers' );

	see http://martypdx.github.io/Ractive-decorator-helpers/ for demo and examples

*/

(function ( global, factory ) {

	'use strict';

	// Common JS (i.e. browserify) environment
	if ( typeof module !== 'undefined' && module.exports && typeof require === 'function' ) {
		factory( require( 'Ractive' ) );
	}

	// AMD?
	else if ( typeof define === 'function' && define.amd ) {
		define([ 'Ractive' ], factory );
	}

	// browser global
	else if ( global.Ractive ) {
		factory( global.Ractive );
	}

	else {
		throw new Error( 'Could not find Ractive! It must be loaded before the Ractive-decorators-helpers plugin' );
	}

}( typeof window !== 'undefined' ? window : this, function ( Ractive ) {

	'use strict';

	Ractive.decorators.create = function(fn){
	   return function(node){
			var args = Array.prototype.slice.call(arguments, 1, arguments.length)

			//note: fn.bind(node) fails in grunt:qunit :(

			fn.apply(node, args)

			function _fn(){
				fn.apply(node, arguments)
			}

			return {
				teardown: function(){},
				update: _fn
			}
		}
	}

	if(!Array.isArray) {
	  Array.isArray = function (vArg) {
		var isArray;

		isArray = vArg instanceof Array;

		return isArray;
	  };
	}

	Ractive.decorators.combine = function(wrapped){

		return function(node, toCall){
			var decorators = [],
				ractive = this

			wrapped.forEach( function(d){
				var callArgs, name = Object.keys(d)[0];

				if( !(callArgs = toCall[name]) ) { return; }

				var	fn = d[name],
					args = callArgs ? [node].concat(callArgs) : [node],
					result = fn.apply(ractive, args)


				if ( !result || !result.teardown ) {
					throw new Error( 'Decorator definition "' + name + '" must return an object with a teardown method' );
				}


				result._name = name
				decorators.push(result)

			})

			return {
				teardown: function(){
					decorators.forEach(function(d){
						d.teardown()
					})
				},
				update: function(toUpdate){
					decorators.forEach(function(d){
						var values = toUpdate[d._name]
						if(!Array.isArray(values)) { values = [values]}
						d.update.apply(node, values)
					})
				}
			};
		};
	};

}));
