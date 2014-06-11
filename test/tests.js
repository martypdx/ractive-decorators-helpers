// Ractive-decorators-helpers tests
// ==========================

(function () {

	var fixture = document.getElementById('qunit-fixture'),
		decorators = Ractive.decorators

	test('Create simple decorator with update', function (t) {
		var ractive = new Ractive({
        	el: fixture,
        	template: '<p decorator="attr: \'foo\',\'{{attrValue}}\'">',
			decorators: {
				attr: decorators.create(function(name,value){
			        this.setAttribute(name,value)
			    })
			},
			data: {
				attrValue: 'bar'
			}
    	})

		t.htmlEqual(fixture.innerHTML, '<p foo="bar"></p>')
		ractive.set('attrValue', 'bizz')
		t.htmlEqual(fixture.innerHTML, '<p foo="bizz"></p>')

	})

	function combineTest(name, template){

		test('Combine decorators', function (t) {
			var ractive = new Ractive({
	        	el: 'qunit-fixture',
	        	template: template,
		        decorators: {
		            combined: decorators.combine([
		                {
		                	attr1: decorators.create(function(value){
						        this.setAttribute('attr1',value)
						    })
		            	},
		            	{
			                attr2: decorators.create(function(value){
						        this.setAttribute('attr2',value)
						    })
						}
		            ])
		        },
		        data: {
		            attr1: 'foo',
		            attr2: 'bar'
		        }
	    	})

			t.htmlEqual(fixture.innerHTML, '<p attr1="foo" attr2="bar"></p>')
			ractive.set('attr1', 'blah')
			t.htmlEqual(fixture.innerHTML, '<p attr1="blah" attr2="bar"></p>')
			ractive.set({ attr1: 'boop', attr2: 'beep' })
			t.htmlEqual(fixture.innerHTML, '<p attr1="boop" attr2="beep"></p>')
		})
    }

    combineTest('Combine decorators', '<p decorator="combined: { attr1: [\'{{attr1}}\'], attr2: [\'{{attr2}}\'] }">')
    combineTest('Single value works as array', '<p decorator="combined: { attr1: \'{{attr1}}\', attr2: [\'{{attr2}}\'] }">')

	test('Not all combined decorators are required', function (t) {
		var ractive = new Ractive({
        	el: 'qunit-fixture',
        	template: '<p decorator="combined: { attr1: [\'{{attr1}}\'] }">',
	        decorators: {
	            combined: decorators.combine([
	                {
	                	attr1: decorators.create(function(value){
					        this.setAttribute('attr1',value)
					    })
	            	},
	            	{
		                attr2: decorators.create(function(value){
					        this.setAttribute('attr2',value)
					    })
					}
	            ])
	        },
	        data: {
	            attr1: 'foo',
	            attr2: 'bar'
	        }
    	})

		t.htmlEqual(fixture.innerHTML, '<p attr1="foo"></p>')
		ractive.set('attr1', 'blah')
		t.htmlEqual(fixture.innerHTML, '<p attr1="blah"></p>')
		ractive.set({ attr1: 'boop', attr2: 'beep' })
		t.htmlEqual(fixture.innerHTML, '<p attr1="boop"></p>')
	})


	test('Order is enforced based on construction order of combined decorator', function (t) {
		var ractive = new Ractive({
        	el: 'qunit-fixture',
        	template: '<p decorator="combined: { attr1: \'{{attr1}}\', attr2: \'{{attr2}}\' }">',
	        decorators: {
	            combined: decorators.combine([
	                {
	                	attr2: decorators.create(function(value){
					        this.setAttribute('attr',value)
					    })
	            	},
	            	{
		                attr1: decorators.create(function(value){
					        this.setAttribute('attr',value)
					    })
					}
	            ])
	        },
	        data: {
	            attr1: 'foo',
	            attr2: 'bar'
	        }
    	})

		t.htmlEqual(fixture.innerHTML, '<p attr="foo"></p>')
		ractive.set('attr2', 'blah')
		t.htmlEqual(fixture.innerHTML, '<p attr="foo"></p>')
		ractive.set('attr1', 'boop')
		t.htmlEqual(fixture.innerHTML, '<p attr="boop"></p>')
	})

	test('Ractive instance available as this', function (t) {
		var decoratorThis

		var ractive = new Ractive({
        	el: 'qunit-fixture',
        	template: '<p decorator="combined: { decorate: [\'\'] }">',
	        decorators: {
	            combined: decorators.combine([
	                {
	                	decorate: function(){
					        decoratorThis = this
					        return { teardown: function(){} }
					    }
	            	}])
	        }
    	})

		assert.equal(decoratorThis, ractive)
	})

	test('object with teardown must be supplied by individual decorators', function (t) {

		throws(
			function(){
				new Ractive({
		        	el: 'qunit-fixture',
		        	template: '<p decorator="combined: { decorate: [\'\'] }">',
			        decorators: {
			            combined: decorators.combine([
			                {
			                	decorate: function(){
							        //should throw because no teardown returned
							    }
			            	}])
			        }
		    	})
			}
		)
	})

	test('Works with multiple arguments passed in array', function (t) {
		var ractive = new Ractive({
        	el: 'qunit-fixture',
        	template: '<p decorator="combined: { attr1: [\'{{attr1}}\',\'blue\'] , attr2: \'{{attr2}}\' }">',
	        decorators: {
	            combined: decorators.combine([
	                {
	                	attr1: decorators.create(function(v1,v2){
					        this.setAttribute('attr1',v1+v2)
					    })
	            	},
	            	{
		                attr2: decorators.create(function(value){
					        this.setAttribute('attr2',value)
					    })
					}
	            ])
	        },
	        data: {
	            attr1: 'foo',
	            attr2: 'bar'
	        }
    	})

		t.htmlEqual(fixture.innerHTML, '<p attr1="fooblue" attr2="bar"></p>')
		ractive.set('attr1', 'blah')
		t.htmlEqual(fixture.innerHTML, '<p attr1="blahblue" attr2="bar"></p>')
		ractive.set({ attr1: 'boop', attr2: 'beep' })
		t.htmlEqual(fixture.innerHTML, '<p attr1="boopblue" attr2="beep"></p>')
	})

}());
