'use strict';

import fixture from './account-service.fixtures';
import {MockHttp, Run} from 'scaffi-ui-core';

class AccountServiceMock extends MockHttp {
	//start-non-standard
	@Run()
	//end-non-standard
	runFactory($httpBackend, AccountService){
		var route = AccountService.getApiRouteName();

		super.init($httpBackend, route, fixture);
	}
}


export default AccountServiceMock;
