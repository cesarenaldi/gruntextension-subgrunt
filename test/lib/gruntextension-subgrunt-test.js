'use strict';

var expect = require('chai').expect,
	sinon = require('sinon'),
	injectr = require('injectr');

var GRUNTFILE = 'path/to/sub-gruntfile.js',
	MODULE_DIRNAME = '/path/to/project/path/to/shared/task/node_modules/gruntextension-subgrunt/lib',
	CWD = '/path/to/project',
	EXPECTED_SPAWN_PARAMS = {
		grunt: true,
		args: [
			'--gruntfile',
			'path/to/shared/task/node_modules/gruntextension-subgrunt/lib/runner.js',
			'--base',
			'/path/to/project',
			'--subgrunt=path/to/sub-gruntfile.js',
			'--params={"options":{"prop1":"value"},"filesSrc":[],"args":[]}'
		]
	};

describe('gruntextension-subgrunt#run', function () {

	var childProcess = {
			stdout: {
				pipe: sinon.spy()
			},
			stderr: {
				pipe: sinon.spy()
			}
		},

		task = {
			options: sinon.stub().returns({
				prop1: 'value'
			}),
			async: sinon.spy()
		},

		grunt = {
			util: {
				spawn: sinon.stub().callsArg(1).returns(childProcess)
			},
			task: {
				current: task
			},
			verbose: {
				writeln: function() {}
			}
		},

		process = {
			cwd: sinon.stub().returns(CWD),
			stdout: sinon.stub(),
			stderr: sinon.stub()
		},

		done = sinon.spy(),

		testObj = injectr('lib/gruntextension-subgrunt.js', {
			path: require('path'),
			grunt: grunt
		}, {
			process: process,
			__dirname: MODULE_DIRNAME,
			console: console
		});

	beforeEach(function() {
		done.reset()
		grunt.util.spawn.reset()
		childProcess.stdout.pipe.reset()
		childProcess.stderr.pipe.reset()
	})

	it('should retrieve parameters from the current task', function () {
		testObj.run(GRUNTFILE, done);

		expect(task.options).to.be.calledOnce;
	})

	it('should pass parameters and "done" callback into grunt.util.spawn', function() {
		testObj.run(GRUNTFILE, done);

		expect(grunt.util.spawn).to.be.calledWith(
			sinon.match(EXPECTED_SPAWN_PARAMS),
			sinon.match.any
		);
	})

	it('should call the "done" callback as soon as the child process exits', function() {
		testObj.run(GRUNTFILE, done);

		expect(done).to.be.calledOnce
	})

	it('should use grunt to create child grunt process', function() {
		testObj.run(GRUNTFILE, done);
		
		expect(grunt.util.spawn).to.be.calledOnce;
	})

	it('should connect stdout and stderr streams of the child process to the main process streams', function() {
		testObj.run(GRUNTFILE, done);

		expect(childProcess.stdout.pipe).to.be.calledOnce;
		expect(childProcess.stderr.pipe).to.be.calledOnce;
	})
})