'use strict';

import {RouteConfig} from 'app/ng-decorators';  // jshint unused: false

// export-params-start
const ROUTE = 'app.yeoman';
const PARAMS = {
	url: '/yeoman',
	template: "<ui-view></ui-view>",
	redirectTo: "app.yeoman.index",
	ncyBreadcrumb: {
		label: "Yeoman"
	}
};
// export-params-end

//start-non-standard
@RouteConfig(ROUTE, PARAMS)
//end-non-standard
class Yeoman {}

export default Yeoman;
export {ROUTE, PARAMS};