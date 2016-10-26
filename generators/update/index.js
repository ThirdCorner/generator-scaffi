'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var helperFns = require('../helpers/generatorFns');
var _ = require("lodash");
var path = require("path");

module.exports = yeoman.Base.extend({
	constructor: function(){
		yeoman.Base.apply(this, arguments);

		this.version = this.config.get("structureVersion") || 0;

		console.log(typeof this.version, this.version)

	},
	writing: function(){
		console.log("#", this._getUpgrades());
		if(this.version >= this._getUpgrades().length) {
			this.log("No upgrade needed. You're on structure version #" + this.version);
		} else {
			this._processUpgrade();
		}
		this.config.save();
	},
	_processUpgrade: function(){
		var failure = false, currentVersion = this.version;
		for(var i = currentVersion; i < this._getUpgrades().length && failure === false; i++) {

			this.log("Upgrading to version # " + (currentVersion+1));
			var upgrade = this._getUpgrades()[currentVersion];
			failure = !upgrade();

			if(failure === false) {
				currentVersion = currentVersion + 1;
			}
		}

		this.config.set("structureVersion", currentVersion);

	},
	_getUpgrades: function(){
		
		return helperFns.getUpgrades(this);
	}
});
