'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var builds = require('../helpers/builds');
var _ = require("lodash");
var path = require("path");

module.exports = yeoman.Base.extend({
	constructor: function(){
		yeoman.Base.apply(this, arguments);
		
		// This makes `appname` a required argument.
		this.argument('package', { type: String, required: true });
	},
	install: function () {

		var done = this.async();
		builds.installPackage(this, "ui", this.package ).then(done);

	}
});
