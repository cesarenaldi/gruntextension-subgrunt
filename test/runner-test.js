'use strict';

var expect = require('chai').expect
,	sinon = require('sinon')
,	vm = require('vm')
,	injectr = require('injectr');

var GRUNTFILE_PATH = 'path/to/gruntfile.js'
,	WORKING_DIR = 'path/to/the/main/project'
,	GRUNFILE_DIR = 'path/to'
,	SERIALIZED_PARAMS = '{"options":{},"filesSrc":[]}'
,	EXPECTED_PARAMS = {"options":{},"filesSrc":[]};

describe('runner', function () {

	var subgruntModule = sinon.spy()
	,	modules = {}
	,	process = {
			cwd: sinon.stub().returns(WORKING_DIR)
		}
	,	grunt = {
			option: sinon.stub()
		,	fail: {
				fatal: sinon.stub()
			}
		,	file: {
				setBase: sinon.spy()
			}
		}
	,	decorator = {
			decorate: sinon.spy()
		};

	modules['path'] = require('path');
	modules[GRUNTFILE_PATH] = subgruntModule;
	modules['grunt-decorator'] = decorator;

	// Note: path relative to the cwd
	var runner = injectr('lib/runner.js', modules, {
		process: process,
		console: console
	});

	grunt.option.withArgs('subgrunt').returns(GRUNTFILE_PATH)
	grunt.option.withArgs('params').returns(SERIALIZED_PARAMS)

	beforeEach(function() {
		subgruntModule.reset()
		grunt.fail.fatal.reset()
		grunt.file.setBase.reset()
	})
	
	it('should de-serialize the command line parameters', function() {
		runner(grunt)

		expect(grunt.option)
			.to.be.calledWith('params', EXPECTED_PARAMS)
	})

	it('should change the working directory to the directory of the specified Gruntfile', function () {
		runner(grunt)

		expect(grunt.file.setBase)
			.to.be.calledOnce
			.and.to.be.calledWith(GRUNFILE_DIR)
	})

	it('should load the specified Gruntfile and pass the grunt instance to it', function () {
		runner(grunt);

		expect(subgruntModule)
			.to.be.calledOnce
			.and.to.be.calledWith(grunt)
	})

	it('should decorate grunt before calling the subgrunt module', function() {
		runner(grunt);

		expect(decorator.decorate)
			.to.be.calledWith(sinon.match.same(grunt))
			.and.to.be.calledBefore(subgruntModule)
	})



	describe('when the Gruntfile path is missing', function() {
		
		before(function() {
			grunt.option.withArgs('subgrunt').returns(undefined)
		})

		it('should call grunt fail', function() {

			runner(grunt)

			expect(grunt.fail.fatal)
				.to.be.calledOnce
				.and.to.be.calledWith(sinon.match.string)
		})
	})
})