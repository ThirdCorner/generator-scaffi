'use strict';

import {Directive} from 'scaffi-ui-core'; // jshint unused: false;

class <%= className %> {
		/*
		 If you add constructor injectors, you need to add them to the directiveFactory portion as well
		 Otherwise, you'll get an injection error
		 */
		constructor($rootScope, $state){
			this.restrict = 'A';
			this.scope = false;
			
			
		}
		
		link(scope, element, attrs, ngModel){
			
			
		}
		
}

export default <%= className %>;

