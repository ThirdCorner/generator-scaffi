"use strict";

var browserify = require("browserify");
var sass = require("node-sass");
var fs = require("fs");
var helperFns = require("../helpers/generatorFns");
var path = require("path");
var _ = require("lodash");
var mkdirp = require("mkdirp");
var md5 = require("md5");
var glob = require("glob");
var fsExtra = require("fs-extra");

var Promise = require("bluebird");

module.exports = {
	/*
		Task chain FNs
	 */

	buildUi: function(context, platformType){
		var that = this;
		return that.syncPackages(context)
			.then(function(){
				return that.syncPlatformPackages(context, platformType);
			}).then(function(){
				return that.changeUiPlatformType(context, platformType);
			}).then(function(){
				context.log("Bundling App Resources");

				that.transferVendorBundle(context, platformType);

				return Promise.all([
					that.bundleAppJS(context, platformType),
					that.bundleAppSass(context, platformType),
					that.bundleAppResources(context, platformType)
				]).then(function(){

					context.log("Finished: Bundling App Resources");
				});
			}).then(function(){
				context.log("Bundling Index");
				return that.bundleIndex(context, platformType);
			})
	},
	
	/*
		Config FNS
	 */
	getScaffiPrivate: function(context) {

		var buildInfo = {};
		if(helperFns.exists(context.destinationPath("scaffi.private.json"))) {
			buildInfo = helperFns.openJson(context.destinationPath("scaffi.private.json"));
		}
		
		var defaultStructure = {
			build: {
				packages: {
					ui: {
						hash: null,
						packages: {},
						jsPackages: {}
					},
					server: {
						hash: null,
						packages: {},
						jsPackages: {}
					}
				},
				webDependencies: [],
				iosDependencies: [],
				androidDependencies: []
			},
			bundle: {
				web: {
					hash: null,
					config: {}
				},
				ios: {
					hash: null,
					config: {}
				},
				android: {
					hash: null,
					config: {}
				}
			}
		};

		function fillStructure(obj, structure) {

			if (structure && _.isObject(structure)) {
				for (var i in structure) {
					if (!_.has(obj, i)) {
						if(structure[i] == null) {
							obj[i] = null;
						} else if (_.isArray(structure[i])) {
							obj[i] = []
						} else {
							obj[i] = {};
						}
					}

					fillStructure(obj[i], structure[i]);

				}
			}
		}

		fillStructure(buildInfo, defaultStructure);

		return buildInfo;

	},
	saveScaffiPrivate: function(context, json) {
		helperFns.saveJson(context.destinationPath("scaffi.private.json"), json);

	},
	getRandomHash: function(){
		return md5(Date().toString())
	},
	changeUiPlatformType: function(context, platformType) {
		return new Promise(function(resolve){
			var jsonPath = context.destinationPath("src", "ui", "scaffi-ui.private.json");
			var privateJson = helperFns.openJson(jsonPath);

			privateJson.config.platform = platformType;

			helperFns.saveJson(jsonPath, privateJson);

			resolve();
		});
	},


	/*
		Sync Steps
	 */
	syncPackages: function(context){

		var promises = [];

		if(!this.checkPackages(context, "ui")) {
			context.log("UI Packages out-of-sync; Installing...");
			promises.push(this.installPackages(context, "ui"));
		}

		if(!this.checkPackages(context, "server")) {
			context.log("Server Packages out-of-sync; Installing...");
			promises.push(this.installPackages(context, "server"));
		}

		if(promises.length) {
			return Promise.all(promises).then(function(){
				context.log("Sync Packages Complete");
			});
		} else {
			return Promise.resolve();
		}

	},

	checkPackages: function(context, type){

		var config = this.getScaffiPrivate(context);

		var synced = true;
		this.parseInstalledPackages(context, type, function(npmPackageJson, name){
			if(!npmPackageJson) {
				synced = false;
			} else if(!_.has(config.build.packages[type].packages, name) || (npmPackageJson._resolved != config.build.packages[type].packages[name] && npmPackageJson._shasum != config.build.packages[type].packages[name]) ) {
				synced = false;
			}
		});



		return synced;
	},
	updateScaffiPrivateInstalledPackages: function(context, type){
		var config = this.getScaffiPrivate(context);
		
		config.build.packages[type].hash = this.getRandomHash();
		config.build.packages[type].packages = {};
		config.build.packages[type].jsPackages = {};
		
		this.parseInstalledPackages(context, type, function(npmPackageJson, name){
			
			if(npmPackageJson) {
				var resolve = npmPackageJson._resolved || npmPackageJson._shasum;
				if(!resolve) {
					throw new Error(name + " does not have a resolve or dist.shasum to track. Cannot build.");
				}
				config.build.packages[type].packages[name] = resolve;
				if (npmPackageJson.main) {
					config.build.packages[type].jsPackages[name] = resolve;
				}
			}
			
		});
		
		
		this.saveScaffiPrivate(context, config);
	},
	installPackages: function(context, type){

		var that = this;
		return new Promise(function(resolve){
			context.log(_.capitalize(type) + " has started npm install");
			context.spawnCommandSync('npm', ['set', "registry", "https://registry.npmjs.org/"], {cwd: context.destinationPath('src', type)});
			context.spawnCommandSync('npm', ['install'], {cwd: context.destinationPath('src', type)});
			context.spawnCommandSync('npm', ['shrinkwrap'], {cwd: context.destinationPath('src', type)});

			that.updateScaffiPrivateInstalledPackages(context, type);

			resolve();

		});


	},

	installPackage: function(context, platformType, pkg) {
		var that = this;
		return new Promise(function(resolve){
			var serverOrUi = platformType == "server" ? "server" : "ui";

			context.log(_.capitalize(serverOrUi) + " has started npm install "+ pkg + " --save");
			context.spawnCommandSync('npm', ['set', "registry", "https://registry.npmjs.org/"], {cwd: context.destinationPath('src', serverOrUi)});

			context.spawnCommandSync('npm', ['install', pkg, "--save"], {cwd: context.destinationPath('src', serverOrUi)});
			context.spawnCommandSync('npm', ['shrinkwrap'], {cwd: context.destinationPath('src', serverOrUi)});

			that.updateScaffiPrivateInstalledPackages(context, serverOrUi);

			if(platformType !== "server") {

				// Clean up package name
				if(pkg.indexOf(":") !== -1) {
					pkg = pkg.substr(pkg.indexOf(":") + 1);
				}
				
				if(pkg.indexOf("/") !== -1) {
					pkg = pkg.substr(pkg.indexOf("/") + 1);
				}
				if(pkg.indexOf("@") !== -1) {
					pkg = pkg.substr(0, pkg.indexOf("@"));
				}
				if(pkg.indexOf("#") !== -1) {
					pkg = pkg.substr(0, pkg.indexOf("#"));
				}
				
				var buildJson = that.getBuildResourceJson(context);
				
				switch(platformType) {
					case "ui":
						if(buildJson.common.dependencies.indexOf(pkg) === -1){
							buildJson.common.dependencies.push(pkg);
						}
						break;
					case "web":
						if(buildJson.web.dependencies.indexOf(pkg) === -1){
							buildJson.web.dependencies.push(pkg);
						}
						break;
					case "mobile":
						if(buildJson.ios.dependencies.indexOf(pkg) === -1){
							buildJson.ios.dependencies.push(pkg);
						}
						if(buildJson.android.dependencies.indexOf(pkg) === -1){
							buildJson.android.dependencies.push(pkg);
						}
						break;
					case "ios":
					case "android":
						if(buildJson[platformType].dependencies.indexOf(pkg) === -1){
							buildJson[platformType].dependencies.push(pkg);
						}
						break;
					
				}
				
				that.saveBuildResourceJson(context, buildJson);
			}


			resolve();

		});

	},
	uninstallPackage: function(context, platformType, pkg){
		var that = this;
		return new Promise(function(resolve) {
			var serverOrUi = platformType == "server" ? "server" : "ui";

			context.log(_.capitalize(serverOrUi) + " has started npm uninstall " + pkg + " --save");

			var opts = {
				save: true,
				cwd: context.destinationPath('src', serverOrUi)
			};

			context.spawnCommandSync('npm', ['uninstall', pkg, "--save"], {cwd: context.destinationPath('src', serverOrUi)});
			context.spawnCommandSync('npm', ['shrinkwrap'], {cwd: context.destinationPath('src', serverOrUi)});

			that.updateScaffiPrivateInstalledPackages(context, serverOrUi);

			if(platformType !== "server") {

				var buildJson = that.getBuildResourceJson(context);

				var platforms = ["common", "web", "ios", "android"];
				_.each(platforms, (platform)=>{
					var key;
					for(var i in buildJson[platform].dependencies) {
						if(buildJson[platform].dependencies[i] == pkg) {
							key = i;
						}
					}

					if(key) {
						context.log("Removing " + pkg + " from " + platform + " dependencies");
						buildJson[platform].dependencies.splice(key, 1);
					}
				});
				
				that.saveBuildResourceJson(context, buildJson);
			}

			resolve();
		});
	},
	/*
		Sync Platform Vendors
	 */
	/**
	 * 
	 * @param context - this from generator
	 * @param platformType = [web, ios, android]
	 */
	syncPlatformPackages: function(context, platformType){
		var config = this.getScaffiPrivate(context);

		if(config.build.packages.ui.hash !== config.bundle[platformType].hash
			|| !_.isEqual(config.bundle[platformType].config, this.getBuildResourcesByPlatform(context, platformType))) {
			return this.rebuildVendorResources(context, platformType);
		} else {
			return Promise.resolve();
		}

	},
	rebuildVendorResources: function(context, platformType) {
		context.log("Rebuilding Vendor Resources for " + _.capitalize(platformType));

		fsExtra.emptyDirSync(context.destinationPath("src", "ui", "build", platformType, ".vendor"));

		var config = this.getScaffiPrivate(context);
		var buildResources = this.getBuildResourcesByPlatform(context, platformType);
		config.bundle[platformType] = {
			hash: null,
			config: buildResources
		};

		this.saveScaffiPrivate(context, config);

		var that = this;
		return Promise.all([
			this.bundleVendorJS(context, platformType),
			this.bundleVendorResources(context, platformType)
		]).then(function(){
			var config = that.getScaffiPrivate(context);
			config.bundle[platformType].hash = config.build.packages.ui.hash;
			that.saveScaffiPrivate(context, config);
			context.log("Finished: Vendor Rebuilds");
		})
	},

	bundleVendorJS: function(context, platformType) {

		var that = this;
		return new Promise(function(resolve){
			context.log("Bundling Vendor JS for '" + platformType + "'");
			try {

				fsExtra.ensureDirSync(context.destinationPath("src", "ui", "build", platformType, ".vendor", "scripts"));

				var config = that.getScaffiPrivate(context);
				var buildDeps = config.bundle[platformType].config.dependencies;

				process.chdir(context.destinationPath("src", "ui"));
				var bundleChain = browserify({
					debug: true
				});

				/*
					Figure out which in the build json, are the js packages we need to compile, based on
					the dependacies for the platform
				 */
				for(var i in buildDeps) {
					var pkgName = buildDeps[i];
					if(_.has(config.build.packages.ui.jsPackages, pkgName))  {
						bundleChain = bundleChain.require(pkgName);
					}
				}


				var buildHash = that.getRandomHash();

				var fileStream = fs.createWriteStream(context.destinationPath("src", "ui", "build", platformType, ".vendor", "scripts", "vendor." + buildHash + ".js"));
				bundleChain
					//.plugin("minifyify", {map: 'bundle.js.map', output: 'bundle.js.map'})
					.transform("babelify", {presets: ["es2015", "stage-0"], plugins: ["transform-decorators-legacy", "transform-html-import-to-string"]})
					.bundle()
					.pipe(fileStream)

				fileStream.on("finish", function(){
					context.log("Finished: Bundling Vendor JS");
					resolve();
				})

			} catch (e){
				console.log(e)
				throw e;
			}
		})

	},

	bundleVendorResources: function(context, platformType){

		return this.bundleResources(context, path.join("src", "ui", "node_modules"), path.join("src", "ui", "build", platformType, ".vendor"), platformType);

	},
	transferVendorBundle: function(context, platformType){

		fsExtra.emptyDirSync(this.getPlatformOutputBaseDir(context, platformType));

		if(platformType == "web"){
			fsExtra.copySync(context.destinationPath("src", "ui", "build", platformType, ".vendor"), this.getPlatformOutputBaseDir(context, platformType));
		} else {
			fsExtra.copySync(context.destinationPath("src", "ui", "mobile"), this.getPlatformOutputBaseDir(context, platformType));
			fsExtra.copySync(context.destinationPath("src", "ui", "build", platformType, ".vendor"), this.getPlatformOutputDir(context, platformType));
		}
	},

	/*
		App bundle FNs
	 */
	getPlatformOutputBaseDir: function(context, platformType) {
		if(platformType == "web") {
			return context.destinationPath("src", "server", "public");
		} else {
			return context.destinationPath("src", "ui", "build", platformType, "public");
		}
	},
	getPlatformOutputDir: function(context, platformType){
		if(platformType == "web") {
			return context.destinationPath("src", "server", "public");
		} else {
			return context.destinationPath("src", "ui", "build", platformType, "public", "www");
		}
	},
	bundleAppJS: function(context, platformType) {

		var that = this;
		return new Promise(function(resolve){

			context.log("Bundling App JS");

			var config = that.getScaffiPrivate(context);
			var buildDeps = config.bundle[platformType].config.dependencies;


			var appChain = browserify(context.destinationPath("src", "ui", "app", "app.js"), {
				debug: true
			});

			that.cleanScriptFile(context, context.destinationPath(that.getPlatformOutputDir(context, platformType), "scripts"), "app");


			for(var i in buildDeps) {
				var pkgName = buildDeps[i];
				if(_.has(config.build.packages.ui.jsPackages, pkgName))  {
					appChain = appChain.exclude(pkgName);
				}
			}


			/*
				For ionic specifically with weird include paths, we have to make sure to ignore
			 */

			var ignores = that.getIgnoreDependencies(context, platformType);
			for(var i in ignores) {
				appChain = appChain.ignore(ignores[i]);
			}


			var buildHash = md5(Date().toString());
			var fileStream = fs.createWriteStream(context.destinationPath(that.getPlatformOutputDir(context, platformType), "scripts", "app." + buildHash+ ".js"));

			appChain
				.transform("babelify", {presets: ["es2015", "stage-0"], plugins: ["transform-decorators-legacy", "transform-html-import-to-string"]})
				.bundle()
				.pipe(fileStream);

			fileStream.on("finish", function(){
				context.log("Finished: Bundle App JS");
				resolve();
			});
		});

		/*
		 Need to save this in private json so that it doesn't get committed.
		 */
	},
	bundleAppResources: function(context, platformType){

		return this.bundleResources(context, path.join("src", "ui", "app"), path.join(this.getPlatformOutputDir(context, platformType), ".vendor"), platformType);

	},
	bundleAppSass: function(context, platformType) {
		var that = this;
		return new Promise(function(resolve){
			context.log("Bundling App Sass (In Droves)");
			sass.render({
				file: context.destinationPath("src", "ui", "app", "app.scss")
			}, function(error, results){
				if(error){
					throw error;
				}

				var buildHash = md5(Date().toString());
				
				// BrowserSync will auto inject css without reload

				var filename = "app.css";
				//var filename = "app." + buildHash + ".css";
				fsExtra.ensureDirSync(context.destinationPath(that.getPlatformOutputDir(context, platformType), "styles"));
				fsExtra.outputFileSync(context.destinationPath(that.getPlatformOutputDir(context, platformType), "styles", filename), results.css);

				context.log("Finished: Bundling App Sass");
				resolve();
			});
			

		});

	},
	bundleIndex: function(context, platformType){
		var that = this;
		return new Promise(function(resolve){

			var outputLinkTags = "", scriptTags = "";
			var outputDir = that.getPlatformOutputDir(context, platformType);

			/*
				Cleanup index in case we're in watch mode
			 */
			try{
				fs.unlinkSync(context.destinationPath(outputDir, "index.html"))
			}catch(e){}

			var styleFiles = that.getBundleFiles(context, outputDir, "*.css");
			if(styleFiles) {
				styleFiles.forEach(function(file){
					if(_.startsWith(file, "/")) {
						file = file.substr(1);
					}
					outputLinkTags += '<link rel="stylesheet" href="'+file+'" />';
				})
			}

			// Mobile only stuff
			if(platformType !== "web") {
				outputLinkTags += '<meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">';
				outputLinkTags += ' <meta http-equiv="Content-Security-Policy" content="default-src *; img-src \'self\' data:; style-src \'self\' \'unsafe-inline\'; script-src \'self\' \'unsafe-inline\' \'unsafe-eval\'">';
				outputLinkTags += '<script src="cordova.js"></script>';
			} else {
				outputLinkTags = '<base href="/">' + outputLinkTags;
			}


			var vendor = that.getBundleFiles(context, outputDir, "scripts/vendor*");
			var app = that.getBundleFiles(context, outputDir, "scripts/app*");
			
			vendor.forEach(function(filePath){
				if(_.startsWith(filePath, "/")) {
					filePath = filePath.substr(1);
				}
				scriptTags += '<script src=' + filePath + '></script>';
			});
	
			app.forEach(function(filePath){
				if(_.startsWith(filePath, "/")) {
					filePath = filePath.substr(1);
				}
				scriptTags += '<script src=' + filePath + '></script>';
			});
	
			context.fs.copyTpl(context.destinationPath("src", "ui", "app", "index.html"), context.destinationPath(outputDir, "index.html"),
				{
					head: outputLinkTags,
					body: scriptTags
				});
			
			resolve();
		});
		
	},
	
	getGlobFilePath: function(type){
		var typeToExtension = {
			"font": "/**/*.{eot,svg,ttf,woff,woff2}",
			"css": "/**/*.min.css",
			"image": "/**/*.{png,gif,jpg,jpeg}",
			"file": "/**/*"
		};

		if(!_.has(typeToExtension, type)) {
			throw new Error("Unrecognized build type: ", type, ". Supported are ", _.keys(typeToExtension).toString());
		}

		return typeToExtension[type];
	},

	/*
		File Parsing / Env Fns
	 */

	bundleResources: function(context, inputDir, outputDir, platformType){
		var that = this;
		var resourceTypes = ["file", "css", "font", "image"];
		var promises = [];
		_.each(resourceTypes, function(resourceType){
			promises.push(new Promise(function(resolve){
				context.log("Bundling Resource " + _.capitalize(resourceType));

				var fileLists = that.getBuildResourceFileList(context, platformType, resourceType);

				try {


					_.each(fileLists, function (globs, folder) {
						fsExtra.ensureDirSync(context.destinationPath(outputDir, folder))

						_.each(globs, function (g) {

							var files = glob.sync(context.destinationPath(inputDir, g));
							if (files) {
								files.forEach(function (filePath) {
									var filename = path.basename(filePath);
									context.log("Copying: " + filePath);
									try {
										fsExtra.copySync(path.join(filePath), context.destinationPath(outputDir, folder, filename));
									} catch (e) {
										throw e;
									}
								});
							}

						});


					});
				} catch(e){
					throw e;
				}

				context.log("Finished: Bundling Resource " + _.capitalize(resourceType));
				resolve();

			}));
		});

		return Promise.all(promises);
	},
	getIgnoreDependencies: function(context, platformType) {

		var returnDeps = [];
		var buildResouces = this.getBuildResourceJson(context);
		_.each(["web", "ios", "android"], function(platform) {
			if(platform != platformType) {
				_.each(buildResouces[platform].dependencies, function(dep){
					if(buildResouces[platformType].dependencies.indexOf(dep) === -1 && returnDeps.indexOf(dep) === -1) {
						returnDeps.push(dep);
					}
				})
			}
		});

		return returnDeps;
	},
	getBuildResourceFileList: function(context, platformType, resourceType){

		var config = this.getScaffiPrivate(context);
		var resources = config.bundle[platformType].config.resources;

		var typeToExtension = this.getGlobFilePath(resourceType);
		var fileList = {};
		_.each(resources, function (folders, name) {
			_.each(folders, function (type, globPattern) {
				if (resourceType == type) {
					// if just a name, add glob stuff to it
					if (globPattern.indexOf("/") === -1 && globPattern.indexOf("\\") === -1 && globPattern.indexOf("*") === -1) {
						globPattern += typeToExtension;
					}


					if (!fileList[name]) {
						fileList[name] = [];
					}
					fileList[name].push(globPattern);


				}
			});
		});


		/*
		 fileList = {
		 fonts: [
		 glob,
		 glob
		 ]
		 }


		 */

		return fileList;


	},
	getUiPackageDependencies: function(context, platformType) {
		var deps = helperFns.openJson(context.destinationPath("src", "ui", "package.json"));
		
		var name = platformType + "Dependencies";
		var buildDeps = deps[name] || [];
		
		if(!buildDeps.length) {
			throw new Error("No dependencies found in " + name + ". Can't build");
		}
		
		return buildDeps
		
	},
	getBuildResourcesByPlatform: function(context, platformType){
		var buildJson = this.getBuildResourceJson(context);
		if(!buildJson.common) {
			buildJson.common = {};
		}
		if(!buildJson[platformType]) {
			buildJson[platformType] = {};
		}

		return _.merge(buildJson.common, buildJson[platformType]);
	},
	getBuildResourceJson: function(context){
		var buildJson = {};
		try {
			buildJson = helperFns.openJson(context.destinationPath("src", 'ui', "build-resources.json"));
		} catch(e) {
		}

		return buildJson;
	},
	saveBuildResourceJson: function(context, json){
		helperFns.saveJson(context.destinationPath("src", 'ui', "build-resources.json"), json);
	},
	parseInstalledPackages: function(context, type, loopCallback) {
		var deps = helperFns.openJson(context.destinationPath("src", type, "package.json")).dependencies;
		for(var name in deps) {

			if(!helperFns.exists(context.destinationPath("src", type, "node_modules"))
				|| !helperFns.exists(context.destinationPath("src", type, "node_modules", name))
				|| !helperFns.exists(context.destinationPath("src", type, "node_modules", name, "package.json"))) {

				loopCallback(null, name);
			} else {
				var innerPkg = helperFns.openJson(context.destinationPath("src", type, "node_modules", name, "package.json"));

				loopCallback(innerPkg, name);
			}


		}
	},
	ensureDirStructure: function(context, buildPlatform, buildDir) {
		if(buildPlatform == "ios" || buildPlatform == "android"){
			buildPlatform = "mobile";
		}
		mkdirp.sync(context.destinationPath("src", "ui", "build", buildPlatform, buildDir));

	},
	cleanHtmlFile: function(context, type) {
		var files = glob.sync(context.destinationPath("src", "ui", "build", type, "index.html"));
		if(files) {
			files.forEach(function (item, index) {
				fs.unlinkSync(item);
			})
		}
	},
	cleanScriptFile: function(context, destination, name) {
		var files = glob.sync(context.destinationPath(destination, name + ".*.js"));
		if(files) {
			files.forEach(function (item, index) {
				fs.unlinkSync(item);
			})
		}
	},
	getBundleFiles: function(context, outputPath, name) {
		var files = glob.sync(context.destinationPath(outputPath, "**", name));
		var returnFiles = [];
		if(files) {
			files.forEach(function(fileSrc, index) {
				returnFiles.push(fileSrc.substr(context.destinationPath(outputPath).length));
			})
		}

		return returnFiles;
	}

};
