'use strict';

// js vendor files
import angular from 'angular';
import 'angular-aria';
import 'angular-animate';
import 'angular-material';
import 'angular-sanitize';
import 'angular-messages';
import 'angular-ui-router';
import 'angular-loading-bar';
import 'ng-table';
import 'lodash';
import 'moment';
import 'angular-breadcrumb';

// css vendor files
import 'font-awesome/css/font-awesome.css!';
import 'angular-material/angular-material.css!';

import mainModule from './ng-decorators';

// js app files
import './core/core';
import './theme/theme';
import './directives/directives';
import './components/components';
import './routes/routes';
import './services/services';

import {HOMEPAGE} from './globals';

var requires = [
    // angular modules
    'ngAnimate',
    'ngMessages',
    'ngSanitize',

    // 3rd party modules
    'ui.router',
    'ngTable',
    'angular-loading-bar',
	'ngMaterial',
	'ncy-angular-breadcrumb'
];


angular.element(document).ready(function() {
    angular.bootstrap(document, [mainModule.name], {
        //strictDi: true
    });
});

mainModule.requires = mainModule.requires.concat(requires);
mainModule.config( ($urlRouterProvider) => {
    // the `when` method says if the url is `/home` redirect to `/schedule` what is basically our `home` for this application
    $urlRouterProvider.when('/', HOMEPAGE);
});
/*
	Angular Material Theming
 */
mainModule.config( ($mdThemingProvider) =>{
	$mdThemingProvider.theme('default')
		.primaryPalette('blue')
		.accentPalette('orange');
});
mainModule.run((ngTableDefaults) =>{
    ngTableDefaults.params.count = 10;

    //Uncomment if you don't want tables to have a changable count
    // IE 10, 25, 50, 100
    ngTableDefaults.settings.counts = [10, 25, 50];

});

/*
	Breadcrumb Configs
 */
mainModule.config($breadcrumbProvider =>{
	$breadcrumbProvider.setOptions({
		template: 'bootstrap3'
	});
});

