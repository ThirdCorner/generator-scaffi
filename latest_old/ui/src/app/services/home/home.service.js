'use strict';

import AbstractService from 'app/core/classes/abstract-service';
import {Service} from 'app/ng-decorators'; // jshint unused: false

//start-non-standard
@Service({
	serviceName: 'HomeService'
})
//end-non-standard
class HomeService extends AbstractService {
	constructor($http, $state, $rootScope) {
		super($http, 'home', $state, $rootScope);

	}


}

export default HomeService;
