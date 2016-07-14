var path = require('path');
import ScaffiServer from 'scaffi-server-core';
import _ from "lodash";

module.exports = function(app, router) {
	router.list('', (req, res, next)=>{
		res.sendSuccess('Hello Dance Time');
	})
};