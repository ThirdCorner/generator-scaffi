'use strict';

import {AbstractMaterial} from 'scaffi-ui-core';

import './footer/footer.js';
import './header/header.js';
import './layout/layout.js';
import './layout-error/layout-error.js';

import 'angular-material';
import 'angular-material-data-table';
import 'angular-loading-bar';

class Theme extends AbstractMaterial {
	initialize(){
		this.addRequires([
			'ngMaterial',
			'md.data.table',
			'angular-loading-bar'
		]);
		this.getApp().config( (cfpLoadingBarProvider)=>{
			cfpLoadingBarProvider.includeBar = true;
			cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
			cfpLoadingBarProvider.includeSpinner = false;
		});
		
		this.getApp().config( ($mdIconProvider)=>{
			$mdIconProvider.defaultFontSet("fontawesome");
		});
		
		this.getApp().config( ($mdThemingProvider) =>{
			var defaultPal = $mdThemingProvider.extendPalette('blue', {
				'400': 'B8BCA7',
				'500': 'B8BCA7',
				'600': '545D32',
				'700': '6C744A',
				'800': '6C744A'
			});
			
			$mdThemingProvider.definePalette('blue', defaultPal);
			
			$mdThemingProvider.theme('default')
				.primaryPalette('blue')
				.accentPalette('orange');
		});
	}
}

export default Theme;