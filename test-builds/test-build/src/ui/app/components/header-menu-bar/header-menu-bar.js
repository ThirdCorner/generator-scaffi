'use strict';

import {RouteConfig, Component, View} from 'scaffi-ui-core'; // jshint unused: false
import _ from 'lodash';

import template from './header-menu-bar.html!text';

//start-non-standard
@Component({
	selector: 'header-menu-bar',
})
@View({
	template: template,
	scope: {

	}

})
//end-non-standard


class HeaderMenuBar {
	constructor($rootScope, $state){
	
		this.routes = [];
		this.setActiveState($state.current.name);

		var that = this;
		$rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams, options)=>{
			that.setActiveState(toState.name)
		})

	}
	setActiveState(route) {
		var splits = route.split(".");
		splits.shift(); // Get rid of app. from the splits;

		this.parentActive = null;
		this.childActive = null;

		if(splits.length >= 1) {
			this.parentActive = splits[0];
		}
		if(splits.length >=2 ){
			this.childActive = splits[1];
		}

	}
}

export default HeaderMenuBar;

