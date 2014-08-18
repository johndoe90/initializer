'use strict';

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		watch: {
			scripts: {
				files: ['lib/**/*.js', 'spec/**/*.js'],
				tasks: ['jshint', 'jasmine_node']
			}
		},

		jshint: {
			all: [
				'Gruntfile.js',
				'lib/**/*.js'
			],
			options: {
				node: true,
				esnext: true
			}
		},

		jasmine_node: {
			options: {
			  match: '.',
			  matchall: false,
			  specNameMatcher: 'spec',
			  helperNameMatcher: 'helpers',
			  extensions: 'js',
			  showColors: true,
			  includeStackTrace: true,
			  useHelpers: false,
			  teamcity: false,
			  coffee: false,
			  jUnit: {
			    report: false,
			    savePath : "./reports/",
			    useDotNotation: true,
			    consolidate: true
			  }
			},
			all: ['spec/']
		}
	});

  grunt.registerTask('default', ['jshint', 'jasmine_node', 'watch']);
};
