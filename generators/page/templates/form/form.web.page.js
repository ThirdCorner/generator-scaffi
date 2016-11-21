'use strict';

import ScaffiCore from 'scaffi-ui-core';
import {RouteConfig, AbstractPage} from 'scaffi-ui-core'; // jshint unused: false
import template from './<%= routeTemplateName %>.html';

import <%= routeClassName %> from './<%= routeTemplateName %>.js';

//start-non-standard
// export-params-start
<% if(enableEdit) { %>
	const EDIT_ROUTE = 'app.<%= routePath %>.edit';
	const EDIT_PARAMS = {
		url: '/:<%= serviceName %>ID/edit',
		template: template,
		resolve: {
			formItem: (<%= serviceName %>, $stateParams) => {
				return <%= serviceName %>.get($stateParams.<%= serviceName %>ID)
			},
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
		const ADD_ROUTE = 'app.<%= routePath %>.add';
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

class <%= routeClassName %>Web extends  <%= routeClassName %>{
	constructor($scope, $state, formItem, pageMode, <%= serviceName %>){
		super($scope, $state, formItem, pageMode, <%= serviceName %>);
		
	}

	
}

export default <%= routeClassName %>Web;
<% if(enableEdit && enableAdd) { %>
export {EDIT_ROUTE, EDIT_PARAMS, ADD_ROUTE, ADD_PARAMS};
	<% } else if(enableEdit) { %>
export {EDIT_ROUTE, EDIT_PARAMS};
	<% } else if(enableAdd) { %>
export {ADD_ROUTE, ADD_PARAMS};
	<% } %>