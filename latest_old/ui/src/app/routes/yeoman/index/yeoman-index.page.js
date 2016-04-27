'use strict';

import {RouteConfig} from 'app/ng-decorators'; // jshint unused: false
import template from './yeoman-index.html!text';

// export-params-start
const ROUTE = 'app.yeoman.index';
const PARAMS = {
	url: '/',
	template: template,
	resolve: {

	},
	ncyBreadcrumb: {
		 skip: true 
	}
};
// export-params-end

//start-non-standard
@RouteConfig(ROUTE, PARAMS)
//end-non-standard

class YeomanIndex {
	constructor(){

	}

}

export default YeomanIndex;
export {ROUTE, PARAMS};