/*
 * grunt-replace-css
 * https://github.com/paipeng/grunt-replace-css
 *
 * Copyright (c) 2015 Pai Peng
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    var multilineTrim = function (htmlString) {
        // split the string into an array by line separator
        var arr = htmlString.split("\n");
        // call $.trim on each line
        arr = arr.map(function (val) {
            if (val.trim() === "") {
                return val.trim();
            } else {
                return val;
            }
        });
        // filter out the empty lines
        arr = arr.filter(function (line) {
                return line != ""
            }
        );
        // join the array of lines back into a string
        return arr.join("\n");
    }
    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks
    var removeHTMLCode = function (dest, matchArray, replace, remove_blank_lines, $) {
        grunt.log.subhead('Processing ' + dest.cyan);

        matchArray.forEach(function (option) {
            //console.log("remove " + JSON.stringify(option));
            if (!option.selector || !option.attribute || !option.value) {
                grunt.log.error('remove config missing selector, attribute, and/or value options');
            } else {
                $(option.selector).map(function (i, elem) {
                    if ($(elem).attr(option.attribute) === option.value) {
                        $(elem).remove();
                    }
                });
            }
        });

        if (!replace.selector || !replace.html) {
            grunt.log.error('replace config missing selector, attribute, and/or value options');
        } else {
            $(replace.selector).append(replace.html + "\n");
        }

        var updatedContents = $.html();

        if (remove_blank_lines) {
            updatedContents = multilineTrim(updatedContents);
        }

        grunt.file.write(dest, updatedContents);
        grunt.log.writeln('File ' + (dest ).cyan + ' created/updated.');

    };

    grunt.registerMultiTask('replace_css', 'Replace all linked css files by one', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            prefix: undefined,
            separator: '',
            offset: 0,
            replace: undefined,
            remove_blank_lines: false
        });

        // Iterate over all specified file groups.
        this.files.forEach(function (f) {
            // Concat specified files.
            var src = f.src.filter(function (filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function (filepath) {
                // Read file source.
                return grunt.file.read(filepath);
            }).join(grunt.util.normalizelf(options.separator));

            var css_files = [];
            var htmlparser = require("htmlparser2");
            var parser = new htmlparser.Parser({
                onopentag: function (name, attribs) {
                    if (name === "link" && attribs.href !== undefined) {
                        if (options.prefix !== undefined) {
                            if (attribs.href.indexOf(options.prefix) == 0) {
                                css_files.push(attribs.href);
                            }
                        } else {
                            css_files.push(attribs.href);

                        }


                    }
                },
                ontext: function (text) {
                    //console.log("-->", text);
                },
                onclosetag: function (tagname) {
                    if (tagname === "link") {
                        //console.log("That's it?!");
                    }
                },
                comment: function (text) {
                    grunt.log.writeln("comment " + text);
                }
            });

            parser.write(src);
            parser.end();

            var css_offset_files = [];
            var matchArray = [];
            for (var i in css_files) {
                matchArray.push({selector: 'link', attribute: 'href', value: css_files[i]});
                css_offset_files.push(css_files[i].substring(options.offset));
            }
            grunt.config.set("css_filenames", css_offset_files);
            var test = grunt.config.get('css_filenames');

            //grunt.log.writeln("test result " + test);

            if (options.replace !== undefined) {

                f.src.filter(function (filepath) {
                    // Warn on and remove invalid source files (if nonull was set).
                    if (!grunt.file.exists(filepath)) {
                        grunt.log.warn('Source file "' + filepath + '" not found.');
                        return false;
                    } else {
                        return true;
                    }
                }).map(function (filepath) {
                    // Read file source.
                    var src = grunt.file.read(filepath);

                    var cheerio = require('cheerio');
                    var $ = cheerio.load(src, {lowerCaseAttributeNames: false});
                    removeHTMLCode(f.dest, matchArray, options.replace, options.remove_blank_lines, $);
                });
            }
            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });

};
