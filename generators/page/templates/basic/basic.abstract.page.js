'use strict';

import {AbstractPage} from 'scaffi-ui-core'; // jshint unused: false

class <%= routeClassName %> extends AbstractPage {
	constructor($state, $scope){
		super($scope);
		
		this.$state = $state;
		this.$scope = $scope;
	}

}

export default <%= routeClassName %>;
