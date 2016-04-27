'use strict';

import {RouteConfig} from 'app/ng-decorators'; // jshint unused: false
import template from './starting-index.html!text';

const ROUTE = 'app.starting.index';
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


class StartingIndex {
	constructor(StartingService){
		this.starts = [];
		StartingService.getList().then(  data => {
			this.starts = data.results;
		})
	}

}

export default StartingIndex;
export {ROUTE, PARAMS};
