'use strict';

import {RouteConfig} from 'app/ng-decorators'; // jshint unused: false
import template from './starting-form.html!text';

import {ID_PROP} from 'app/globals';

//start-non-standard
// export-params-start

const EDIT_ROUTE = 'app.starting.edit';
const EDIT_PARAMS = {
	url: '/:StartingServiceID/edit',
	template: template,
	resolve: {
		formItem: (StartingService, $stateParams) => StartingService.get($stateParams.StartingServiceID),
		pageMode: ()=>{
			return "Edit";
		}
	},
	ncyBreadcrumb: {
		label: 'Edit'
	}
};


const ADD_ROUTE = 'app.starting.add';
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

class StartingForm {
	constructor($scope, $state, formItem, pageMode, StartingService){
		var that = this;

		this.SERVICE = StartingService;
		this.$state = $state;
		this.pageMode = pageMode;
		this.formItem = formItem;

	}

	submit(){
		this.SERVICE.submit(this.formItem).then(() => this.$state.go("app.starting"));
	}

}

export default StartingForm;

export {EDIT_ROUTE, EDIT_PARAMS, ADD_ROUTE, ADD_PARAMS};
