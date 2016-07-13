'use strict';

import fixture from './<%= serviceFileName %>.fixtures';
import {MockHttp, Run} from 'scaffi-ui-core';

class <%= className %>Mock extends MockHttp {
	//start-non-standard
	@Run()
	//end-non-standard
	runFactory($httpBackend, <%= className %>){
		var route = <%= className %>.getApiRouteName();

		super.init($httpBackend, route, fixture);
	}
}


export default <%= className %>Mock;
