'use strict';

var Bromise = require('bluebird');

/**
 * The Initializer helps to resolve all dependencies before
 * the actual application is kicker-off.
 * @constructor	
*/
var Initializer = function() {
	this.dependencies = [];
	console.log('new Initializer');
};

/**
 * Add a dependency
 * @param {Object} dependency - Promise to resolve
*/
Initializer.prototype.addDependency = function(dependency) {
	this.dependencies.push(dependency);
};

/**
 * When all dependencies are added, call this method
 * @returns {Object} - Combined promise of all its dependencies
*/
Initializer.prototype.initialize = function() {
	return Bromise.all(this.dependencies);
};

/**
 * Expose the Initializer (Singleton)
*/
module.exports = new Initializer();
