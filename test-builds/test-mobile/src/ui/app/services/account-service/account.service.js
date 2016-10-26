'use strict';

import {AbstractService, Service} from 'scaffi-ui-core';

//start-non-standard
@Service({
	serviceName: 'AccountService'
})
//end-non-standard
class AccountService extends AbstractService {
	/*
	 Tacked on to what the base route for any api request is
	 */
	getApiRouteName(){
		return 'accounts';
	}
	/*
	 This lets me inject the service into the DataModel so that you can
	 CRUD a json object without directly going through a service. 
	 If you want to socket something to a subsequent DataCollection or DataModel, this is the namespace you send.
	 */
	getPropertyName(){
		return 'AccountService'
	}
}

export default AccountService;
