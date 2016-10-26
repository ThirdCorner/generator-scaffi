'use strict';

import {RouteConfig, Component, AbstractComponent, View} from 'scaffi-ui-core'; // jshint unused: false
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


class <%= className %> extends AbstractComponent{
	constructor($scope){
		super($scope);

		
	}
}

export default <%= className %>;

