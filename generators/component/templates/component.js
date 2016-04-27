'use strict';

import {RouteConfig, Component, View} from 'app/ng-decorators'; // jshint unused: false
import _ from 'lodash';

import template from './<%= tagName %>.html!text';

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


class <%= className %> {
	constructor($scope){

	}
}

export default <%= className %>;

