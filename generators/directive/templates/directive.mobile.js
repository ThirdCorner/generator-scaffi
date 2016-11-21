'use strict';

import {Directive} from 'scaffi-ui-core'; // jshint unused: false;

import <%= className %> from './<%= directiveName %>';
//start-non-standard
@Directive({
	selector: '<%= directiveName %>'
})
//end-non-standard
class <%= className %>Mobile extends <%= className %> {
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

			<%= className %>Mobile.instance = new <%= className %>Mobile($rootScope, $state);
			return <%= className %>Mobile.instance;
		}
}

export default <%= className %>Mobile;

