'use strict';

import {RouteConfig} from 'app/ng-decorators'; // jshint unused: false
import template from './starting-installation.html!text';

const ROUTE = 'app.starting.installation';
const PARAMS = {
	url: '/installation',
	template: template,
	resolve: {

	},
	ncyBreadcrumb: {
		label: "Installation"
	}

};

//start-non-standard
@RouteConfig(ROUTE, PARAMS)
//end-non-standard


class StartingInstallation {
	constructor(HomeService){
		//HomeService.get();

	}

}

export default StartingInstallation;
export {ROUTE, PARAMS};