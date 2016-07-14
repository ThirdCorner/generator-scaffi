'use strict';

import {RouteConfig} from 'scaffi-ui-core';  // jshint unused: false

// export-params-start
const ROUTE = 'app.main';
const PARAMS = {
	url: '/main',
	template: "<ui-view></ui-view>",
	redirectTo: "app.main.index",
	ncyBreadcrumb: {
		label: "Main"
	}
};
// export-params-end

//start-non-standard
@RouteConfig(ROUTE, PARAMS)
//end-non-standard
class Main {}

export default Main;
export {ROUTE, PARAMS};