'use strict';

import ScaffiServer from 'scaffi-server-core';
import _ from 'lodash';

import GetTestService from '../../services/get-test-service/get-test-service';


class TestComp extends ScaffiServer.Extends.AbstractComponent {
	setup(app, router) {
		router.list("/api/test-form", (req, res, next)=>{
			res.sendSuccess(GetTestService.getMe());
		});
	}
	run(){
		
	}
	
}

export default TestComp;
