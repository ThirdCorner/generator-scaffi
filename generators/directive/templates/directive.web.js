'use strict';

import {Directive} from 'scaffi-ui-core'; // jshint unused: false;

import <%= className %> from './<%= directiveName %>';
//start-non-standard
@Directive({
	selector: '<%= directiveName %>'
})
//end-non-standard
class <%= className %>Web extends <%= className %> {
		/*
		 If you add constructor injectors, you need to add them to the directiveFactory portion as well
		 Otherwise, you'll get an injection error
		 */
		constructor($rootScope, $state){
			
			super($rootScope, $state);
						
			
		}
		
		link(scope, element, attrs, ngModel){
			
			
		}
		
		static directiveFactory($rootScope, $state){

			<%= className %>Web.instance = new <%= className %>Web($rootScope, $state);
			return <%= className %>Web.instance;
		}
}

export default <%= className %>Web;

