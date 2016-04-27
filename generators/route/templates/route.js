'use strict';

import {RouteConfig} from 'scaffi-ui-core';  // jshint unused: false

// export-params-start
const ROUTE = 'app.<%= routePath %>';
const PARAMS = {
	url: '/<%= routeUrl %>',
	template: "<ui-view></ui-view>",
	redirectTo: "app.<%= routePath %>.index",
	ncyBreadcrumb: {
		label: "<%= breadcrumbLabel %>"
	}
};
// export-params-end

//start-non-standard
@RouteConfig(ROUTE, PARAMS)
//end-non-standard
class <%= routeClassName %> {}

export default <%= routeClassName %>;
export {ROUTE, PARAMS};