/*
 * grunt-replace-css
 * https://github.com/paipeng/grunt-replace-css
 *
 * Copyright (c) 2015 Pai Peng
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        copy: {
            main: {
                files: [
                    // includes files within path
                    {
                        expand: true,
                        src: ['index.html'],
                        dest: 'dist/',
                        filter: 'isFile'
                    }
                ]
            }
        },
        // Configuration to be run (and then tested).
        replace_css: {
            html_options: {
                options: {
                    prefix: '',
                    offset: 0,
                    remove_blank_lines: true,
                    replace: {selector: 'head', html: '<!-- css -->'}
                },
                files: {
                    'tmp/html_options': ['test/fixtures/index.html']
                }
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'replace_css', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
