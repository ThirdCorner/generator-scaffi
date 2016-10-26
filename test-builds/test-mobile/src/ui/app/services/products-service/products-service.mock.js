'use strict';

import fixture from './products-service.fixtures';
import {MockHttp, Run} from 'scaffi-ui-core';

class ProductsServiceMock extends MockHttp {
	//start-non-standard
	@Run()
	//end-non-standard
	runFactory($httpBackend, ProductsService){
		var route = ProductsService.getApiRouteName();

		super.init($httpBackend, route, fixture);
	}
}


export default ProductsServiceMock;
