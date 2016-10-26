'use strict';

import template from './header.html!text';
import {View, Component, Inject} from 'scaffi-ui-core'; // jshint unused: false


//start-non-standard
@Component({
	selector: 'header'
})
@View({
	template: template
})
//end-non-standard
class Header {
	constructor($state, $location) {
		this.$state = $state;
		this.$location = $location;
	}
	goHome() {
		
		this.$location.path('/');
	}
}

export default Header;
