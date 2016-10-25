var path = require('path');
import ScaffiServer from 'scaffi-server-core';
import _ from "lodash";

module.exports = function(app, router) {
	router.list('', (req, res, next)=>{
		res.sendSuccess('Hello Dance Time');
	});
	router.list('/api/user', (req, res) =>{
		res.sendSuccess({id: 2, Name: "JJ Brinks"});
	});
};