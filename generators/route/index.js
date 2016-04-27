'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var helperFns = require('../helpers/generatorFns');



module.exports = yeoman.Base.extend({
	prompting: function () {
		var done = this.async();

		// Have Yeoman greet the user.
		this.log(yosay(
			chalk.green('Scaffi') + ' route time!'
		));

		if(this.options.route) {
			if(helperFns.validateRoute(this.options.route)  !== true){
				throw new Error(helperFns.validateRoute(this.options.route));
			}
			this.route = this.options.route;
			done();
		} else {
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
			
			var routeFilePath = this.route.replace(".", "/") + "/";
			
			var destPath = this.destinationPath('ui/src/app/routes/');
			helperFns.updateSiteMap(destPath, this.route, helperFns.makeDisplayNameWithSpace(routeName));
		if(this.route != "index") {
			this.fs.copyTpl(
				this.templatePath('route.js'),
				this.destinationPath("ui/src/app/routes/" + routeFilePath + routeName + ".route.js"),
				jsParams);
		}

		var opts = { addBreadcrumb: false};
		if(this.route == "index") {
			opts.route = "index";
		} else {
			opts.route = helperFns.join(this.route, "index", ".");
		}
		this.composeWith("scaffi:page", {options: opts}, {local: require.resolve('../page')} )
	}
});
