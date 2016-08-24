'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var helperFns = require('../helpers/generatorFns');
var path = require("path");



module.exports = yeoman.Base.extend({
	prompting: function () {
		var done = this.async();

		if(this.options.routeName) {
			if(helperFns.validateRoute(this.options.routeName)  !== true){
				throw new Error(helperFns.validateRoute(this.options.routeName));
			}
			if(this.options.route && helperFns.validateRoute(this.options.route)  !== true){
				throw new Error(helperFns.validateRoute(this.options.route));
			}
			this.routeName = this.options.routeName;
			this.route = this.options.route;
			done();
		} else {

			// Have Yeoman greet the user.
			this.log(yosay(
				chalk.green('Scaffi') + ' route time!'
			));

			var prompts = [
				{
					type: 'input',
					name: 'routeName',
					message: 'Route name? (add-products)',
					validate: function (input) {
						return helperFns.validateRoute(input);
					}
				},
				{
					type: 'confirm',
					name: 'isNested',
					message: 'Is this a nested route?',
					default: 0,
					choices: ['No', 'Yes']
				},
				{
					type: 'input',
					name: 'route',
					message: 'Where is this nested in? (main/user)',
					validate: function (input) {
						// chop off end / if there is one;
						input = input.replace(/.+[\/\\]$/, '');
						return helperFns.validateRoute(input);
					},
					when: (answers) =>{
						return answers.isNested === true;
					}
				}

			];

			this.prompt(prompts, function (props) {
				this.props = props;

				this.route = props.route;
				this.routeName = props.routeName;

				done();
			}.bind(this));

		}

	},

	writing: function () {
		

		if(this.route) {
			this.route = this.route.replace(/\\/g, '/');

		}

		var routeName = this.routeName; // user-profile;

		var fullRoute = this.route ? this.route + "/" + routeName : routeName;
		

		var jsParams = {
			routePath: fullRoute.replace(/\//g, "."), // main.user-profile
			routeClassName: helperFns.makeDisplayName(routeName), // UserProfile
			routeUrl: routeName, // user-profile,
			breadcrumbLabel: helperFns.makeDisplayNameWithSpace(routeName)
		};

		var destPath = this.destinationPath(path.join("src", "ui", "app", "routes"));

		console.log(destPath);
		helperFns.updateSiteMap(destPath, fullRoute, helperFns.makeDisplayNameWithSpace(routeName));
		
		if(this.routeName != "index") {
			var routeFilePath = this.route ? path.join(this.route, routeName) : routeName;
			this.fs.copyTpl(
				this.templatePath('route.js'),
				this.destinationPath(path.join("src", "ui", "app", "routes", routeFilePath, routeName + ".route.js")),
				jsParams);
		}

		
		
	},
	end: function(){
		var opts = { addBreadcrumb: false};
		if(this.routeName != "index") {
			opts.route = this.route ? this.route + "/" + this.routeName : this.routeName;
		}
		opts.pageName = "index";
		
		this.composeWith("scaffi:page", {options: opts}, {local: require.resolve('../page')} )
	}
});
