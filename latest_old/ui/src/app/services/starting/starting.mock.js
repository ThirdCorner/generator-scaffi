'use strict';

import fixture from './starting.fixtures';
import MockHttp from 'app/core/classes/mock-http';
import {Run} from 'app/ng-decorators'; // jshint unused: false

class StartingServiceMock extends MockHttp {
	//start-non-standard
	@Run()
	//end-non-standard
	runFactory($httpBackend, StartingService){
		var route = StartingService.getRoute();

		super.init($httpBackend, route, fixture);
	}
}


export default StartingServiceMock;
