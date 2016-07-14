'use strict';

import ScaffiServer from 'scaffi-server-core';

class GetTestService extends ScaffiServer.Extends.AbstractService{
	initialize(router) {
		
	}
	getMe(){
		return [
			{id: 3, Name: "Martha"}
		]
	}
}
var Service = new  GetTestService();
export default Service;