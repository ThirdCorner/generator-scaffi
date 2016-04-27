'use strict';

import {RouteConfig} from 'app/ng-decorators';  // jshint unused: false
import template from './layout.html!text';

//start-non-standard
@RouteConfig('app', {
    url: '',
    abstract: true,
    template: template,
	redirectTo: "app.starting.index"
})
//end-non-standard
class Layout {
	constructor($state){
		this.$state = $state;
	}
}

