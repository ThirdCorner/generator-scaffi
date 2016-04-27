'use strict';

import {RouteConfig} from 'app/ng-decorators';  // jshint unused: false


const ROUTE = 'app.home';
const PARAMS = {
	url: '/home',
	template: "<ui-view></ui-view>",
	redirectTo: "app.home.index",
	ncyBreadcrumb: {
		skip: true
	}
};


//start-non-standard
@RouteConfig(ROUTE, PARAMS)
//end-non-standard
class Home {}

export default Home;
export {ROUTE, PARAMS};
