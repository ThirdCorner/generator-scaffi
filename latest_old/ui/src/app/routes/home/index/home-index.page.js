'use strict';

import {RouteConfig} from 'app/ng-decorators'; // jshint unused: false
import template from './home-index.html!text';


const ROUTE = 'app.home.index';
const PARAMS = {
	url: '/',
	template: template,
	resolve: {

	},
	ncyBreadcrumb: {
		skip: true
	}
};


//start-non-standard
@RouteConfig(ROUTE, PARAMS)
//end-non-standard
class HomeIndex {
	constructor(HomeService){
		this.user = null;
		//HomeService.resource(1).then( user=> {
		//	this.user = user;
		//});
	}

}

export default HomeIndex;
export {ROUTE, PARAMS};