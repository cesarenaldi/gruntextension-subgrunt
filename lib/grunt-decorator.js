/*
 * Grunt decorator.
 *
 * Copyright (c) 2013 Cesare Naldi
 * Licensed under the MIT license.
 */

'use strict';

var meld = require('meld')
,	util = require('util')
,	path = require('path');

function buildLoadNpmTasksAdvice(subGruntfile) {
	return function(jp) {
		var callerTaskPackagePath = this.file.findup('package.json', {
				cwd: path.dirname(subGruntfile)
			,	nocase: true
			})
		,	depName = jp.args[0]
		,	callerTaskPath, module, modulePath;

		callerTaskPath = path.dirname(callerTaskPackagePath);

		if ( ! this.file.isPathInCwd(callerTaskPath) ) {
			return this.fail.fatal('Invalid use of the extension, check the documentation.')
		}

		module = this.file.findup(path.join('node_modules', depName), {
			cwd: callerTaskPath,
			nocase: true
		});

		if ( module === null ) {
			return this.fail.fatal('Local Npm module "' + module + '" not found. Is it installed?')
		}

		modulePath = path.join(module, 'tasks');

		this.loadTasks(modulePath)

		jp.proceed()
	}
}

exports.decorate = function (grunt, subGruntfile) {
	var remover;

	if (grunt.loadNpmTasks.remove) {
		return grunt;
	}

	remover = meld.around(grunt, 'loadNpmTasks', buildLoadNpmTasksAdvice(subGruntfile));
	grunt.loadNpmTasks.remove = remover.remove;

	return grunt
};