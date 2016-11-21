'use strict';

import {RouteConfig, Component, View} from 'scaffi-ui-core'; // jshint unused: false
import <%= className %> from './<%= tagName %>.js';
import _ from 'lodash';

import template from './<%= tagName %>.html';

//start-non-standard
@Component({
	selector: '<%= tagName %>',
})
@View({
	template: template,
	scope: {
		
	}
	
})
//end-non-standard


class <%= className %>Web extends <%= className %>{
	constructor($scope){
		super($scope);
		
		
	}
}

export default <%= className %>Web;

