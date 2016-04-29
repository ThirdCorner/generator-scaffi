'use strict';

import {Component, View, AbstractStubPage} from 'scaffi-ui-core'; // jshint unused: false
import _ from 'lodash';
import template from './<%= stubName %>.html!text';

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

class <%= className %> extends AbstractStubPage {
	constructor($scope, $state){
		super($scope);

		
	}

}

export default <%= className %>;
