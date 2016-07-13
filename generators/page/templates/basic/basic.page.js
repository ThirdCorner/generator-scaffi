'use strict';

import {RouteConfig, AbstractPage} from 'scaffi-ui-core'; // jshint unused: false
import template from './<%= routeTemplateName %>.html!text';

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

class <%= routeClassName %> extends AbstractPage {
	constructor($state, $scope){
		super($scope);
		
		this.$state = $state;
		this.$scope = $scope;
	}

}

export default <%= routeClassName %>;
export {ROUTE, PARAMS};