'use strict';

// js vendor files
import ScaffiConfig from '../scaffi-ui.json!json';
import ScaffiConfigPrivate from '../scaffi-ui.private.json!json';
import ScaffiUi from 'scaffi-ui-core';
import {ErrorLogging} from 'scaffi-ui-core';
import _ from 'lodash';

var mainModule = ScaffiUi.initialize({
	config: ScaffiConfig,
	private: ScaffiConfigPrivate
});

import 'angular-material';
// js app files


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
/*
	Allow MD to reference font awesome icons via md-icon
    <md-icon class="fa fa-user md-avatar"></md-icon>
 */
mainModule.config( ($mdIconProvider)=>{
	$mdIconProvider.defaultFontSet("fontawesome");
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

