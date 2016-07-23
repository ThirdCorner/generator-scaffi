'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var path = require('path');
var fs = require("fs");
var yosay = require('yosay');
var helperFns = require('../helpers/generatorFns');
var _ = require("lodash");

/*
	projectName: string
	authorName: string
	apiRoute: string
	
	uiLocalhostPort: number
	serverLocalhostPort: number
	
	variedIdName: true | false
	idName: string - Available if variedIdName is false
	tableNameStandard: singularCapital | pluralCapital | singularLower | pluralLower
	columnNameStandard: pascalCase | camelCase | lowerCase
    columnMultiWordStandard: none | underscore
    idCapitalizeStandard: lowerCase | pascalCase | upperCase
    routeLowercaseStandard: true | false
 */
module.exports = yeoman.Base.extend({
	initializing: function(){
		this.hasServer = false;
		this.hasUI = false;

		this.projectDetails = this.config.get("projectDetails") || null;

		this.defaultDataOptions = {
			variedIdName: false,
			idName: "id",
			tableNameStandard: "pascalCase",
			columnNameStandard: "pascalCase",
			columnMultiWordStandard: "none",
			idCapitalizeStandard: "pascalCase",
			routeLowercaseStandard: true,
			environment: "prototype"

		};


	},
	prompting: function () {
		var done = this.async();


		this.hasBothComponents = function(){
			return (this.hasServer && this.hasUI);
		};
		this.isNewSetup = function(){
			return !this.hasServer && !this.hasUI;
		};

		// Have Yeoman greet the user.
		this.log(yosay(
			chalk.green('Scaffi') + ' is here to the rescue!'
		));

		var prompts = [];

		/*
			Hack to get list with arrow keys working in cmd
		 */
		prompts.push({
			type: 'confirm',
			name: 'nonesense',
			message: 'You ready for it? \n(This is here till the list bug with inquirer is fixed)',
			default: 1,
			choices: ['Yes', 'Definitely'],
			filter: function(){
				return true;
			}
		});
		/*
		 Base start
		 */

		var mainOptions = [
			{name: "Config", value: "config"}
		];
		if(!this.hasBothComponents()) {
			mainOptions.unshift({name: "New Project/Add to Project", value: "add"});
		}
		prompts.push({
			type: 'list',
			name: 'mainOption',
			message: "What would you like to do?",
			choices: mainOptions
		});

		this._constructAddPrompts(prompts);
		this._constructConfigPrompts(prompts);

		var that = this;
		this.prompt(prompts, function (props) {
			that.mainOption = props.mainOption;

			_.each(props, function(value,key){
				that[key] = value;
			}, that);


			if(that.projectDetails == null){
				that.projectDetails = {};
				if(!that.customizeDataStructure) {
					_.each(that.defaultDataOptions, function(value,key){
						that.projectDetails[key] = value;
					}, that);
				}
			}

			_.each(props, function(value,key){
				that.projectDetails[key] = value;
			}, that);
			
			/*
				Need to make sure the route is in the right format
			 */

			if(that.projectDetails.apiRoute) {
				if(!_.startsWith(that.projectDetails.apiRoute, "/")){
					that.projectDetails.apiRoute = "/" + that.projectDetails.apiRoute;
				}

				if(!_.endsWith(that.projectDetails.apiRoute, "/")){
					that.projectDetails.apiRoute = that.projectDetails.apiRoute + '/';
				}

			}

			done();
		}.bind(this));



	},
	writing: function () {

		switch(this.mainOption){
			case "add":
				this._writeAddFiles();
				break;
			case "config":
				this._writeConfigFiles();
				break;
		}

	},
	_constructAddPrompts: function(prompts){


		var addOptions = [];
		if(!this.hasBothComponents()) {
			addOptions.push("Both");
		}
		if(!this.hasUI) {
			addOptions.push("UI")
		}
		if(!this.hasServer) {
			addOptions.push("Server");
		}

		prompts.push({
			type: 'list',
			message: 'What feature would you like to add?',
			name: 'addFeature',
			choices: addOptions,
			filter: function(value) {
				return value.toLowerCase();
			},
			when: function(answers){
				return answers.mainOption == "add";
			}
		});

		if(!this.projectDetails) {
			prompts.push({
				type: 'input',
				message: 'What\'s the name of this project?',
				name: 'projectName',
				validate: function(input){
					return input.length > 0;
				},
				when: function(answers){
					return answers.mainOption == "add";
				}
			});
			prompts.push({
				type: 'input',
				message: 'Who are you? (Who\'s the project author)',
				store: true,
				name: 'authorName',
				validate: function(input){
					return input.length > 0;
				},
				when: function(answers){
					return answers.mainOption == "add";
				}
			});

			prompts.push({
				type: 'input',
				message: 'What\'s the domain route that contains all your API calls? \nThis will look like domain.com/apiRoute/',
				store: true,
				default: "api",
				name: 'apiRoute',
				validate: function(input){
					if(input.indexOf(" ") !== -1) {
						return 'You cannot have spaces in your route name';
					}
					if(input.indexOf("\\") !== -1){
						return "You cannot use \\ in your api route name";
					}

					return input.length > 0;
				},
				filter: function(value){
					return value;
				},
				when: function(answers){
					return answers.mainOption == "add";
				}
			});
		}

		var isSettingUi = function(answers) {
			return answers.mainOption == "add" && (answers.addFeature == "both" || answers.addFeature == 'ui' )
		};
		var isSettingServer = function(answers) {
			return answers.mainOption == "add" && (answers.addFeature == "both" || answers.addFeature == 'server' )
		};

		/*
			UI Specific questions
		 */
		prompts.push({
			type: 'input',
			message: 'What\'s the localhost port you want to have your UI at?',
			name: 'uiLocalhostPort',
			default: 5000,
			validate: function(input){
				if(isNaN(input)) {
					return 'You must provide a valid number for your port.';
				}
				return input.length > 0;
			},
			when: function(answers){
				return isSettingUi(answers);
			}
		});


		/*
			Server Specific questions
		 */
		prompts.push({
			type: 'input',
			message: 'What\'s the localhost port you want to have your Server at?',
			name: 'serverLocalhostPort',
			default: 3000,
			validate: function(input){
				if(isNaN(input)) {
					return 'You must provide a valid number for your port.';
				}
				return input.length > 0;
			},
			when: function(answers){
				return isSettingServer(answers) ;
			}
		});

		/*
			Setup the data structures
		 */

		if(!this.projectDetails) {
			prompts.push({
				type: 'list',
				message: "Let's talk about your data structure between the frontend and backend. \nHow should we go about this?",
				name: 'customizeDataStructure',
				choices: [
					{
						name: "Give me the defaults!",
						value: false
					}, {
						name: "Customize all the things",
						value: true
					}],
				when: function (answers) {
					return answers.mainOption == "add";
				},

			});


			var isCustomizing = function (answers) {
				return answers.mainOption == "add" && answers.customizeDataStructure;
			};


			/*
			 For now, we're requiring standars throughout the system
			 */
			// prompts.push({
			// 	type: 'list',
			// 	message: "Can I use the same standards between both frontend and backend or must they be different?",
			// 	name: 'differentStandards',
			// 	options: ["Make them the same", "They need to be different (I don't want to use the standards of the thing I'm integrating with)"],
			// 	when: function(answers){
			// 		return  answers.mainOption == "add" && answers.customizeDataStructure;
			// 	}
			// });

			/*
			 If using standards
			 */
			prompts.push({
				type: 'list',
				message: "When referencing a record, do I always use the same naming convention, \n for instance 'id', or does the identifier property name change between tables/routes?",
				name: 'variedIdName',
				choices: [
					{
						name: "It's always standard",
						value: false
					}, {
						name: "It varies (You'll specify this whenever you make a service)",
						value: true
					}],
				when: function (answers) {
					return isCustomizing(answers);
				}
			});

			prompts.push({
				type: 'input',
				message: "What's the identifier name for any given record",
				name: 'idName',
				default: 'id',
				store: true,
				validation: function (value) {
					return value.length > 0;
				},
				when: function (answers) {
					return isCustomizing(answers) && !answers.variedIdName;
				}
			});


			prompts.push({
				type: 'list',
				message: "Let's say you have an accounts table, \nwhat's the naming convention I can expect?",
				name: 'tableNameStandard',
				choices: [{
					name: "Account (Singular Capital)",
					value: "singularCapital"
				}, {
					name: "Accounts (Plural Capital)",
					value: "pluralCapital"
				}, {
					name: "account (Singular Lowercase)",
					value: "singularLower"
				}, {
					name: "accounts (Plural Lowercase)",
					value: "pluralLower"
				}],
				when: function (answers) {
					return isCustomizing(answers);
				}
			});

			prompts.push({
				type: 'list',
				message: "Let's say you have a column called 'AccountNumber' in your accounts table. \nAre your column names, besides the id column, camelcase, pascalcase, or lowercase?",
				name: 'columnNameStandard',
				choices: [{
					name: "AccountNumber (Pascal Case)",
					value: "pascalCase"
				}, {
					name: "accountNumber (Camel Case)",
					value: "camelCase"
				}, {
					name: "accountnumber (Lowercase)",
					value: "lowerCase"
				}],
				when: function (answers) {
					return isCustomizing(answers);
				}
			});

			prompts.push({
				type: 'list',
				message: "How are multiple word columns handled?",
				name: 'columnMultiWordStandard',
				choices: [{
					name: "AccountNumber (Nothing)",
					value: "none"
				}, {
					name: "Account_Number (Underscore)",
					value: "underscore"
				}],
				when: function (answers) {
					return isCustomizing(answers);
				}
			});


			prompts.push({
				type: 'list',
				message: "Let's say you have a products table with a foreign key column linking \nto your accounts table. What's the casing strategy you use when adding a record identifier?",
				name: 'idCapitalizeStandard',
				choices: [
					{
						name: "Accountsid (Lowercase on the id portion)",
						value: "lowerCase"
					},
					{
						name: "AccountsId (Pascal on the id portion)",
						value: "pascalCase"
					},
					{
						name: "AccountsID (Uppercase on the id portion)",
						value: "upperCase"
					}
				],
				when: function (answers) {
					return isCustomizing(answers);
				}
			});

			prompts.push({
				type: 'list',
				message: "Let's say you picked Pascalcase for your table names. \nDo you want the api routes to match that or be lowercase?",
				name: 'routeLowercaseStandard',
				choices: [
					{
						name: "domain.com/api/Accounts/1 (Match casing)",
						value: false
					},
					{
						name: "domain.com/api/accounts/1 (All lowercase)",
						value: true
					}],
				when: function (answers) {
					return isCustomizing(answers);
				}
			});
		}

	},

	_constructConfigPrompts: function(prompts){

		prompts.push({
			type: 'list',
			message: 'What feature would you like to add?',
			name: 'addFeature',
			choices: ["Bro"],
			filter: function(value) {
				return value.toLowerCase();
			},
			when: function(answers){
				return answers.mainOption == "config";
			}
		});
	},

	_writeAddFiles: function(){

		try{
			if(!this.fs.exists(this.destinationPath(this.projectDetails.projectName))) {
				fs.mkdirSync(this.destinationPath(this.projectDetails.projectName));
			}

		} catch(e){
			console.log(e);
		}

		/*
			We want the project root level to be inside the project folder if not.
		 */
		if(path.basename(this.destinationPath()) !== this.projectDetails.projectName) {
			this.destinationRoot(this.destinationPath(this.projectDetails.projectName));
		}

		this._writeBase();

		switch(this.addFeature) {
			case "both":
				this._writeAddBoth();
				break;
			case "ui":
				this._writeAddUi();
				break;
			case "server":
				this._writeAddServer();
				break;
			default:
				throw new Error("You're adding a feature that doesn't exist:" + this.addFeature);
		}

		this.config.set("projectDetails", this.projectDetails);


		process.chdir(this.destinationPath());
		
		
		// Save root project config
		this.config.save();

	},
	_writeBase: function(){
		this.fs.copy(this.templatePath("base"), this.destinationPath());
		this.fs.move(this.destinationPath("_gitignore"), this.destinationPath(path.join(".gitignore")));
		this.fs.move(this.destinationPath("_gitconfig"), this.destinationPath(path.join(".gitconfig")));

	},
	_writeAddBoth: function(){

		this._writeAddUi();
		this._writeAddServer();
		
	},
	_writeAddServer: function(){

		var serverOptions = {};
		
		var serverRoute = path.join("src", "server");
		this.fs.copy(this.templatePath( path.join("server", "base")), this.destinationPath(serverRoute));
		
		// Copy some hidden files because this has to be done manually
		this.fs.move( this.destinationPath(path.join(serverRoute, "_gitignore")), this.destinationPath(path.join(serverRoute, ".gitignore")));
		
		var npmProjectName = helperFns.parseNpmName(this.projectDetails.projectName);
		this.fs.copyTpl(this.templatePath( path.join("server", "custom", "package.json")), this.destinationPath(path.join(serverRoute, "package.json")), {
			projectName: npmProjectName,
			projectDescription: `${this.projectDetails.projectName} Server Component`,
			projectAuthor: this.projectDetails.authorName
		});
		
		helperFns.updateConfig(this.destinationPath(path.join("src", "server")), "scaffi-server", this.projectDetails);
		helperFns.updatePrivateConfig(this.destinationPath(path.join("src", "server")), "scaffi-server.private", {environment: "localhost"});
		helperFns.updateServerComponents(this.destinationPath("src"), this.projectDetails);


	},
	_writeAddUi: function(){

		var uiRoute = path.join("src","ui");
		// // Copy all the static files
		this.fs.copy(this.templatePath( path.join("ui", "base")), this.destinationPath(uiRoute));


		// Copy some hidden files because this has to be done manually
		this.fs.move(this.destinationPath(path.join(uiRoute, "_gitignore")), this.destinationPath(path.join(uiRoute, ".gitignore")));
		this.fs.move( this.destinationPath(path.join(uiRoute,  "_htmlhintrc")), this.destinationPath(path.join(uiRoute,  ".htmlhintrc")));
		this.fs.move(this.destinationPath(path.join(uiRoute,  "_jshintignore")), this.destinationPath(path.join(uiRoute,  ".jshintignore")));
		this.fs.move( this.destinationPath(path.join(uiRoute,  "_jshintrc")), this.destinationPath(path.join(uiRoute,  ".jshintrc")));

		var npmProjectName = helperFns.parseNpmName(this.projectDetails.projectName);

		// Copy template files
		this.fs.copyTpl(this.templatePath( path.join("ui", "custom", "package.json")), this.destinationPath(path.join(uiRoute, "package.json")), {
			projectName: npmProjectName,
			projectDescription: `${this.projectDetails.projectName} UI Component`,
			projectAuthor: this.projectDetails.authorName
		});
		
		helperFns.updateConfig(this.destinationPath(path.join("src", "ui")), "scaffi-ui", this.projectDetails);
		helperFns.updatePrivateConfig(this.destinationPath(path.join("src", "ui")), "scaffi-ui.private", {environment: "localhost"});



	},
	install: function () {

		this.spawnCommandSync('npm', ['install'], {cwd: this.destinationPath('src', 'server')});
		this.spawnCommandSync('npm', ['install'], {cwd: this.destinationPath('src', 'ui')});
		

	},
	end: function(){
		if(this.addFeature == "both" || this.addFeature == "ui") {
			this.composeWith("scaffi:route", {options: {route: "index"}}, {local: require.resolve('../route')});
			this.composeWith("scaffi:theme", {}, {local: require.resolve('../theme')});
		}
	}
});
