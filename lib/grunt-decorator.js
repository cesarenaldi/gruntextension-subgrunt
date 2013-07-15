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

function loadNpmTasks(jp) {
	jp.proceed()
}

exports.decorate = function (grunt) {
	var remover = meld.around(grunt, 'loadNpmTasks', loadNpmTasks)
	grunt.loadNpmTasks.remove = remover.remove();
	// grunt.config.init = grunt.initConfig = meld.around(grunt.config.init, initConfig);
	
	// grunt.task.registerMultiTask = grunt.registerMultiTask = meld.around(grunt.task.registerMultiTask, registerMultiTask);
	// grunt.registerInitTask = meld.around(grunt.registerInitTask, registerInitTask);
};