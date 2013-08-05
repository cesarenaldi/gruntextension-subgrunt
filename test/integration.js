'use strict';

var expect = require('chai').expect,
	grunt = require('grunt');

describe('Integration', function () {
	it('should run test/fixtures/subGruntfile.js inside the root folder loading the required dependencies', function() {
		expect( grunt.file.exists('.tmp/dummy.txt') ).to.be.ok;
	})
})