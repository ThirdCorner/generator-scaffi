'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');

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
		if(this.options.route) {
			if(helperFns.validateRoute(this.options.route) !== true) {
				throw new Error(helperFns.validateRoute(this.options.route));
			}

			var splits = this.options.route.split(".");
			this.routeName = splits.pop();
			this.route = splits.join(".");
			this.pageType = 'basic';
			done();

		} else {
			prompts = [

				{
					type: 'input',
					name: 'route',
					store: true,
					message: 'Route Path (main.user)',
					validate: function(input) {

						// need to check that this exists already
						return helperFns.validateRoute(input);
					}
				},
				{
					type: 'list',
					name: 'pageType',
					choices: this.allowedPages,
					message: "What kind of page would you like to generate?"
				},
				/*
					pageType == basic prompts
				 */
				{
					type: 'input',
					name: 'routeName',
					message: 'Route page (profile-view)',
					validate: function(input) {
						return helperFns.validateRouteName(input);
					},
					when: (answers) =>{
						return answers.pageType !== 'form';
					}
				},
				/*
					pageType == form prompts
				 */
				{
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
				},
				{
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
				}



			];
			this.prompt(prompts, function (props) {
				this.props = props;

				this.pageType = props.pageType;
				this.route = props.route;
				this.routeName = props.routeName ? props.routeName : props.pageType;
				this.enableEdit = props.enableFormTypes && props.enableFormTypes.indexOf("edit") !== -1 ? true : false;
				this.enableAdd = props.enableFormTypes  && props.enableFormTypes.indexOf("add") !== -1 ? true : false;
				this.serviceName = props.serviceName ? props.serviceName : "";



				done();
			}.bind(this));
		}

	},

	writing: function () {

		var parentSegment = this.route.indexOf(".") !== -1 ? this.route.split(".").pop() : this.route; // ports

		var parentRouteName, routeFileName, fullPath;

		if(parentSegment) {
			parentRouteName = helperFns.join(parentSegment, this.routeName, "."); // ports.view
			routeFileName = parentRouteName.replace(".", "-"); // ports-view
			fullPath = helperFns.join(this.route, this.routeName, ".");
		} else {
			parentRouteName = this.routeName;
			routeFileName = this.routeName;
			fullPath = this.routeName;
		}


		var htmlParams = {
			routePath: this.route ? helperFns.join(this.route, this.routeName, ".") : this.routeName, // modules.ports.view
			prettyRouteName: helperFns.makeDisplayNameWithSpace(this.routeName) // PortsView
		};
		var jsParams = {
			route: this.route,
			routeTemplateName: routeFileName,
			routeClassName: helperFns.makeDisplayName(parentRouteName), //PortView
			routeUrl: this.routeName == 'index' ? "/" : "/" + this.routeName, // view
			routePath: this.route ? helperFns.join(this.route, this.routeName, ".") : this.routeName, // modules.ports.view
			breadcrumb: null,
			enableEdit: this.enableEdit,
			enableAdd: this.enableAdd,
			serviceName: this.serviceName

		};
		if(this.addBreadcrumb && this.routeName) {
			jsParams.breadcrumb = helperFns.makeDisplayNameWithSpace(this.routeName);
		}

		var routeFilePath;
		if(this.route) {
			routeFilePath =  helperFns.join(this.route, this.routeName, ".").replace(".", "/") + "/";
		} else {
			routeFilePath =  this.routeName + "/";
		}

		/*
			We don't want to add the index page to the site route map because we're adding the route parent
		 */
		if(this.routeName !== "index") {
			var destPath = this.destinationPath('ui/src/app/routes/');
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
					helperFns.updateSiteMap(destPath, fullPath, helperFns.makeDisplayNameWithSpace(this.routeName));
			}

		}

		this.fs.copyTpl(
			this.templatePath(this.pageType + '/' + this.pageType + '.html'),
			this.destinationPath("ui/src/app/routes/" + routeFilePath + routeFileName + ".html"),
			htmlParams);
		this.fs.copyTpl(
			this.templatePath(this.pageType + '/' + this.pageType + '.page.js'),
			this.destinationPath("ui/src/app/routes/" + routeFilePath + routeFileName + ".page.js"),
			jsParams);


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
