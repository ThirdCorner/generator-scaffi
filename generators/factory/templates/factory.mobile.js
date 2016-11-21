'use strict';

import {Factory} from 'scaffi-ui-core'; // jshint unused: false
import _ from 'lodash';

import <%= className %> from './<%= factoryName %>';

//start-non-standard
@Factory({
	factoryName: '<%= className %>'
})
//end-non-standard
class <%= className %>Mobile extends <%= className %> {
	constructor($rootScope) {
		super($rootScope);
		
	}
	

	static factory($rootScope) {
		<%= className %>Mobile.instance = new <%= className %>Mobile($rootScope);
		return <%= className %>Mobile.instance;
	}
	
	
}

export default <%= className %>Mobile;
