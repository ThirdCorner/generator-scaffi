require("babel-register")({
	presets: [ 'es2015' ]
});

var path = require('path');

require('scaffi-server-core').initialize({
	config: path.join(__dirname, 'scaffi-server.json' )
});

