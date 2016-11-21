'use strict';

import {Factory} from 'scaffi-ui-core'; // jshint unused: false
import _ from 'lodash';

import <%= className %> from './<%= factoryName %>';

//start-non-standard
@Factory({
	factoryName: '<%= className %>'
})
//end-non-standard
class <%= className %>Web extends <%= className %> {
	constructor($rootScope) {
		super($rootScope);
		
	}
	

	static factory($rootScope) {
		<%= className %>Web.instance = new <%= className %>Web($rootScope);
		return <%= className %>Web.instance;
	}
	
	
}

export default <%= className %>Web;
