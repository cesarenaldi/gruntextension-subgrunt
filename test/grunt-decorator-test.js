'use strict';

var expect = require('chai').expect,
	sinon = require('sinon'),
	path = require('path');

var CWD = '/path/to/the/project',

	TASK_PACKAGE_PATH = '/path/to/the/project/path/to/the/shared/task/package.json',
	TASK_SUBGRUNTFILE_PATH = '/path/to/the/project/path/to/the/shared/task/subfolder/subGruntfile.js',
	// TASK_PACKAGE = {
	// 	keywords: ['gruntsubgrunt'],
	// 	dependencies: {}
	// },
	DEPENDENCY_TASK_PATH = '/path/to/the/project/node_modules/test',
	EXPECTED_DEPENDENCY_TASK_PATH = '/path/to/the/project/node_modules/test/tasks',
	EXPECTED_PACKAGE_JSON_PATH = '/path/to/the/project/path/to/the/shared/task/subfolder',
	EXPECTED_TASK_PATH = '/path/to/the/project/path/to/the/shared/task';

describe('grunt-decorator#decorate', function () {

	var process = {
			cwd: sinon.stub().returns(CWD)
		},
		grunt = {
			loadNpmTasks: sinon.spy(),
			loadTasks: sinon.spy(),
			file: {
				// exists: sinon.stub(),
				// readJSON: sinon.stub(),
				findup: sinon.stub()
			},
			fail: {
				fatal: sinon.spy()
			}
		},
		requireStub = function(name) {
			return require(name)
		},
		testObj = require('../lib/grunt-decorator.js'),

		loadNpmTasks;

	beforeEach(function() {
		grunt.loadNpmTasks = sinon.spy()
		// grunt.file.exists.returns(true)
		// grunt.file.readJSON.returns(TASK_PACKAGE)
	})

	it('should decorate grunt#loadNpmTasks', function () {
		testObj.decorate(grunt, TASK_SUBGRUNTFILE_PATH)

		// if it has the remove method, it is our proxy function
		expect(grunt.loadNpmTasks).to.include.keys('remove')
		expect(grunt.loadNpmTasks.remove).to.be.instanceOf(Function)
	})

	it('should avoid to decorate grunt#loadNpmTasks again when called a second time', function() {
		var ref;
		testObj.decorate(grunt, TASK_SUBGRUNTFILE_PATH)
		ref = grunt.loadNpmTasks;

		testObj.decorate(grunt)

		expect(grunt.loadNpmTasks).to.be.equal(ref)
	})

	describe('then the decorated grunt#loadNpmTasks', function() {

		before(function() {

			grunt.file.findup
				.withArgs('package.json', {cwd: EXPECTED_PACKAGE_JSON_PATH, nocase: true})
				.returns(TASK_PACKAGE_PATH)
		})

		it('should find the task package.json file (i.e. the closest package.json file to the sub Gruntfile)', function() {

			testObj.decorate(grunt, TASK_SUBGRUNTFILE_PATH)

			grunt.loadNpmTasks('test')

			expect(grunt.file.findup).to.be.calledWith('package.json', {cwd: EXPECTED_PACKAGE_JSON_PATH, nocase: true})
		})

		describe('if the closest package.json file is not inside a sub-folder of the current working directory', function() {

			before(function() {
				grunt.file.findup.returns(TASK_PACKAGE_PATH)
			})

			it('should fail the build (i.e. something is wrong in the way this library is used)', function() {

				grunt.loadNpmTasks('test')

				expect(grunt.fail.fatal)
					.to.be.calledOnce
					.and.to.be.calledWith(sinon.match.string)
			})
		})

		describe('otherwise', function() {

			before(function() {
				grunt.file.findup.returns(DEPENDENCY_TASK_PATH);
			})

			it('should lookup the required task dependency from the task directory', function() {
				testObj.decorate(grunt, TASK_SUBGRUNTFILE_PATH)

				grunt.loadNpmTasks('test')

				expect(grunt.file.findup)
					.to.be.calledWith(
						'node_modules/test',
						{cwd: EXPECTED_TASK_PATH, nocase: true}
					)
			})

			it('should load tasks inside that package', function() {
				grunt.loadNpmTasks('test')

				expect(grunt.loadTasks).to.be.calledWith(EXPECTED_DEPENDENCY_TASK_PATH)
			})
		})
	})
})