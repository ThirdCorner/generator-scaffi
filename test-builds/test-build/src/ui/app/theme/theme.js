'use strict';

import {AbstractBootstrap} from 'scaffi-ui-core';

import './footer/footer.js';
import './header/header.js';
import './layout/layout.js';
import './layout-error/layout-error.js';

import 'angular-bootstrap';
import 'angular-loading-bar';

class Theme extends AbstractBootstrap {
	initialize(){
		this.addRequires([
			'ui.bootstrap',
			'angular-loading-bar'
		]);
		this.getApp().config( (cfpLoadingBarProvider)=>{
			cfpLoadingBarProvider.includeBar = true;
			cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
			cfpLoadingBarProvider.includeSpinner = false;
		});
		
		this.addRequires([]);

		/*
		this.getApp().config( ()=>{

		});

		this.getApp().run( ()=>{

		});
		*/
	}
}

export default Theme;