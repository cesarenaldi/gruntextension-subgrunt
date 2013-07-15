'use strict';

var expect = require('chai').expect,
	sinon = require('sinon'),
	path = require('path');

var CWD = '/path/to/the/project',
	TASK_PACKAGE_PATH = '/path/to/the/project/path/to/the/shared/task/package.json',
	TASK_SUBGRUNTFILE_PATH = '/path/to/the/project/path/to/the/shared/task/subfolder/subGruntfile.js',
	TASK_PACKAGE = {
		keywords: ['gruntsubgrunt'],
		dependencies: {}
	},
	EXPECTED_CWD_FOR_FINDUP = '/path/to/the/project/path/to/the/shared/task/subfolder';

describe('grunt-decorator#decorate', function () {

	var process = {
			cwd: sinon.stub().returns(CWD)
		},
		grunt = {
			loadNpmTasks: sinon.spy(),
			loadTasks: sinon.spy(),
			file: {
				exists: sinon.stub(),
				readJSON: sinon.stub(),
				findup: sinon.stub()
			}
		},
		requireStub = function(name) {
			return require(name)
		},
		testObj = require('../lib/grunt-decorator.js'),

		loadNpmTasks;

	beforeEach(function() {
		grunt.loadNpmTasks = sinon.spy()
		grunt.file.exists.returns(true)
		grunt.file.readJSON.returns(TASK_PACKAGE)
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

	describe('when calling grunt#loadNpmTasks after decoration', function() {

		before(function() {
			
			grunt.file.findup
				.withArgs('package.json', {cwd: EXPECTED_CWD_FOR_FINDUP, nocase: true})
				.returns(TASK_PACKAGE_PATH)
		})

		it('should load the task package.json file (i.e. the closest package.json file to the sub Gruntfile)', function() {
			var vm = require('vm');

			vm.runInNewContext('testObj.decorate(grunt, TASK_SUBGRUNTFILE_PATH);', {
				testObj: testObj,
				grunt: grunt,
				TASK_SUBGRUNTFILE_PATH: TASK_SUBGRUNTFILE_PATH
			});

			grunt.loadNpmTasks('test')

			expect(grunt.file.findup).to.be.calledWith('package.json', {cwd: EXPECTED_CWD_FOR_FINDUP, nocase: true})
			expect(grunt.file.exists).to.be.calledWith(path.join(WORKING_DIR, 'package.json'))
		})

		describe('and if it is available', function() {

			before(function() {
				grunt.file.findup
					.withArgs('package.json', {cwd: EXPECTED_CWD_FOR_FINDUP, nocase: true})
					.returns(TASK_PACKAGE_PATH)
			})

			it('should lookup for dependencies', function() {
				expect(false).to.be.ok
			})
		})
	})
})