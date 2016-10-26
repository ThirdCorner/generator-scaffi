'use strict';

import {View, Component, Inject} from 'scaffi-ui-core'; // jshint unused: false
import template from './header.html';


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
