'use strict';

import {Directive} from 'scaffi-ui-core'; // jshint unused: false;
//start-non-standard
@Directive({
	selector: 'test-me'
})
//end-non-standard
class TestMe {
	/*
		If you add constructor injectors, you need to add them to the directiveFactory portion as well
		Otherwise, you'll get an injection error
	 */
	constructor($rootScope, $state){
		this.restrict = 'A';
		this.scope = false;

		

	}

	link(scope, element, attrs, ngModel){

		console.log("DIRECIVE!")
	}

	static directiveFactory($rootScope, $state){

		TestMe.instance = new TestMe($rootScope, $state);
		return TestMe.instance;
	}
}

export default TestMe;

