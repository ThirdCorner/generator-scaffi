require("babel-register")({
	presets: [ 'es2015' ]
});

var path = require('path');

var opts = {
	config: {},
	components: {},
	services: {}
};

require('scaffi-server-core').initialize(opts);
