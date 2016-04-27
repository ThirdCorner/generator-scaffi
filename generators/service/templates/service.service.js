'use strict';

import AbstractService from 'app/core/classes/abstract-service';
import {Service} from 'app/ng-decorators';
import <%= className %>Model from './<%= serviceName %>.model'; // jshint unused: false

//start-non-standard
@Service({
	serviceName: '<%= className %>Service'
})
//end-non-standard
class <%= className %>Service extends AbstractService {
	constructor($http, $state, $rootScope, $injector) {
		super($http, '<%= restRoute %>', $state, $rootScope, $injector);
		this.setModel(<%= className %>Model);
		this.namespace = '<%= className %>';
	}


}

export default <%= className %>Service;
