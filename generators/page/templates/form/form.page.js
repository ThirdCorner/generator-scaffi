'use strict';

import ScaffiCore from 'scaffi-ui-core';
import {RouteConfig} from 'scaffi-ui-core'; // jshint unused: false
import template from './<%= routeTemplateName %>.html!text';

import {ID_PROP} from 'app/globals';

//start-non-standard
// export-params-start
<% if(enableEdit) { %>
	const EDIT_ROUTE = 'app.<%= route %>.edit';
	const EDIT_PARAMS = {
		url: '/:<%= serviceName %>ID/edit',
		template: template,
		resolve: {
			formItem: (<%= serviceName %>, $stateParams) => {
	<%= serviceName %>.get($stateParams.<%= serviceName %>ID)
			,
			pageMode: ()=>{
			return "Edit";
		}
	},
	ncyBreadcrumb: {
		label: 'Edit'
	}
};
<% } %>
<% if(enableAdd) { %>
		const ADD_ROUTE = 'app.<%= route %>.add';
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
	<% } %>
<% if(enableEdit) { %>
	@RouteConfig(EDIT_ROUTE, EDIT_PARAMS)
	<% } %><% if(enableAdd) { %>
	@RouteConfig(ADD_ROUTE, ADD_PARAMS)<% } %>
// export-params-end
//end-non-standard

class <%= routeClassName %> {
		constructor($scope, $state, formItem, pageMode, <%= serviceName %>){
		var that = this;
		
		this.SERVICE = <%= serviceName %>;
		this.$state = $state;
		this.pageMode = pageMode;
		this.formItem = formItem;
		
	}
	
	submit(){
		this.SERVICE.submit(this.formItem).then(() => this.$state.go("app.<%= route %>"));
	}
	
}

export default <%= routeClassName %>;
<% if(enableEdit && enableAdd) { %>
	export {EDIT_ROUTE, EDIT_PARAMS, ADD_ROUTE, ADD_PARAMS};
	<% } else if(enableEdit) { %>
	export {EDIT_ROUTE, EDIT_PARAMS};
	<% } else if(enableAdd) { %>
	export {ADD_ROUTE, ADD_PARAMS};
	<% } %>