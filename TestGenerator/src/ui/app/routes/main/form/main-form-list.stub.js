'use strict';

import {Component, View, AbstractStubPage} from 'scaffi-ui-core'; // jshint unused: false
import _ from 'lodash';
import template from './main-form-list.html!text';

//start-non-standard
@Component({
	selector: 'main-form-list',
})
@View({
	template: template,
	scope: {
	}
})
//end-non-standard

class MainFormList extends AbstractStubPage {
	constructor($scope, $state){
		super($scope);

		
	}

}

export default MainFormList;
