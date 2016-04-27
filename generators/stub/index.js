'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');

var helperFns = require('../helpers/generatorFns');

module.exports = yeoman.Base.extend({

	initializing: function(){
		this.allowedStubs = fs.readdirSync(this.templatePath());
	},
	prompting: function () {
		var done = this.async();

		// Have Yeoman greet the user.
		this.log(yosay(
			chalk.green('Scaffi') + ' stub time!'
		));


		var prompts = [];
		if(this.options.route) {
			if(helperFns.validateRoute(this.options.route) !== true) {
				throw new Error(helperFns.validateRoute(this.options.route));
			}

			var splits = this.options.route.split(".");
			this.routeName = splits.pop();
			this.route = splits.join(".");
			done();

		} else {

			prompts.push({
				type: 'input',
				name: 'route',
				store: true,
				message: 'What\'s the route path? Must include the page route as well (main.user.index)',
				validate: function (input) {

					// need to check that this exists already
					return helperFns.validateRoute(input);
				}
			});
		}


		/*
			Setup for type
		 */
		if(this.options.type){
			if(allowedStubs.indexOf(this.options.type) === -1) {
				throw new Error("You specified a type that doesn't exist as a template: ", this.options.type);
			}

			this.stubType = this.options.type;
		} else {
			prompts.push({
				type: 'list',
				name: 'stubType',
				choices: this.allowedStubs,
				message: 'Which stub type would you like to add?',

			});
		}


		if(this.options.stubName) {
			this.stubName = this.options.stubName;
		} else {
			prompts.push({
				type: "input",
				name: 'stubName',
				message: "What would you like to call this stub? Remember, it will be namespaced with the folder it's in. ('list' will become starting-index-list)",
				validate: function(input) {
					if(input.indexOf(".") !== -1) {
						return "Periods are not allowed in the name";
					}
					return input.length > 0;
				}
			});
		}


		if(prompts.length) {
			this.prompt(prompts, function (props) {

				if(!this.route) {
					this.route = props.route;
				}

				if(!this.stubType) {
					this.stubType = props.stubType;
				}

				if(!this.stubName) {
					this.stubName = props.stubName;
				}

				done();
			}.bind(this));
		}


	},

	writing: function () {

		var routeSplit = this.route.split(".");
		var pageName = routeSplit.pop();
		var routeName = routeSplit.pop();

		var name = routeName + "-" + pageName + "-" + this.stubName.replace(" ", "-");

		var htmlParams = {
			stubPath: this.route + "." + name
		};
		var jsParams = {
			stubName: name,
			className: helperFns.makeDisplayName(name)
		};

		var filePath = this.route.replace(".", "/") + "/";
		var templateUrl = this.templatePath(this.stubType + "/");

		this.fs.copyTpl(
			templateUrl + "/" + this.stubType + ".html",
			this.destinationPath("ui/src/app/routes/" + filePath + name + ".html"),
			htmlParams
		);
		this.fs.copyTpl(
			templateUrl + "/" + this.stubType + ".stub.js",
			this.destinationPath("ui/src/app/routes/" + filePath + name + ".stub.js"),
			jsParams
		);



	},
	install: function(){
		// This needs to be here because copyTpl is async and includes won't find new files if run
		// in the writing phase
		var done = this.async();
		var destPath = this.destinationPath('ui/src/app/routes/');
		helperFns.generateGenericScssInclude(destPath, "routes");

		helperFns.generateGenericJsIncludes(destPath, done, "routes.js");
	},
});
