'use strict';

import ScaffiCore from 'scaffi-ui-core';
import {RouteConfig, AbstractPage} from 'scaffi-ui-core'; // jshint unused: false
import template from './account-form.html!text';

//start-non-standard
// export-params-start

	const EDIT_ROUTE = 'app.account.edit';
	const EDIT_PARAMS = {
		url: '/:AccountServiceID/edit',
		template: template,
		resolve: {
			formItem: (AccountService, $stateParams) => {
				return AccountService.get($stateParams.AccountServiceID)
			},
			pageMode: ()=>{
				return "Edit";
			}
	},
	ncyBreadcrumb: {
		label: 'Edit'
	}
};


		const ADD_ROUTE = 'app.account.add';
		const ADD_PARAMS = {
			url: '/add',
			template: template,
			resolve: {
				formItem: () => {
					return {};
				},
				pageMode: ()=>{
					return "Add";
				}
			},
			ncyBreadcrumb: {
				label: 'Add'
			}
		};
	

	@RouteConfig(EDIT_ROUTE, EDIT_PARAMS)
	
	@RouteConfig(ADD_ROUTE, ADD_PARAMS)
// export-params-end
//end-non-standard

class AccountForm extends AbstractPage {
	constructor($scope, $state, formItem, pageMode, AccountService){
		super($scope);

		this.SERVICE = AccountService;
		this.$state = $state;
		this.$scope = $scope;
		this.pageMode = pageMode;
		this.formItem = formItem;
		
	}
	
	submit(){
		this.SERVICE.save(this.formItem).then(() => {
			this.$state.go("app.account", {});
		});
	}
	
}

export default AccountForm;

export {EDIT_ROUTE, EDIT_PARAMS, ADD_ROUTE, ADD_PARAMS};
	