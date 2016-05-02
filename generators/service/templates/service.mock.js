'use strict';

import fixture from './<%= serviceFileName %>.fixtures';
import {MockHttp, Run} from 'scaffi-ui-core';

class <%= className %>ServiceMock extends MockHttp {
	//start-non-standard
	@Run()
	//end-non-standard
	runFactory($httpBackend, <%= className %>Service){
		var route = <%= className %>Service.getApiRouteName();

		super.init($httpBackend, route, fixture);
	}
}


export default <%= className %>ServiceMock;
