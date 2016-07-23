'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var helperFns = require('../helpers/generatorFns');
var path = require("path");



module.exports = yeoman.Base.extend({
	prompting: function () {
		var done = this.async();

		if(this.options.route) {
			if(helperFns.validateRoute(this.options.route)  !== true){
				throw new Error(helperFns.validateRoute(this.options.route));
			}
			this.route = this.options.route;
			done();
		} else {

			// Have Yeoman greet the user.
			this.log(yosay(
				chalk.green('Scaffi') + ' route time!'
			));

			var prompts = [{
				type: 'input',
				name: 'route',
				message: 'What\'s your full route going to be? If this is a sub-route, include any nesting. (main.user.profile)',
				validate: function (input) {
					return helperFns.validateRoute(input);
				}
			}

			];

			this.prompt(prompts, function (props) {
				this.props = props;

				this.route = props.route;

				done();
			}.bind(this));

		}

	},

	writing: function () {

		var routeName = this.route.indexOf(".") !== -1 ? this.route.split(".").pop() : this.route; // user-profile;


		var jsParams = {
			routePath: this.route, // main.user-profile
			routeClassName: helperFns.makeDisplayName(routeName), // UserProfile
			routeUrl: routeName, // user-profile,
			breadcrumbLabel: helperFns.makeDisplayNameWithSpace(routeName)
		};

		var routeFilePath = path.join(this.route.replace(".", "/"), routeName);

		var destPath = this.destinationPath(path.join("src", "ui", "app", "routes"));
		helperFns.updateSiteMap(destPath, this.route, helperFns.makeDisplayNameWithSpace(routeName));
		
		if(this.route != "index") {
			this.fs.copyTpl(
				this.templatePath('route.js'),
				this.destinationPath(path.join("src", "ui", "app", "routes", routeFilePath +".route.js")),
				jsParams);
		}

		
		
	},
	end: function(){
		var opts = { addBreadcrumb: false};
		if(this.route == "index") {
			opts.route = "index";
		} else {
			opts.route = helperFns.join(this.route, "index", ".");
		}
		this.composeWith("scaffi:page", {options: opts}, {local: require.resolve('../page')} )
	}
});
