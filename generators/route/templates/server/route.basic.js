
import {AbstractRoute, app} from 'scaffi-server-core';
import ScaffiServer from 'scaffi-server-core';

import _ from "lodash";

class <%= className %> extends AbstractRoute {
	setup(){
		
		app.get().get("/api/test/:id", (req, res)=>{
			// Logic
		});
		
		
		
		
	}
}

export default new <%= className %>();
