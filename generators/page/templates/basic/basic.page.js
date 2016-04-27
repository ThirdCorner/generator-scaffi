'use strict';

import {RouteConfig} from 'app/ng-decorators'; // jshint unused: false
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

class <%= routeClassName %> {
	constructor(){

	}

}

export default <%= routeClassName %>;
export {ROUTE, PARAMS};