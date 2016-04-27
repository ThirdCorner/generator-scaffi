'use strict';

import {RouteConfig} from 'app/ng-decorators';  // jshint unused: false



const ROUTE = 'app.starting';
const PARAMS = {
	url: '/starting',
	template: "<ui-view></ui-view>",
	redirectTo: "app.starting.index",
	ncyBreadcrumb: {
		label: "Getting Started"
	}
};

//start-non-standard
@RouteConfig(ROUTE, PARAMS)
//end-non-standard
class Starting {}

export default Starting;
export {ROUTE, PARAMS};