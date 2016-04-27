'use strict';

/**
 * Stubbing of HTTP requests for backend-less frontend testing
 */
import 'angular-mocks';
import angular from 'angular';
import 'app/services/mock-services';
import {Config, Run, Inject} from 'app/ng-decorators'; // jshint unused: false

class OnConfigPrototype {
    //start-non-standard
    @Config()
    //end-non-standard
    static configFactory($provide){

        $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);

    }
}

class OnRunPrototype {
    //start-non-standard
    @Run()
    //end-non-standard
    static runFactory($httpBackend, $rootScope){
	    $rootScope.ENV = "prototype";

        $httpBackend.whenGET(/^\/api\/.*/).respond( (method, url, data, headers) => {
            console.log("==========================");
            console.log("   MOCK API FALLTHROUGH   ");
            headers['Content-Type'] = 'application/json;version=1';
            console.log(url)
            throw new Error("No API Service call for " + url + " declared!");
            return [404];

        });
        $httpBackend.whenGET(/^\w+.*/).passThrough();
        $httpBackend.whenPOST(/^\w+.*/).passThrough();

    }
}
