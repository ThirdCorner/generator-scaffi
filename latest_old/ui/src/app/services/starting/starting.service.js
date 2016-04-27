'use strict';

import AbstractService from 'app/core/classes/abstract-service';
import {Service} from 'app/ng-decorators'; // jshint unused: false

//start-non-standard
@Service({
	serviceName: 'StartingService'
})
//end-non-standard
class StartingService extends AbstractService {
	constructor($http, $state, $rootScope) {
		super($http, 'WellToWell', $state, $rootScope);

	}


}

export default StartingService;
