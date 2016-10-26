'use strict';

import {AbstractMaterial} from 'scaffi-ui-core';

import ScaffiUi from 'scaffi-ui-core';

import './footer/footer.js';
import './header/header.js';
import './layout/layout.js';
import './layout-error/layout-error.js';

import 'angular-material';
import 'angular-loading-bar';

import 'ionic-angular/release/js/ionic.js';
import 'ionic-angular/release/js/ionic-angular.js';


class Theme extends AbstractMaterial {
	initialize(){
		this.addRequires([
			'ngMaterial',
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
		
		if(ScaffiUi.config.isMobilePlatform()){
			
			this.addRequires(['ionic']);
			
			this.getApp().config(($ionicConfigProvider)=>{
				$ionicConfigProvider.views.maxCache(0);
				$ionicConfigProvider.tabs.position("bottom");
			});
			this.getApp().run(($ionicPlatform) =>{
				$ionicPlatform.ready(function() {
					// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
					// for form inputs)
					if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
						cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
						cordova.plugins.Keyboard.disableScroll(true);
						
					}
					if (window.StatusBar) {
						// org.apache.cordova.statusbar required
						StatusBar.styleDefault();
					}
				});
			});
			
			this.getApp().config( ($urlRouterProvider)=>{
				$urlRouterProvider.otherwise('/');
			});
			this.getApp().run( ($timeout, $state)=>{
				
				// $timeout(function() {
				// 	$state.go('app.index');
				// }, 0);
			});
			
		}
	}
}

export default Theme;