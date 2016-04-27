'use strict';

import fixture from './home.fixtures';
import MockHttp from 'app/core/classes/mock-http';
import {Run} from 'app/ng-decorators'; // jshint unused: false

class HomeServiceMock extends MockHttp {
	//start-non-standard
	@Run()
	//end-non-standard
	runFactory($httpBackend, HomeService){
		var route = HomeService.getRoute();

		super.init($httpBackend, route, fixture);
	}
}


export default HomeServiceMock;
