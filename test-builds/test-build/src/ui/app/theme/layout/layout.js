'use strict';

import {RouteConfig} from 'scaffi-ui-core';  // jshint unused: false
import template from './layout.html';
import templateMobile from './layout.mobile.html';

//start-non-standard
@RouteConfig('app', {
    url: '',
    abstract: true,
    template: template,
	mobileTemplate: templateMobile,
	redirectTo: "app.index",
	resolve: {
	}
})
//end-non-standard
class Layout {
	constructor($state){
		this.$state = $state;
	}
	
}

