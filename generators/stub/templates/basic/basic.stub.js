'use strict';

import {Component, View} from 'app/ng-decorators'; // jshint unused: false
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

class <%= className %> {
	constructor($scope, $state){

	}

}

export default <%= className %>;


/* .GULP-IMPORTS-START */ /* .GULP-IMPORTS-END */
