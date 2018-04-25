require("babel-register")({
	presets: [ 'es2015' ]
});

var ScaffiServer = require("scaffi-server-core");

var ScaffiConfig = require("./scaffi-server.json");
var ScaffiPrivate = require("./scaffi-server.private.json");

require("./components");
require("./models");
require("./routes");
require("./services");

try {

  ScaffiServer.initialize({
    config: ScaffiConfig,
    private: ScaffiPrivate,
    override: {
      params: {
        "app": {
          "version": "0.0.0",
          "port": process.env.PORT
        }
      }
    }
  });

} catch(e){
  console.log('server process exception.', e);
  throw e;
}
