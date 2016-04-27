'use strict';

var _ = require("lodash");
var fs = require('fs-extra');
var path = require('path');

module.exports = {
	makeDisplayNameWithSpace: function(name) {
		var names = name.indexOf(".") !== -1 ? name.split(".") : [name];
		var returnName = '';
		_.each(names, function(name) {
			var splitName = name.indexOf("-") !== -1 ? name.split("-") : [name];
			_.each(splitName, function(namePiece){
				returnName += namePiece[0].toUpperCase() + namePiece.slice(1) + " ";
			});
		});

		return returnName.trim();
	},
	makeDisplayName: function(name) {
		var names = name.indexOf(".") !== -1 ? name.split(".") : [name];
		var returnName = '';
		_.each(names, function(name) {
			var splitName = name.indexOf("-") !== -1 ? name.split("-") : [name];
			_.each(splitName, function(namePiece){
				returnName += namePiece[0].toUpperCase() + namePiece.slice(1);
			});
		});

		return returnName;
	},
	join: function(whole, part, joinChar) {

		if(whole.length && part.length == 0) {
			return whole;
		}
		if(whole.length == 0 && part.length == 0) {
			return part;
		}

		return whole + joinChar + part;
	},
	hasUpperCase: function(str) {
		return str.toLowerCase() != str;
	},
	hasSpace: function(str){
		return str.indexOf(" ") !== -1;
	},
	parseNpmName: function(str) {
		return str.toLowerCase().trim().replace(/\s/g, '-')
	},
	validateRouteExists: function(route) {
		// Needs to check that it can find a .route.js indicated
		return true;
	},
	validatePageExists: function(page) {
		// Needs to check that ic can find a .page.js indicated
		return true;
	},
	validateServiceExists: function(service) {
		// Needs to check that it can find a .service.js indicated
		return true;
	},

	validateTagName: function(name) {
		if(name.length == 0) {
			return 'You must provide a name';
		}
		if(this.hasUpperCase(name) || this.hasSpace(name)) {
			return 'Your name must be standard component style: tag-name';
		}

		return true;
	},
	validateRestRoute: function(route) {
		if(route.length == 0) {
			return 'You must provide a route';
		}
		if(this.hasSpace(route) || route.indexOf(".") !== -1) {
			return 'You cannot have spaces or periods in your REST route';
		}

		return true;
	},
	validateService: function(route) {
		if(route.length == 0) {
			return 'You must provide a route.';
		}
		if(this.hasUpperCase(route) || this.hasSpace(route) || route.indexOf(".") !== -1) {
			return 'Your service must be in this style: transload-tracking';
		}

		if(route.indexOf("service") !== -1) {
			return 'Your name cannot contain the word "service"';
		}

		return true;

	},
	validateRoute: function(route) {
		if(route.length == 0) {
			return 'You must provide a route.';
		}
		if(this.hasUpperCase(route) || this.hasSpace(route)) {
			return 'Your route must be in this style: main.user-main';
		}
		

		return true;

	},

	validateRouteName: function(routeName) {
		if(routeName.length == 0) {
			return 'You must provide a route.';
		}
		if(this.hasUpperCase(routeName) || this.hasSpace(routeName)) {
			return 'Your route name cannot have upper cases or spaces: user-main';
		}

		return true;
	},
	getFiles: function(dir, type, doneFn) {
		var chopDir = dir;
		var types = _.isArray(type) ? type : [type];

		var walk = function(dir, done) {
			var results = [];
			fs.readdir(dir, function(err, list) {
				if (err) return done(err);
				var i = 0;
				(function next() {
					var file = list[i++];
					if (!file) return done(null, results);
					file = dir + '/' + file;
					fs.stat(file, function(err, stat) {
						if (stat && stat.isDirectory()) {
							walk(file, function(err, res) {
								results = results.concat(res);
								next();
							});
						} else {
							var fileSrc = file.replace(chopDir + "/", "");
							_.each(types, (type) =>{
								if(fileSrc.indexOf("includes") !== 0 && fileSrc.indexOf("." + type) === fileSrc.length - (type.length + 1) ) {
									//fileSrc = fileSrc.substr(0, fileSrc.lastIndexOf("." + type));
									results.push(fileSrc);

								}
							}, this);
							// Ignoring files that start with include because we don't want to include the self

							next();
						}
					});
				})();
			});

			return results;
		};

		return walk(dir, doneFn);
	},
	updateSiteMap: function(destPath, fullRoute, displayText, isDisplayable) {
		var filename = path.join(destPath, "routes.map.json");

		isDisplayable = !_.isUndefined(isDisplayable) ? isDisplayable : true;
		var json;
		try {
			json = fs.readJsonSync(filename, {});
		} catch(e) {
			// couldn't get file so assuming it doesn't exist
			json = {
				"app": [
				]
			};

		}
		if(!_.has(json, "app")) {
			throw new Error("routes.map.json doesn't have a property 'app'");

		}


		var routes = fullRoute.split(".");

		var lastRoute = routes.pop();
		var nestedObj = json.app;

		function findID(arr, id) {
			return _.find(arr, function (item) {
				return item.id == id;
			});
		}


		if(routes.length) {

			_.each(routes, function (route) {
				if (!_.isObject(nestedObj) || nestedObj == null) {
					return false;
				}

				nestedObj = findID(nestedObj, route);
				if(_.has(nestedObj, "routes")) {
					nestedObj = nestedObj.routes;
				}
			}, this);
		}


		if(!_.isArray(nestedObj)) {
			throw new Error("Can't push new route into the routes.map.json file: "+ fullRoute);
		}


		if(fullRoute.indexOf("app.") !== 0){
			fullRoute = "app." + fullRoute;
		}

		var foundRoute = findID(nestedObj, lastRoute);
		if(!foundRoute) {
			nestedObj.push({
				id: lastRoute,
				displayText: displayText,
				sref: fullRoute,
				isDisplayable: isDisplayable,
				icon: "",
				routes: []
			});
			fs.outputJsonSync(filename, json);
		}



	},
	generateGenericJsIncludes: function(destPath, done, filename, type){
		filename = filename || "includes.js";
		type = type || "js";

		var folder = destPath;
		this.getFiles(folder, type, function(err, results){
			if(err) throw err;

			var filePath = path.join(folder, filename);

			var output = "";

			output = "'use strict';\n";


			_.each(results, function(file) {
				if(file != filename) {
					output += "import './" + file + "';\n";
				}

			});

			fs.outputFile(filePath, output, function(){
				done();
			});
		});
	},

	generateGenericScssInclude: function(destPath, filename) {

		var type = 'scss';

		var folder = destPath;
		this.getFiles(folder, type, function(err, results){
			if(err) throw err;

			var filePath = path.join(folder, filename + '.' + type);

			var output = "";

			_.each(results, function(file) {
				if(file != filename + "." + type) {
					output += "@import '" + file + "';\n";
				}

			});

			fs.outputFile(filePath, output, function(){
			});
		});
	},

	updateServerComponents: function(basePath, components) {
		var filename = path.join(basePath, 'server', `scaffi-server.json`);
		
		var json;
		try {
			json = fs.readJsonSync(filename, {});
		} catch(e) {
			// couldn't get file so assuming it doesn't exist
			json = {
				config: {}
			};
			
		};
		
		if(!json.components) {
			json.components = {
				"app": {
					"port": 3000
				},
				"session": {
					"secretKey": "make 1t ra1n $salter",
					"resave": true,
					"saveUninitialized": true
				},
				"bull": {},
				"epilogue": {},
				"redis": {},
				"redis-connect": {},
				"sequelize": {},
				"socket-io": {}
			};
		}
		
		fs.outputJsonSync(filename, json);
		
	},
	updateConfig: function(basePath, type, projectDetails){
		var filename = path.join(basePath, type, `scaffi-${type}.json`);
		var writeProps = [
			"apiRoute",
			"uiLocalhostPort",
			"serverLocalhostPort",
			"variedIdName",
			"idName",
			"tableNameStandard",
			"columnNameStandard",
			"columnMultiWorkStandard",
			"idCapitalizeStandard",
			"routeLowercaseStandard"
		];


		var json;
		try {
			json = fs.readJsonSync(filename, {});
		} catch(e) {
			// couldn't get file so assuming it doesn't exist
			json = {
				config: {}
			};

		}
		
		_.each(writeProps, function(name){
			json.config[name] = projectDetails[name] || null;
		});


		fs.outputJsonSync(filename, json);

	}


};