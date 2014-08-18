'use strict';

var util = require('util'),
		Bromise = require('bluebird'),
		EventEmitter = require('events').EventEmitter;

/**
 * The Initializer helps to resolve all dependencies before
 * the actual application is kicker-off.
 * @constructor	
*/
var Initializer = function() {
	this.dependencies = [];
};

util.inherits(Initializer, EventEmitter);

/**
 * Add a dependency
 * @param {String} name - Name for the dependency
 * @param {Object} dependency - Promise to resolve
*/
Initializer.prototype.addDependency = function(name, dependency) {
	if ( !name || !dependency ) {
		throw new Error('You need to specify the dependency itself and its name');
	}

	this.dependencies.push({
		name: name,
		promise: dependency
	});
};

/**
 * When all dependencies are added, call this method
 * @returns {Object} - Combined promise of all its dependencies
*/
Initializer.prototype.initialize = function() {
	var self = this;
	return Bromise.all(this.dependencies.map(function(dependency) {
		return dependency.promise;
	})).then(function() {
		self.emit('ready');
	}, function(reason) {
		self.emit('error', reason);
	});
};

/**
 * Expose the Initializer (Singleton)
*/
module.exports = new Initializer();
