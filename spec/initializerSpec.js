'use strict';

var Bromise = require('bluebird'),
		initializer = require('./../lib/initializer');

describe('initializer', function() {
	beforeEach(function() {
		initializer.dependencies = [];
	});

	describe('addDependency', function() {
		it('can add a dependency', function() {
			initializer.addDependency('Load xyz', Bromise.defer().promise);
			expect(initializer.dependencies.length).toBe(1);
		});

		it('throws exception if wrong arguments are given', function() {
			var noName = function() {
				initializer.addDependency(Bromise.defer().promise);
			};

			var noDependency = function() {
				initializer.addDependency('Load xyz');
			};

			var noArguments = function() {
				initializer.addDependency();
			};

			expect(noName).toThrow(new Error('You need to specify the dependency itself and its name'));
			expect(noArguments).toThrow(new Error('You need to specify the dependency itself and its name'));
			expect(noDependency).toThrow(new Error('You need to specify the dependency itself and its name'));
			expect(initializer.dependencies.length).toBe(0);
		});
	});

	describe('initialize', function() {
		it('emits "ready" event', function(){
			var wasCalled = false, 
					dependency = Bromise.defer();

			initializer.addDependency('Load xyz', dependency.promise);
			initializer.on('ready', function() {
					wasCalled = true;
			});

			dependency.resolve();
			initializer.initialize();

			waitsFor(function() {
				return wasCalled;
			}, 'ready event was not emitted', 100);
		});

		it('emits "error" event', function() {
			var error,
					wasCalled = false,
					dependency = Bromise.defer();

			initializer.addDependency('Load xyz', dependency.promise);
			initializer.on('error', function(err) {
					wasCalled = true;
					error = err;
			});

			dependency.reject('dependency was rejected');
			initializer.initialize();

			waitsFor(function() {
				return wasCalled;
			}, 'error event was not emitted', 100);

			runs(function() {
				expect(error).toBe('dependency was rejected');
			});
		});

		it('waits for all dependencies', function() {
			var wasCalled = false,
					dependencyA = Bromise.defer(),
					dependencyB = Bromise.defer();

			initializer.addDependency('A', dependencyA);
			initializer.addDependency('B', dependencyB);
			dependencyA.resolve();

			runs(function() {
				initializer.initialize().then(function() {
					wasCalled = true;
				});
			});
			
			waitsFor(function() {
				return !wasCalled;
			}, 'did not wait for all dependencies', 100);
		});

		it('returns joined promise of all dependencies', function() {
			var wasCalled = false,
					dependencyA = Bromise.defer(),
					dependencyB = Bromise.defer();

			initializer.addDependency('A', dependencyA);
			initializer.addDependency('B', dependencyB);
			dependencyA.resolve();
			dependencyB.resolve();

			runs(function() {
				initializer.initialize().then(function() {
					wasCalled = true;
				});
			});
			
			waitsFor(function() {
				return wasCalled;
			}, 'did not init when all dependencies were resolved', 100);
		});
	});
});