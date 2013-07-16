'use strict';

var expect = require('chai').expect,
	sinon = require('sinon'),
	path = require('path');

var CWD = '/path/to/the/project',

	SHARED_TASK_SUBGRUNTFILE_PATH = '/path/to/the/project/path/to/the/shared/task/subfolder/subGruntfile.js',
	SHARED_TASK_PACKAGE_PATH = '/path/to/the/project/path/to/the/shared/task/package.json',
	
	DEPENDENCY_REQUESTED = 'test',
	DEPENDENCY_REQUESTED_PATH = '/path/to/the/project/node_modules/test',
	
	EXPECTED_SHARED_TASK_SUBGRUNT_DIR = '/path/to/the/project/path/to/the/shared/task/subfolder',
	EXPECTED_PATH_FOR_DEPENDENCY_FINDUP = '/path/to/the/project/path/to/the/shared/task',
	EXPECTED_DEPENDENCY_PATH = '/path/to/the/project/node_modules/test/tasks',
	EXPECTED_SHARED_TASK_PACKAGE_DIR = '/path/to/the/project/path/to/the/shared/task';

describe('grunt-decorator#decorate', function () {

	var process = {
			cwd: sinon.stub()
		},
		loadNpmTasksSpy = sinon.spy(),
		grunt = {
			loadNpmTasks: loadNpmTasksSpy,
			loadTasks: sinon.spy(),
			file: {
				findup: sinon.stub(),
				isPathInCwd: sinon.stub()
			},
			fail: {
				fatal: sinon.spy()
			}
		},
		testObj = require('../lib/grunt-decorator.js');

	it('should decorate grunt#loadNpmTasks', function () {
		grunt = testObj.decorate(grunt, SHARED_TASK_SUBGRUNTFILE_PATH)

		// if it has the remove method, it is our proxy function
		expect(grunt.loadNpmTasks).to.include.keys('remove')
		expect(grunt.loadNpmTasks.remove).to.be.instanceOf(Function)
	})

	it('should avoid to decorate grunt#loadNpmTasks again when called a second time', function() {
		var ref = grunt.loadNpmTasks;

		grunt = testObj.decorate(grunt, SHARED_TASK_SUBGRUNTFILE_PATH)

		expect(grunt.loadNpmTasks).to.be.equal(ref)
	})

	describe('the decorated grunt#loadNpmTasks', function() {

		before(function() {

			process.cwd.returns(CWD)

			grunt.file.findup
				.withArgs('package.json', {
					cwd: EXPECTED_SHARED_TASK_SUBGRUNT_DIR,
					nocase: true
				})
				.returns(SHARED_TASK_PACKAGE_PATH)
			grunt.file.findup
				.withArgs('node_modules/' + DEPENDENCY_REQUESTED, {
					cwd: EXPECTED_SHARED_TASK_PACKAGE_DIR,
					nocase: true
				})
				.returns(DEPENDENCY_REQUESTED_PATH)
			grunt.file.isPathInCwd
				.withArgs(EXPECTED_SHARED_TASK_PACKAGE_DIR)
				.returns(true)
		})

		it('should load the required dependency using the shared task dependencies', function() {

			// (i.e. the dependencie defined in the closest package.json file to the sub-gruntfile)
			
			grunt.loadNpmTasks(DEPENDENCY_REQUESTED)
			
			expect(grunt.file.findup)
				.to.be.calledWith(
					'package.json', 
					{cwd: EXPECTED_SHARED_TASK_SUBGRUNT_DIR, nocase: true}
				)
			expect(grunt.file.findup)
				.to.be.calledWith(
					'node_modules/' + DEPENDENCY_REQUESTED,
					{cwd: EXPECTED_SHARED_TASK_PACKAGE_DIR, nocase: true}
				)
			expect(grunt.loadTasks)
				.to.be.calledWith(EXPECTED_DEPENDENCY_PATH)
		})

		describe('if the closest package root to the sub-gruntfile is outside the current working directory', function() {

			beforeEach(function() {
				grunt.fail.fatal.reset()
				grunt.file.isPathInCwd = sinon.stub().returns(false)
			})

			it('should fail the build because something is wrong in the way this library is used', function() {

				grunt.loadNpmTasks(DEPENDENCY_REQUESTED)

				expect(grunt.fail.fatal)
					.to.be.calledOnce
					.and.to.be.calledWith(sinon.match.string)
			})
		})

		describe('if the requested grunt module is not available', function() {

			before(function() {
				grunt.fail.fatal.reset()
				grunt.file.isPathInCwd = sinon.stub().returns(true)
				grunt.file.findup = sinon.stub()
					.withArgs('node_modules/' + DEPENDENCY_REQUESTED, sinon.match.any)
					.returns(null)
			})

			it('should fail the build', function() {

				grunt.loadNpmTasks(DEPENDENCY_REQUESTED)

				expect(grunt.fail.fatal)
					.to.be.calledOnce
					.and.to.be.calledWith(sinon.match.string)
			})
		})
	})
})