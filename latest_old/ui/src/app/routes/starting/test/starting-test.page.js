'use strict';

import {RouteConfig} from 'app/ng-decorators'; // jshint unused: false
import template from './starting-test.html!text';

// export-params-start
const ROUTE = 'app.starting.test';
const PARAMS = {
	url: '/test',
	template: template,
	resolve: {

	},
	ncyBreadcrumb: {
		 label: 'Test' 
	}
};
// export-params-end

//start-non-standard
@RouteConfig(ROUTE, PARAMS)
//end-non-standard

class StartingTest {
	constructor(){

	}

}

export default StartingTest;
export {ROUTE, PARAMS};