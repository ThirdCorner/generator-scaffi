'use strict';

import {RouteConfig, AbstractPage} from 'scaffi-ui-core'; // jshint unused: false
import template from './account-index.html!text';

// export-params-start
const ROUTE = 'app.account.index';
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

class AccountIndex extends AbstractPage {
	constructor($state, $scope, ProductsService){
		super($scope);
		
		this.$state = $state;
		this.$scope = $scope;
		
		ProductsService.list().then((data)=>{
			this.products = data;
		});
	}

}

export default AccountIndex;
export {ROUTE, PARAMS};