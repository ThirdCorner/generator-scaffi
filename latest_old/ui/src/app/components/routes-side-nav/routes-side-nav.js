'use strict';

import {RouteConfig, Component, View} from 'app/ng-decorators'; // jshint unused: false
import _ from 'lodash';

import template from './routes-side-nav.html!text';

//start-non-standard
@Component({
	selector: 'routes-side-nav',
})
@View({
	template: template,
	scope: {

	}

})
//end-non-standard


class RoutesSideNav {
	constructor($rootScope, $state){
		var routes = $rootScope.getRouteMap();
		if(_.isObject(routes) && _.has(routes, "app")) {
			this.routes = routes.app;
		} else {
			throw new Error("Can't load route map for routes-side-nav");
		}

		this.setActiveState($state.current.name, $state.params);

		var that = this;
		$rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams, options)=>{
			that.setActiveState(toState.name, toParams)
		})

	}
	setActiveState(route, params) {
		this.setDisplayable(route);

		var splits = route.split(".");
		splits.shift(); // Get rid of app. from the splits;

		this.parentActive = null;
		this.childActive = null;
		this.selectedRoute = route;

		if(_.endsWith(this.selectedRoute, ".index")) {
			this.selectedRoute = this.selectedRoute.substr(0, this.selectedRoute.indexOf(".index"));
		}

		if(splits.length >= 1) {
			this.parentActive = splits[0];
		}
		if(splits.length >=2 ){
			this.childActive = splits[1];
		}

	}
	setDisplayable(fullRoute){


		this.isDisplayable = false;
		var split = fullRoute.split(".");
		split.shift(); // Take off app from the root

		// Strip .index if there is one
		if(split[split.length-1] == "index") {
			split.pop();
		}

		var isNestedRoute = false;
		var foundObj = this.routes;

		_.each(split, function(name, index) {
			if(!_.isObject(foundObj)) {
				return;
			}

			if(index > 0) {
				isNestedRoute = true;
			}

			if(_.has(foundObj, "routes")) {
				foundObj = foundObj.routes;
			}

			foundObj = _.find(foundObj, (item) =>{
				return item.id == name;
			});
		}, this);

		if(_.isObject(foundObj)) {
			/*
				If it's the head item and it has children, otherwise no point showing the side nav
			 */
			if(!isNestedRoute && _.has(foundObj,"routes") && foundObj.routes.length > 0) {
				this.isDisplayable = true;
			}

			/*
				If it's a nested route, then obviously we want to show the side nav
			 */
			if(isNestedRoute) {
				this.isDisplayable = true;
			}
		}
	}
}

export default RoutesSideNav;

