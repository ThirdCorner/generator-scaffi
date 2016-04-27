'use strict';

import fixture from './<%= serviceFileName %>.fixtures';
import MockHttp from 'app/core/classes/mock-http';
import {Run} from 'app/ng-decorators'; // jshint unused: false

class <%= className %>ServiceMock extends MockHttp {
	//start-non-standard
	@Run()
	//end-non-standard
	runFactory($httpBackend, <%= className %>Service){
		var route = <%= className %>Service.getRoute();

		super.init($httpBackend, route, fixture);
	}
}


export default <%= className %>ServiceMock;
