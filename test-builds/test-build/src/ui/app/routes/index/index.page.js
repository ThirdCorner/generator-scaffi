'use strict';

import {RouteConfig, AbstractPage} from 'scaffi-ui-core'; // jshint unused: false
import template from './index.html';

// export-params-start
const ROUTE = 'app.index';
const PARAMS = {
	url: '/',
	template: template,
	resolve: {
		user: (UserService) => UserService.get()
	},
	ncyBreadcrumb: {
		 skip: true 
	}
};
// export-params-end

//start-non-standard
@RouteConfig(ROUTE, PARAMS)
//end-non-standard

class Index extends AbstractPage {
	constructor($state, $scope, user){
		super($scope);
		console.log("Mine")
		this.user = user;
		this.$state = $state;
		this.$scope = $scope;
	}

}

export default Index;
export {ROUTE, PARAMS};