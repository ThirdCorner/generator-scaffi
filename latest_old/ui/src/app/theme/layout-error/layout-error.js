'use strict';

import templateError from './500.html!text';
import templateNotFound from './404.html!text';
import templateUnauthorized from './403.html!text';
import {RouteConfig} from '../../ng-decorators'; // jshint unused: false

//start-non-standard
@RouteConfig('403', {
    url: '/403',
    template: templateUnauthorized
})
@RouteConfig('404', {
    url: '/404',
    template: templateNotFound
})
@RouteConfig('500', {
    url: '/500',
    template: templateError
})
//end-non-standard
class Error {}
