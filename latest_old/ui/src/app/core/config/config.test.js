'use strict';

import 'angular-mocks';
import angular from 'angular';
import {Config, Run} from 'app/ng-decorators'; // jshint unused: false

class OnConfigTest {
	//start-non-standard
	@Config()
	//end-non-standard
	static configFactory($provide){

		console.log("config test")

	}
}

class OnRunTest {
	//start-non-standard
	@Run()
	//end-non-standard
	static runFactory($rootScope){
		$rootScope.ENV = "test";

	}
}
