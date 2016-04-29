'use strict';

import {Directive} from 'scaffi-ui-core'; // jshint unused: false;
//start-non-standard
@Directive({
	selector: '<%= directiveName %>'
})
//end-non-standard
class <%= className %> {
	/*
		If you add constructor injectors, you need to add them to the directiveFactory portion as well
		Otherwise, you'll get an injection error
	 */
	constructor($rootScope, $state){
		this.restrict = 'A';
		this.scope = {
		};


	}

	link(scope, element, attrs, ngModel){


	}

	static directiveFactory($rootScope, $state){

		<%= className %>.instance = new <%= className %>($rootScope, $state);
		return <%= className %>.instance;
	}
}

export default <%= className %>;

