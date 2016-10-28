'use strict';

var _ = require("lodash");
var fs = require('fs-extra');
var path = require('path');

var helperFns = {
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

		if(!part) {
			return whole;
		}
		if(!whole) {
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
			return 'Your route must be in this style: main/user-main';
		}

		if(route.indexOf(".") !== -1) {
			return 'You cannot have . in your route'
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


		if(fullRoute.indexOf(".") !== -1){
			fullRoute = fullRoute.replace(/\./g, "/");
		}
		
		var routes = fullRoute.split("/");

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
				sref: fullRoute.replace(/\//g, "."),
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
				if(file != filename && !_.endsWith(file, ".e2e.js") && !_.endsWith(file, ".spec.js")) {
					output += "import './" + file + "';\n";
				}

			});

			console.log(output);

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

			var output = " ";

			_.each(results, function(file) {
				if(file != filename + "." + type) {
					output += "@import '" + file + "';\n";
				}

			});

			fs.outputFile(filePath, output, function(){
			});
		});
	},

	exists: function(filename) {
		try {
			
			return fs.existsSync(filename)
		} catch(e){

		}
		
		return false;
	},
	openJson: function(filename) {
		var json;
		try {
			json = fs.readJsonSync(filename, {});
			
		} catch(e) {
			throw e;
		}
		
		return json;
	},
	saveJson: function(filename, json) {
		
		try {
			fs.outputJsonSync(filename, json);
			
		} catch(e) {
			throw e;
		}
		
	},
	updateJson: function(filename, callback) {
		
		var json;
		try {
			json = fs.readJsonSync(filename, {});
			if(json) {
				callback(json);
				fs.outputJsonSync(filename, json);
				
			}
		} catch(e) {
			throw e
		}
	},
	updateServerComponents: function(basePath, components) {
		var filename = path.join(basePath, 'server', `scaffi-server.json`);
		
		var json;
		try {
			json = fs.readJsonSync(filename, {});
		} catch(e) {
			// couldn't get file so assuming it doesn't exist
			json = {
				components: {}
			};
			
		};
		
		if(!json.components) {
			json.components = {
				"app": {
					"port": 3000
				}
			};
			json.services = {};
		}
		
		
		
		fs.outputJsonSync(filename, json);
		
	},
	updatePrivateConfig: function(basePath, filename, projectDetails){
		filename = path.join(basePath, `${filename}.json`);
		
		var json;
		try {
			json = fs.readJsonSync(filename, {});
		} catch(e) {
			// couldn't get file so assuming it doesn't exist
			json = {
				config: {}
			};
			
		}
		
		_.each(projectDetails, function(value, name){
			json.config[name] = value;
			
		});
				
		fs.outputJsonSync(filename, json);
	},
	updateConfig: function(basePath, filename, projectDetails){
		filename = path.join(basePath, `${filename}.json`);
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
			"routeLowercaseStandard",
			"environment",
			"version"
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
			if(_.has(projectDetails, name)) {
				json.config[name] = projectDetails[name];
			} else if(!_.has(json.config, name)){
				json.config[name] = null;
			}
		});


		fs.outputJsonSync(filename, json);

	},

	runJspmCommand: function(context, args) {
		args.unshift('./node_modules/jspm/jspm.js');
		console.log(args)
		context.spawnCommandSync('node', args, {cwd: context.destinationPath('src', 'ui')});
	},
	installServerPackages: function(context){
		context.log("Installing Server Node");
		context.spawnCommandSync('npm', ['install'], {cwd: context.destinationPath('src', 'server')});
	},
	installUiPackages: function(context) {
		context.log("Installing UI Node")
		context.spawnCommandSync('npm', ['set', "registry", "https://registry.npmjs.org/"], {cwd: context.destinationPath('src', 'ui')});
		context.spawnCommandSync('npm', ['install'], {cwd: context.destinationPath('src', 'ui')});
		context.spawnCommandSync('npm', ['shrinkwrap'], {cwd: context.destinationPath('src', 'ui')});
	},
	deletePrivateConfigs: function(context){
		try {
			/*
			 These need to be sync because otherwise yeoman gets confused with order
			 */
			if(context.fs.exists(context.destinationPath(path.join('src', "server", "scaffi-server.private.json")))) {
				fs.unlinkSync(context.destinationPath(path.join('src', "server", "scaffi-server.private.json")));
			}

			if(context.fs.exists(context.destinationPath(path.join('src', "ui", "scaffi-ui.private.json")))) {
				fs.unlinkSync(context.destinationPath(path.join('src', "ui", "scaffi-ui.private.json")));
			}
		} catch(e){}
	},
	installLocalhostConfig: function(context){
		if(!context.fs.exists(context.destinationPath(path.join("src", "server", "config", "scaffi-server.localhost.private.json")))){
			context.fs.writeJSON(context.destinationPath(path.join("src", "server", "config", "scaffi-server.localhost.private.json")), {
				"config": {
					"environment": "localhost"
				},
				"components": {},
				"services": {}
			});
		}
		if(!context.fs.exists(context.destinationPath(path.join("src", "ui", "config", "scaffi-ui.localhost.private.json")))){
			context.fs.writeJSON(context.destinationPath(path.join("src", "ui", "config", "scaffi-ui.localhost.private.json")), {
				"config": {
					"environment": "localhost"
				}
			});
		}
	},
	needsUpgrade: function(context){
		return !context.config.get("structureVersion") || context.config.get("structureVersion") < helperFns.getUpgrades(context) ? true : false;
	},
	getUpgrades: function(context){
		return [
			// UP to 0.0.3 / structureVersion # 1
			function(){

				var success = true;
				try {
					/*
					 UI installs
					 Update jspm / system builder / scaffi-ui-core update
					 */
					context.spawnCommandSync('npm', ['install', 'jspm@0.16.35'], {cwd: context.destinationPath('src', 'ui')});
					context.spawnCommandSync('npm', ['install', 'systemjs-builder@0.15.15'], {cwd: context.destinationPath('src', 'ui')});
					helperFns.runJspmCommand(context, ['uninstall', "ThirdCorner/scaffi-ui-core"]);
					helperFns.runJspmCommand(context, ['install', 'npm:scaffi-ui-core']);

					/*
					 Server installs
					 */
					context.spawnCommandSync('npm', ['install', 'nodemon@1.9.1'], {cwd: context.destinationPath('src', 'server')});
					context.spawnCommandSync('npm', ['install', 'scaffi-server-core@0.0.2'], {cwd: context.destinationPath('src', 'server')});
					/*
					 Remove postinstall
					 Add ui dependancies
					 Remove start trigger
					 Remove github reference for scaffi-ui-core
					 */
					helperFns.updateJson(context.destinationPath(path.join("src", "ui", "package.json")), function (json) {
						if (json.scripts.postinstall) {
							delete json.scripts.postinstall;
						}
						if(json.scripts.start){
							delete json.scripts.start;
						}
						json.devDependencies["jspm"] = "0.16.35";
						json.devDependencies["systemjs-builder"] = "0.15.15";


					});
					/*
					 Add Server Dependancies
					 Remove start trigger
					 */
					helperFns.updateJson(context.destinationPath(path.join("src", "server", "package.json")), function (json) {
						json.devDependencies["nodemon"] = "^1.9.1";
						if(json.scripts.start){
							delete json.scripts.start;
						}
						json.dependencies["scaffi-server-core"] = "~0.0.2";
					});
					/*
					 Add project-level package.json
					 */

					context.fs.copyTpl(context.templatePath(path.join("0", "package.json")), context.destinationPath("package.json"), {
						projectName: context.config.get("projectDetails").projectName,
						projectDescription: "",
						projectAuthor: context.config.get("projectDetails").authorName
					});

					/*
					 Add ignores to project base level
					 */
					context.fs.copy(context.templatePath(path.join("0", "_gitignore")), context.destinationPath("_gitignore"));
					context.fs.move(context.destinationPath("_gitignore"), context.destinationPath(".gitignore"));

					/*
					 Add device specific build dirs
					 */
					context.fs.copy(context.templatePath(path.join("0", "README.md")), context.destinationPath("build", "web", "README.md"));
					context.fs.copy(context.templatePath(path.join("0", "README.md")), context.destinationPath("build", "ios", "README.md"));
					context.fs.copy(context.templatePath(path.join("0", "README.md")), context.destinationPath("build", "android", "README.md"));




				}catch(e){
					success = false;
					throw e;
				}


				return success;
			},
			// UP to 0.0.5 / structureVersion # 2
			function() {

				var success = true;
				try {
					context.fs.copy(context.templatePath(path.join("1", "server", "config")), context.destinationPath("src", "server", "config"));
					context.fs.copy(context.templatePath(path.join("1", "ui", "config")), context.destinationPath("src", "ui", "config"));
					
					/*
					 Add ignore changes to project base level
					 */
					context.fs.copy(context.templatePath(path.join("1", "_gitignore")), context.destinationPath(".gitignore"));
				} catch (e) {
					success = false;
					throw e;
				}


				return success;
			},
			// UP to 0.1.0 / structureVersion #3
			function(){
				var success = true;
				var versionFolder = "2";
				try {
					/*
					 Add ignore changes to project base level
					 */
					context.fs.copy(context.templatePath(path.join(versionFolder, "_gitignore")), context.destinationPath(".gitignore"));

					/*
						Update base level generator to latest
					 */
					context.spawnCommandSync('npm', ['install', 'generator-scaffi@0.1.0', "--save"], {cwd: context.destinationPath()});
					
					/*
						Update config json from cli => ci
					 */
					helperFns.updateJson(context.destinationPath("src", "server", "config", "scaffi-server.ci.private.json"), function(json){
						json.config.environment = "ci";
					});

					/*
						Delete scaffi-server.private for cleanup purposes
					 */
					if(context.fs.exists(context.destinationPath("src", "server", "scaffi-server.private.json"))) {
						context.fs.delete(context.destinationPath("src", "server", "scaffi-server.private.json"));
					}

					/*
						Rename all the config files that need to be
					 */
					context.fs.move(context.destinationPath("src", "server", "config", "scaffi-server.ci.private.json"), context.destinationPath("src", "server", "config", "scaffi-server.ci.json"));
					context.fs.move(context.destinationPath("src", "server", "config", "scaffi-server.development.private.json"), context.destinationPath("src", "server", "config", "scaffi-server.development.json"));
					context.fs.move(context.destinationPath("src", "server", "config", "scaffi-server.production.private.json"), context.destinationPath("src", "server", "config", "scaffi-server.production.json"));
					context.fs.move(context.destinationPath("src", "server", "config", "scaffi-server.prototype.private.json"), context.destinationPath("src", "server", "config", "scaffi-server.prototype.json"));
					context.fs.move(context.destinationPath("src", "server", "config", "scaffi-server.qa.private.json"), context.destinationPath("src", "server", "config", "scaffi-server.qa.json"));

					// Install Server core update
					context.spawnCommandSync('npm', ['install', 'scaffi-server-core@0.1.0', "--save"], {cwd: context.destinationPath('src', 'server')});

					// Install UI core
					context.spawnCommandSync('npm', ['install', 'scaffi-ui-core@0.1.0', "--save"], {cwd: context.destinationPath('src', 'ui')});
					context.spawnCommandSync('npm', ['install', 'ionic-angular@1.3.1', "--save"], {cwd: context.destinationPath('src', 'ui')});

					/*
						Make changes to ui package.json
					 */
					helperFns.updateJson(context.destinationPath("src", "ui", "package.json"), function(json){
						json.scripts = {};
					});

					context.fs.copy(context.templatePath(path.join(versionFolder, "index.html")), context.destinationPath("src", "ui", "app", "index.html"));
					context.fs.copy(context.templatePath(path.join(versionFolder, "layout.mobile.html")), context.destinationPath("src", "ui", "app", "theme", "layout", "layout.mobile.html"));
					
					/*
						Fix the build-resources.json file
					*/
					var buildDependencies = {
						"common": {
							"dependencies": [
								"angular",
								"angular-animate",
								"angular-aria",
								"angular-breadcrumb",
								"angular-loading-bar",
								"angular-messages",
								"angular-sanitize",
								"angular-material",
								"angular-ui-router",
								"body-parser",
								"clean-css",
								"font-awesome",
								"lodash",
								"moment",
								"scaffi-ui-core",
								"walkdir"
							],
							"resources": {
								"fonts": {
									"font-awesome": "font"
								},
								"css": {
									"angular-loading*/build/loading-bar.min.css": "css",
									"font-awesome": "css"
								}
							}
						},
						"web": {
							"dependencies": [
							],
							"resources": {
								"css": {
									"bootstrap/dist/css/*.min.css": "css",
									"ng-table": "css"
								}
							}
						},
						"ios": {
							"dependencies": [
								"ionic-angular/release/js/ionic.js",
								"ionic-angular/release/js/ionic-angular.js"
							],
							"resources": {
								"fonts": {
									"ionic-angular/release/fonts/*": "font"
								},
								"css": {
									"ionic-angular/release/css/ionic.min.css": "css"
								}
							}
						},
						"android": {
							"dependencies": [
								"ionic-angular/release/js/ionic.js",
								"ionic-angular/release/js/ionic-angular.js"
							],
							"resources": {
								"fonts": {
									"ionic-angular/release/fonts/*": "font"
								},
								"css": {
									"ionic-angular/release/css/ionic.min.css": "css"
								}
							}
						}
					};
					
					var uiFolder = context.destinationPath(path.join("src", "ui"));
					
					fs.outputJsonSync(path.join(uiFolder, "build-resources.json"), buildDependencies);
					
					/*
					 Update config json from cli => ci
					 */
					helperFns.updateJson(context.destinationPath("src", "ui", "config", "scaffi-ui.ci.private.json"), function(json){
						json.config.environment = "ci";
					});
					
					context.fs.copy(context.templatePath(path.join(versionFolder, "mobile")), context.destinationPath("src", "ui", "app", "mobile"));
					
					/*
					 Delete scaffi-ui.private for cleanup purposes
					 */
					if(context.fs.exists(context.destinationPath("src", "ui", "scaffi-ui.private.json"))) {
						context.fs.delete(context.destinationPath("src", "ui", "scaffi-ui.private.json"));
					}
					
					/*
					 Rename all the config files that need to be
					 */
					context.fs.move(context.destinationPath("src", "ui", "config", "scaffi-ui.ci.private.json"), context.destinationPath("src", "ui", "config", "scaffi-ui.ci.json"));
					context.fs.move(context.destinationPath("src", "ui", "config", "scaffi-ui.development.private.json"), context.destinationPath("src", "ui", "config", "scaffi-ui.development.json"));
					context.fs.move(context.destinationPath("src", "ui", "config", "scaffi-ui.production.private.json"), context.destinationPath("src", "ui", "config", "scaffi-ui.production.json"));
					context.fs.move(context.destinationPath("src", "ui", "config", "scaffi-ui.prototype.private.json"), context.destinationPath("src", "ui", "config", "scaffi-ui.prototype.json"));
					context.fs.move(context.destinationPath("src", "ui", "config", "scaffi-ui.qa.private.json"), context.destinationPath("src", "ui", "config", "scaffi-ui.qa.json"));

					if(context.fs.exists(context.destinationPath("src", "ui", "app", "images"))) {
						context.fs.move(context.destinationPath("src", "ui", "app", "images"), context.destinationPath("src", "ui", "app", "resources", "images"));
					}

					if(context.fs.exists(context.destinationPath("src", "ui", "app", "fonts"))) {
						context.fs.move(context.destinationPath("src", "ui", "app", "fonts"), context.destinationPath("src", "ui", "app", "resources", "fonts"));
					}
					

					/*
						Cleanup folders
					 */
					fs.removeSync(context.destinationPath("src", "ui", "jspm_packages"));
					fs.removeSync(context.destinationPath("src", "ui", "gulp"));
					fs.removeSync(context.destinationPath("src", "ui", "gulpfile.js"));
					fs.removeSync(context.destinationPath("src", "ui", "jspm.conf.js"));

				} catch (e) {
					success = false;
					context.log(e);
					throw e;
				}
				
				
				return success;
			}
		]
	}
};

module.exports = helperFns;