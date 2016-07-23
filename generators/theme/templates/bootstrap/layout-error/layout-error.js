'use strict';

import templateError from './error.html!text';
import {RouteConfig} from 'scaffi-ui-core'; // jshint unused: false
import _ from 'lodash';

//start-non-standard
@RouteConfig('error', {
    url: '/error',
    template: templateError,
    params: {
        errorType: "error",
        statusCode: 500,
        stack: null,
        message: "Unknown Error"
    }
})
//end-non-standard
class Error {
    constructor($state){
        this.params = $state.params;
        this.params.errorType = _.startCase(this.params.errorType);
        if(this.params.stack) {
            this.params.stack = JSON.stringify(this.params.stack, null, '\t');
        }
    }

}
