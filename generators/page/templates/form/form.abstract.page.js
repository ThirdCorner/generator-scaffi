'use strict';

import ScaffiCore from 'scaffi-ui-core';
import {RouteConfig, AbstractPage} from 'scaffi-ui-core'; // jshint unused: false

class <%= routeClassName %> extends AbstractPage {
	constructor($scope, $state, formItem, pageMode, <%= serviceName %>){
		super($scope);

		this.SERVICE = <%= serviceName %>;
		this.$state = $state;
		this.$scope = $scope;
		this.pageMode = pageMode;
		this.formItem = formItem;
		
	}
	
	submit(){
		this.SERVICE.save(this.formItem).then(() => {
			this.$state.go("app.<%= routePath %>", {});
		});
	}
	
}

export default <%= routeClassName %>;
