'use strict';

import {RouteConfig} from 'scaffi-ui-core';  // jshint unused: false

// export-params-start
const ROUTE = 'app.account';
const PARAMS = {
	url: '/account',
	template: "<ion-nav-view></ion-nav-view>",
	redirectTo: "app.account.index",
	ncyBreadcrumb: {
		label: "Account"
	}
};
// export-params-end

//start-non-standard
@RouteConfig(ROUTE, PARAMS)
//end-non-standard
class Account {}

export default Account;
export {ROUTE, PARAMS};