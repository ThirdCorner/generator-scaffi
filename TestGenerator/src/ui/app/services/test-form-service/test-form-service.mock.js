'use strict';

import fixture from './test-form-service.fixtures';
import {MockHttp, Run} from 'scaffi-ui-core';

class TestFormServiceMock extends MockHttp {
	//start-non-standard
	@Run()
	//end-non-standard
	runFactory($httpBackend, TestFormService){
		var route = TestFormService.getApiRouteName();

		super.init($httpBackend, route, fixture);
	}
}


export default TestFormServiceMock;
