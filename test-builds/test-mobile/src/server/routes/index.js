var path = require('path');
import ScaffiServer from 'scaffi-server-core';
import _ from "lodash";

module.exports = function(app, router) {
	router.list('', (req, res, next)=>{
		res.sendSuccess('Hello Dance Time');
	});

	router.list('/api/products', (req, res, next)=>{
		res.sendSuccess([{name: "Kim", age: 23}, {name: "Ben", age: 33}]);
	});
};