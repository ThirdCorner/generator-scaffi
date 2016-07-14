'use strict';

import {RouteConfig, Component, AbstractComponent, View} from 'scaffi-ui-core'; // jshint unused: false
import _ from 'lodash';

import template from './test.html!text';

//start-non-standard
@Component({
	selector: 'test',
})
@View({
	template: template,
	scope: {

	}

})
//end-non-standard


class Test extends AbstractComponent{
	constructor($scope){
		super($scope);

		
	}
}

export default Test;

