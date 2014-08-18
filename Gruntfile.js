'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        paths: {
            less: './less',
            css: './assets/css',
            js: ['*.js', 'assets/js/*.js', 'test/*.js'],
            beautify: ['*.js', 'assets/js/*.js', 'test/*.js', 'index.html', 'assets/partials/**.html']
        },
        buildType: 'Build',
        pkg: grunt.file.readJSON('package.json'),
        archiveName: grunt.option('name') || 'app',

        clean: {
            pre: ['dist/', 'build/'],
            post: ['<%= archiveName %>.zip']
        },

        compress: {
            main: {
                options: {
                    archive: '<%= archiveName %>.zip'
                },
                expand: true,
                cwd: 'build/',
                src: ['**/*'],
                dest: ''
            }
        },

        copy: {
            main: {
                files: [{
                    expand: true,
                    src: ['assets/css/**'],
                    dest: 'build/'
                }, {
                    expand: true,
                    src: ['assets/js/**'],
                    dest: 'build/'
                }, {
                    expand: true,
                    src: ['index.html'],
                    dest: 'build/'
                }]
            },
            archive: {
                files: [{
                    expand: true,
                    src: ['<%= archiveName %>.zip'],
                    dest: 'dist/'
                }]
            }
        },

        jshint: {
            src: '<%= paths.js %>',
            options: {
                jshintrc: '.jshintrc' // relative to Gruntfile
            }
        },

        jsbeautifier: {
            options: {
                html: {
                    braceStyle: 'collapse',
                    indentChar: ' ',
                    indentScripts: 'keep',
                    indentSize: 4,
                    maxPreserveNewlines: 10,
                    preserveNewlines: true,
                    unformatted: ['a', 'sub', 'sup', 'b', 'i', 'u'],
                    wrapLineLength: 0
                },
                js: {
                    braceStyle: 'collapse',
                    breakChainedMethods: false,
                    e4x: false,
                    evalCode: false,
                    indentChar: ' ',
                    indentLevel: 0,
                    indentSize: 4,
                    indentWithTabs: false,
                    jslintHappy: false,
                    keepArrayIndentation: false,
                    keepFunctionIndentation: false,
                    maxPreserveNewlines: 10,
                    preserveNewlines: true,
                    spaceBeforeConditional: true,
                    spaceInParen: false,
                    unescapeStrings: false,
                    wrapLineLength: 0
                }
            },
            beautify: {
                src: '<%= paths.beautify %>'
            },
            check: {
                src: '<%= paths.beautify %>',
                options: {
                    mode: 'VERIFY_ONLY'
                }
            }
        },

        less: {
            admin: {
                files: {
                    '<%= paths.css %>/main.css': '<%= paths.less %>/main.less',
                }
            }
        },

        watch: {
            less: {
                files: './less/**/*.less',
                tasks: ['less:admin']
            },
            js: {
                files: '<%= paths.js %>',
                tasks: ['jshint']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    grunt.registerTask('default', ['jshint', 'jsbeautifier:check', 'less:admin']);
    grunt.registerTask('beautify', ['jsbeautifier:beautify']);
    grunt.registerTask('deploy', ['jsbeautifier:beautify', 'clean:pre', 'copy:main', 'compress', 'copy:archive', 'clean:post']);
};
