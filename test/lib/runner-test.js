'use strict';

var expect = require('chai').expect,
	sinon = require('sinon'),
	vm = require('vm'),
	injectr = require('injectr');

var WORKING_DIR = '/path/to/the/project',

	SERIALIZED_PARAMS = '{"options":{},"filesSrc":[]}',
	EXPECTED_PARAMS = {"options":{},"filesSrc":[]},

	SHARED_TASK_PACKAGE_PATH = '/path/to/the/project/path/to/the/shared/task/package.json',
	SHARED_TASK_DIR = '/path/to/the/project/path/to/the/shared/task',
	SHARED_TASK_SUBGRUNTFILE_PATH = '/path/to/the/project/path/to/the/shared/task/subfolder/subGruntfile.js',
	SHARED_TASK_SUBGRUNTFILE_DIR = '/path/to/the/project/path/to/the/shared/task/subfolder';

	

var subgruntModule = sinon.spy(),
	modules = {},
	process = {
		cwd: sinon.stub().returns(WORKING_DIR)
	},
	grunt = {
		option: sinon.stub(),
		fail: {
			fatal: sinon.spy()
		},
		file: {
			setBase: sinon.spy(),
			findup: sinon.stub(),
			isPathInCwd: sinon.stub(),
			isPathCwd: sinon.stub()
		}
	},
	decorator = {
		decorate: sinon.stub().returns(grunt)
	};

modules['path'] = require('path');
modules[SHARED_TASK_SUBGRUNTFILE_PATH] = subgruntModule;
modules['./grunt-decorator'] = decorator;

// Note: path relative to the cwd
var runner = injectr('lib/runner.js', modules, {
	process: process,
	console: console
});

grunt.option.withArgs('subgrunt').returns(SHARED_TASK_SUBGRUNTFILE_PATH)
grunt.option.withArgs('params').returns(SERIALIZED_PARAMS)

grunt.file.findup
	.withArgs('package.json', {
		cwd: SHARED_TASK_SUBGRUNTFILE_DIR,
		nocase: true
	})
	.returns(SHARED_TASK_PACKAGE_PATH);

grunt.file.isPathInCwd
	.withArgs(SHARED_TASK_DIR)
	.returns(true)


grunt.file.isPathCwd
	.withArgs(SHARED_TASK_DIR)
	.returns(true)

describe('runner', function () {

	before(function() {
		runner(grunt)
	})
	
	it('should de-serialize the command line parameters', function() {
		expect(grunt.option)
			.to.be.calledWith(sinon.match('params'), sinon.match(EXPECTED_PARAMS))
	})

	it('should lookup for the shared task root folder', function() {
		expect(grunt.file.findup)
			.to.be.calledWith(
				sinon.match('package.json'),
				sinon.match({
					cwd: SHARED_TASK_SUBGRUNTFILE_DIR,
					nocase: true
				})
			)
	})

	it('should decorate grunt before calling the subgrunt module', function() {
		expect(decorator.decorate)
			.to.be.calledWith(grunt, SHARED_TASK_DIR)
			.and.to.be.calledBefore(subgruntModule)
	})

	it('should load the specified Gruntfile and pass the grunt instance to it', function () {
		expect(subgruntModule)
			.to.be.calledOnce
			.and.to.be.calledWith(sinon.match(grunt))
	})

	describe('if the closest package root to the sub-gruntfile is outside the current working directory', function() {

		before(function() {
			grunt.fail.fatal.reset()
			grunt.file.isPathInCwd = sinon.stub().returns(false);
			grunt.file.isPathCwd = sinon.stub().returns(false);

			runner(grunt)
		})

		it('should fail the build because something is wrong in the way this library is used', function() {
			expect(grunt.fail.fatal)
				.to.be.calledOnce
				.and.to.be.calledWith(sinon.match.string)
		})
	})

	describe('when the Gruntfile path is missing', function() {
		
		before(function() {
			grunt.fail.fatal.reset()
			grunt.option.withArgs('subgrunt').returns(undefined)

			runner(grunt)
		})

		it('should call grunt fail', function() {
			expect(grunt.fail.fatal)
				.to.be.calledOnce
				.and.to.be.calledWith(sinon.match.string)
		})
	})
})