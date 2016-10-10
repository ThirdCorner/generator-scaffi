require("babel-register")({
	presets: [ 'es2015' ]
});

var path = require('path');

var opts = {
	config: {},
	components: {
		"app": {
			"port": process.env.PORT
		}
	},
	services: {}
};


require('scaffi-server-core').initialize(opts);
