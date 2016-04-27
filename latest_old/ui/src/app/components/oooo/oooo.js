'use strict';

import {RouteConfig, Component, View} from 'app/ng-decorators'; // jshint unused: false
import _ from 'lodash';

import template from './oooo.html!text';

//start-non-standard
@Component({
	selector: 'oooo',
})
@View({
	template: template,
	scope: {

	}

})
//end-non-standard


class Oooo {
	constructor($scope){

	}
}

export default Oooo;

