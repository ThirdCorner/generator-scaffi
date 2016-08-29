'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var path = require("path");

var fs = require('fs');

var helperFns = require('../helpers/generatorFns');

module.exports = yeoman.Base.extend({
	initializing: function(){
		this.allowedPages = fs.readdirSync(this.templatePath());
	},
	prompting: function () {
		var done = this.async();

		// Have Yeoman greet the user.
		this.log(yosay(
			chalk.green('Scaffi') + ' page time!'
		));


		this.addBreadcrumb = true;
		if(_.has(this.options, 'addBreadcrumb')) {
			this.addBreadcrumb = this.options.addBreadcrumb == true || this.options.addBreadcrumb == "true" ? true : false;
		}

		var prompts = [];
		if(this.options.pageName) {
			if(helperFns.validateRoute(this.options.pageName) !== true) {
				throw new Error(helperFns.validateRoute(this.options.pageName));
			}

			if(this.options.route && helperFns.validateRoute(this.options.route) !== true) {
				throw new Error(helperFns.validateRoute(this.options.route));
			}

			this.pageType = 'basic';


		} else {


			prompts.push({
				type: 'input',
				name: 'pageName',
				message: 'Page name (profile-view)',
				validate: function (input) {
					return helperFns.validateRouteName(input);
				}
			});

			prompts.push({
				type: 'input',
				name: 'route',
				store: true,
				message: 'Route Path (main/user)',
				validate: function (input) {

					// need to check that this exists already
					return helperFns.validateRoute(input);
				}
			});
		}


		prompts.push({
			type: 'list',
			name: 'pageType',
			choices: this.allowedPages,
			message: "What kind of page would you like to generate?"
		});
		/*
			pageType == form prompts
		 */
		prompts.push({
			type: "checkbox",
			name: "enableFormTypes",
			message: "What sort of form routes should be enabled?",
			choices: ["edit", "add"],
			validate: function(input) {
				return input.length > 0
			},
			when: (answers) =>{
				return answers.pageType == 'form';
			}
		});
		prompts.push({
			type: 'input',
			name: 'serviceName',
			message: 'What service will this form page use? (UserService)',
			validate: function(input) {
				if(input.indexOf(".") !== -1 || input.indexOf("-") !== -1 || input.indexOf(" ") !== -1) {
					return "Your service name must be of the injectable sort: UserService"
				}
				if(input.indexOf("Service") === -1) {
					return "Your service name must have Service ending it: UserService"
				}
				return true;
			},
			when: (answers) =>{
				return answers.pageType == 'form';
			}
		});





		this.prompt(prompts, function (props) {
			this.props = props;

			this.pageType = props.pageType;

			this.pageName = this.options.pageName || props.pageName;
			this.route = this.options.route || props.route;
			
			this.enableEdit = props.enableFormTypes && props.enableFormTypes.indexOf("edit") !== -1 ? true : false;
			this.enableAdd = props.enableFormTypes  && props.enableFormTypes.indexOf("add") !== -1 ? true : false;
			this.serviceName = props.serviceName ? props.serviceName : "";

			done();
		}.bind(this));


	},

	writing: function () {

		var parentSegment;
		if(this.route) {
			parentSegment = this.route.indexOf("/") !== -1 ? this.route.split("/").pop() : this.route; // ports
		}

		var parentRouteName, routeFileName, fullPath;

		if(parentSegment) {
			parentRouteName = helperFns.join(parentSegment, this.pageName, "/"); // ports/view
			routeFileName = parentRouteName.replace(/\//g, "-"); // ports-view
			fullPath = helperFns.join(this.route, this.pageName, "/");
		} else {
			parentRouteName = this.pageName;
			routeFileName = this.pageName;
			fullPath = this.pageName;
		}


		var uiRoutePath = helperFns.join(this.route, this.pageName, "/").replace(/\//g, ".");

		var htmlParams = {
			routePath:  uiRoutePath, // modules.ports.view
			prettyRouteName: helperFns.makeDisplayNameWithSpace(uiRoutePath) // PortsView
		};
		var jsParams = {
			route: this.route,
			routeTemplateName: routeFileName,
			routeClassName: helperFns.makeDisplayName(parentRouteName.replace(/\//, '.')), //PortView
			routeUrl: this.pageName == 'index' ? "/" : "/" + this.pageName, // view
			routePath: uiRoutePath, // modules.ports.view
			breadcrumb: null,
			enableEdit: this.enableEdit,
			enableAdd: this.enableAdd,
			serviceName: this.serviceName

		};
		if(this.addBreadcrumb && this.pageName) {
			jsParams.breadcrumb = helperFns.makeDisplayNameWithSpace(this.pageName);
		}

		var routeFilePath;
		if(this.route) {
			routeFilePath =  path.join(this.route, this.pageName);
		} else {
			routeFilePath =  path.join(this.pageName);
		}

		/*
			We don't want to add the index page to the site route map because we're adding the route parent
		 */
		if(this.pageName !== "index") {
			var destPath = this.destinationPath(path.join("src", "ui", "app", "routes"));
			switch(this.pageType) {
				case "form":
					if(this.enableEdit) {
						helperFns.updateSiteMap(destPath,
							helperFns.join(this.route, "edit", "."),
							helperFns.makeDisplayNameWithSpace(  helperFns.join("edit",parentSegment,  ".")),
							false
						);
					}
					if(this.enableAdd) {
						helperFns.updateSiteMap(destPath,
							helperFns.join(this.route, "add", "."),
							helperFns.makeDisplayNameWithSpace(  helperFns.join("add", parentSegment, ".")));
					}
					break;

				default:
					helperFns.updateSiteMap(destPath, fullPath, helperFns.makeDisplayNameWithSpace(this.pageName));
			}

		}
		console.log("filepath", routeFilePath);

		this.fs.copyTpl(
			this.templatePath(path.join(this.pageType, this.pageType + '.html')),
			this.destinationPath(path.join("src", "ui", "app", "routes", routeFilePath, routeFileName + ".html")),
			htmlParams);
		this.fs.copyTpl(
			this.templatePath(path.join(this.pageType, this.pageType + '.page.js')),
			this.destinationPath(path.join("src", "ui", "app", "routes", routeFilePath, routeFileName + ".page.js")),
			jsParams);


	},
	install: function(){
		// This needs to be here because copyTpl is async and includes won't find new files if run
		// in the writing phase
		var done = this.async();
		var destPath = this.destinationPath(path.join("src", "ui", "app", "routes"));
		helperFns.generateGenericScssInclude(destPath, "routes");
		helperFns.generateGenericJsIncludes(destPath, done, "routes.js");
	}
});
