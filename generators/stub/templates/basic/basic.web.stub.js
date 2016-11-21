'use strict';

import {Component, View, AbstractStubPage} from 'scaffi-ui-core'; // jshint unused: false
import _ from 'lodash';
import template from './<%= stubName %>.html';

import <%= className %> from './<%= stubName %>';

//start-non-standard
@Component({
	selector: '<%= stubName %>',
})
@View({
	template: template,
	scope: {
	}
})
//end-non-standard

class <%= className %>Web extends <%= className %> {
	constructor($scope, $state){
		super($scope);

		
	}

}

export default <%= className %>Web;
