'use strict';

import {Config, Inject} from 'app/ng-decorators'; // jshint unused: false

class OnConfigProd {
    //start-non-standard
    @Config()
    @Inject('$compileProvider', '$httpProvider', '$rootScope')
    //end-non-standard
    static configFactory($compileProvider, $httpProvider, $rootScope){
	    $rootScope.ENV = "prod";
        // disabling debug data to get better performance gain in production
        $compileProvider.debugInfoEnabled(false);
        // configure $http service to combine processing of multiple http responses received at
        // around the same time via $rootScope.$applyAsync to get better performance gain in production
        $httpProvider.useApplyAsync(true);
    }
}

export {OnConfigProd};
