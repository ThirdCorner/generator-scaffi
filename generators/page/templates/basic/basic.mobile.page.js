'use strict';

import {RouteConfig, AbstractPage} from 'scaffi-ui-core'; // jshint unused: false
import template from './<%= routeTemplateName %>.html';

import <%= routeClassName %> from './<%= routeTemplateName %>.js';

// export-params-start
const ROUTE = 'app.<%= routePath %>';
const PARAMS = {
	url: '<%= routeUrl %>',
	template: template,
	resolve: {

	},
	ncyBreadcrumb: {
		<% if(breadcrumb) { %> label: '<%= breadcrumb %>' <% } else { %> skip: true <% } %>
	}
};
// export-params-end

//start-non-standard
@RouteConfig(ROUTE, PARAMS)
//end-non-standard

class <%= routeClassName %>Mobile extends <%= routeClassName %> {
	constructor($state, $scope){
		super($state, $scope);
		
		this.$state = $state;
		this.$scope = $scope;
	}

}

export default <%= routeClassName %>Mobile;
export {ROUTE, PARAMS};