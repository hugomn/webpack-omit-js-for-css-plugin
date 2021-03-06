const OmitJSforCSSPlugin = require('../src/index.js');
const expect = require('chai').expect;
const assert = require('chai').assert;
const stdout = require('test-console').stdout;
const rimraf = require('rimraf');
const webpack = require('webpack');
const fileShouldExist = require('./utils/file-should-exist.js');
const fileShouldNotExist = require('./utils/file-should-not-exist.js');
const path = require('path');

const previewOptions = require('./fixtures/options/preview/webpack.config.js');
const previewDirPath = path.join(__dirname, '/fixtures/options/preview/dir');

const verboseOptions = require('./fixtures/options/verbose/webpack.config.js');
const verboseDirPath = path.join(__dirname, '/fixtures/options/verbose/dir');

describe('Options', () => {
	describe('Argument', () => {
		it('should throw if an invalid argument is passed', done => {
			const errorMsg = 'OmitJSforCSSPlugin only takes an options "object" as an argument';
			expect(() => {
				new OmitJSforCSSPlugin(5);
			}).to.throw(errorMsg);
			expect(() => {
				new OmitJSforCSSPlugin('verbose');
			}).to.throw(errorMsg);
			expect(() => {
				new OmitJSforCSSPlugin(null);
			}).to.throw(errorMsg);
			expect(() => {
				new OmitJSforCSSPlugin([]);
			}).to.throw(errorMsg);
			done();
		});

		it('should not throw if a correct argument is passed', done => {
			expect(() => {
				new OmitJSforCSSPlugin({});
			}).to.not.throw();
			done();
		});
	});

	describe('Preview', () => {
		beforeEach(done => {
			rimraf(previewDirPath, () => {
				done();
			});
		});

		it('should display the files that would be omitted', done => {
			let inspect = stdout.inspect();

			webpack(previewOptions, () => {
				inspect.restore();

				assert.deepEqual(inspect.output, [
					'PREVIEW File to be omitted for b : b.js\n',
					'PREVIEW File to be omitted for b : b.js.map\n'
				]);

				done();
			});
		});

		it('should not omit files', done => {
			let ignore = stdout.ignore();
			webpack(previewOptions, () => {
				ignore();
				fileShouldExist(previewDirPath, 'b.js');
				fileShouldExist(previewDirPath, 'b.js.map');
				done();
			});
		});
	});

	describe('Verbose', () => {
		before(done => {
			rimraf(verboseDirPath, () => {
				done();
			});
		});

		it('should display the files that are omitted to console', done => {
			let inspect = stdout.inspect();

			webpack(verboseOptions, () => {
				inspect.restore();

				assert.deepEqual(inspect.output, [
					'File omitted for b : b.js\n',
					'File omitted for b : b.js.map\n'
				]);

				done();
			});
		});
	});

});
