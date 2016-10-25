'use strict';

import {RouteConfig} from 'scaffi-ui-core';  // jshint unused: false

// export-params-start
const ROUTE = 'app.products.users';
const PARAMS = {
	url: '/users',
	template: "<ui-view></ui-view>",
	redirectTo: "app.products.users.index",
	ncyBreadcrumb: {
		label: "Users"
	}
};
// export-params-end

//start-non-standard
@RouteConfig(ROUTE, PARAMS)
//end-non-standard
class Users {}

export default Users;
export {ROUTE, PARAMS};