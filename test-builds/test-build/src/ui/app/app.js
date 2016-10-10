'use strict';

// js vendor files
import ScaffiConfig from '../scaffi-ui.json!json';
import ScaffiConfigPrivate from '../scaffi-ui.private.json!json';
import ScaffiUi from 'scaffi-ui-core';
import _ from 'lodash';

import theme from './theme/theme';

var mainModule = ScaffiUi.initialize({
	config: ScaffiConfig,
	private: ScaffiConfigPrivate,
	theme: theme
});


// js app files


import './directives/directives';
import './components/components';
import './routes/routes';
import './services/mock-services';
import './services/services';
import './factories/factories';



/*
 Add any angular modules here if you don't want to add them to the theme file.
 */
var requires = [];

mainModule.requires = mainModule.requires.concat(requires);

/*
 If you need to config something in angular
 */

/*
 mainModule.config( ()=>{
 
 });
 */

/*
 If you need to run something in angular
 */

/*
 mainModule.run((ngTableDefaults) =>{
 
 });
 */