'use strict';

var Bromise = require('bluebird'),
		initializer = require('./initializer');

var deferredA = Bromise.defer(),
		deferredB = Bromise.defer();

initializer.addDependency(deferredA.promise);
initializer.addDependency(deferredB.promise);
initializer.initializer().then(function() {
	console.log('intialized');
});

deferredA.resolve();
deferredB.resolve();

