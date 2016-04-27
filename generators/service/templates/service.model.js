'use strict';

import RestModel from 'app/core/classes/rest-model';

class <%= className %>Model extends RestModel {
	constructor(Service, data) {
		super(Service, "<%= className %>", data);
	}
}


export default <%= className %>Model;