'use strict';

// js vendor files
import ScaffiConfig from '../../scaffi-ui.json!json';
import ScaffiUi from 'scaffi-ui-core';
var mainModule = ScaffiUi.initialize({
	config: ScaffiConfig,
	ENV: "prototype"
});


import 'angular-material';
// js app files

import './theme/theme';
import './directives/directives';
import './components/components';
import './routes/routes';
import './services/mock-services';
import './services/services';
import './factories/factories';

var requires = [
	'ngMaterial'
];

mainModule.requires = mainModule.requires.concat(requires);

/*
	Angular Material Theming
 */
mainModule.config( ($mdThemingProvider) =>{
	$mdThemingProvider.theme('default')
		.primaryPalette('blue')
		.accentPalette('orange');

	$mdThemingProvider.theme("success-toast");
	$mdThemingProvider.theme("error-toast");
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

