'use strict';

import {RouteConfig} from 'scaffi-ui-core';  // jshint unused: false

// export-params-start
const ROUTE = 'app.products';
const PARAMS = {
	url: '/products',
	template: "<ui-view></ui-view>",
	redirectTo: "app.products.index",
	ncyBreadcrumb: {
		label: "Products"
	}
};
// export-params-end

//start-non-standard
@RouteConfig(ROUTE, PARAMS)
//end-non-standard
class Products {}

export default Products;
export {ROUTE, PARAMS};