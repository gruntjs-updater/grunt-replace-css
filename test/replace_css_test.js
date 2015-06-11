'use strict';

var grunt = require('grunt');

/*
 ======== A Handy Little Nodeunit Reference ========
 https://github.com/caolan/nodeunit

 Test methods:
 test.expect(numAssertions)
 test.done()
 Test assertions:
 test.ok(value, [message])
 test.equal(actual, expected, [message])
 test.notEqual(actual, expected, [message])
 test.deepEqual(actual, expected, [message])
 test.notDeepEqual(actual, expected, [message])
 test.strictEqual(actual, expected, [message])
 test.notStrictEqual(actual, expected, [message])
 test.throws(block, [error], [message])
 test.doesNotThrow(block, [error], [message])
 test.ifError(value)
 */

exports.replace_css = {
    setUp: function (done) {
        // setup here if necessary
        done();
    },
    html_options: function (test) {
        test.expect(2);

        var actual = grunt.file.read('tmp/html_options');
        var expected = grunt.file.read('test/expected/html_options');
        test.equal(actual, expected, 'should describe what the html option(s) behavior is.');

        //grunt.log.writeln("config " + grunt.config.get("css_filenames"));

        test.equal(JSON.stringify(grunt.config.get("css_filenames")),
            '["https://fast.fonts.net/cssapi/772638cf-801e-4331-a84b-2a0a3c7ff46b.css","/styles/bootstrap/css/bootstrap.min.css","/bower_components/font-awesome/css/font-awesome.min.css","/bower_components/leaflet/dist/leaflet.css","/styles/test.css","/styles/magnific-popup.css"]',
            "get css files should be same");

        test.done();
    }
};
