'use strict';

import 'angular-mocks';
import angular from 'angular';
import {Config, Run, Inject} from 'app/ng-decorators'; // jshint unused: false

class OnConfigDev {
    //start-non-standard
    @Config()
    //end-non-standard
    static configFactory($provide){

        console.log("config dev")

    }
}

class OnRunDev {
    //start-non-standard
    @Run()
    //end-non-standard
    static runFactory($rootScope){
	    $rootScope.ENV = "dev";
    }
}
