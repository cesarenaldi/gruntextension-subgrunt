'use strict';

var expect = require('chai').expect,
	sinon = require('sinon');

var GRUNTFILE = 'path/to/gruntfile.js',
	EXPECTED_ARGS = [
		'--gruntfile',
		'path/to/runner.js',
		'--base',
		'path/to/project',
		'--subgrunt=path/to/subgruntfile',
		'--params=\'{"options":{"tasks":[]},"filesSrc":[]\''
	];

describe('gruntextension-subgrunt#run', function () {

	var testObj = require('../lib/gruntextension-subgrunt'),
		grunt, task, process, done;

	beforeEach(function() {

		done = sinon.spy();

		process = {
			stdout: {
				pipe: sinon.spy()
			},
			stderr: {
				pipe: sinon.spy()
			}
		};

		task = {
			options: sinon.stub().returns({
				tasks: []
			}),
			async: sinon.stub().returns(done)
		};

		grunt = {
			util: {
				spawn: sinon.stub().callsArg(1).returns(process)
			},
			task: {
				current: task
			}
		};
	})

	it('should retrieve parameters from the given task', function () {
		testObj.run(grunt, GRUNTFILE, done);

		expect(task.options).to.be.calledOnce;
		expect(task.async).to.be.calledOnce;
	})

	it('should pass parameters and "done" callback into grunt.util.spawn', function() {
		testObj.run(grunt, GRUNTFILE, done);

		expect(grunt.util.spawn).to.be.calledWith(
			sinon.match(EXPECTED_ARGS),
			sinon.match.same(done)
		);
	})

	it('should call the "done" callback as soon as the child process exits', function() {
		testObj.run(grunt, GRUNTFILE, done);

		expect(done).to.be.calledOnce
	})

	it('should use grunt to create child grunt process', function() {
		testObj.run(grunt, GRUNTFILE, done);
		
		expect(grunt.util.spawn).to.be.calledOnce;
	})

	it('should connect stdout and stderr streams of the child process to the main process streams', function() {
		var vm = require('vm');

		vm.runInNewContext('testObj.run(grunt, GRUNTFILE, done);', {
			process: process,
			testObj: testObj,
			grunt: grunt,
			task: task,
			GRUNTFILE: GRUNTFILE,
			done: done
		});

		expect(process.stdout.pipe).to.be.calledOnce;
		expect(process.stderr.pipe).to.be.calledOnce;
	})
})