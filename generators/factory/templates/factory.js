'use strict';

import {Factory} from 'scaffi-ui-core'; // jshint unused: false
import _ from 'lodash';
//start-non-standard
@Factory({
	factoryName: '<%= className %>'
})
//end-non-standard
class <%= className %>  {
	constructor($rootScope) {
	
		
	}
	

	static factory($rootScope) {
		<%= className %>.instance = new <%= className %>($rootScope);
		return <%= className %>.instance;
	}
	
	
}

export default <%= className %>;
