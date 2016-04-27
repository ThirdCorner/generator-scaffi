'use strict';

import {RouteConfig} from 'app/ng-decorators'; // jshint unused: false
import template from './starting-publishing.html!text';

// export-params-start
const ROUTE = 'app.starting.publishing';
const PARAMS = {
	url: '/publishing/:publishID',
	template: template,
	resolve: {

	},
	ncyBreadcrumb: {
		 label: 'Publishing' 
	}
};
// export-params-end

//start-non-standard
@RouteConfig(ROUTE, PARAMS)
//end-non-standard

class StartingPublishing {
	constructor($stateParams){
		this.user = {};

	}
	submit(){
		console.log("boeheohteoteotho.eh")
		alert("submitting");
	}
	submitForm(){
		console.log("controller")
	}
}

export default StartingPublishing;
export {ROUTE, PARAMS};