'use strict';

import ScaffiCore from 'scaffi-ui-core';
import {RouteConfig, AbstractPage} from 'scaffi-ui-core'; // jshint unused: false
import template from './main-form.html!text';

//start-non-standard
// export-params-start

	const EDIT_ROUTE = 'app.main.edit';
	const EDIT_PARAMS = {
		url: '/:TestFormServiceID/edit',
		template: template,
		resolve: {
			formItem: (TestFormService, $stateParams) => {
				return TestFormService.get($stateParams.TestFormServiceID)
			},
			pageMode: ()=>{
				return "Edit";
			}
	},
	ncyBreadcrumb: {
		label: 'Edit'
	}
};



	@RouteConfig(EDIT_ROUTE, EDIT_PARAMS)
	
// export-params-end
//end-non-standard

class MainForm extends AbstractPage {
	constructor($scope, $state, formItem, pageMode, TestFormService){
		super($scope);

		this.SERVICE = TestFormService;
		this.$state = $state;
		this.$scope = $scope;
		this.pageMode = pageMode;
		this.formItem = formItem;
		
	}
	
	submit(){
		this.SERVICE.save(this.formItem).then(() => this.$state.go("app.main"));
	}
	
}

export default MainForm;

export {EDIT_ROUTE, EDIT_PARAMS};
	