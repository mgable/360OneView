// Generated on 2014-04-24 using generator-angular 0.8.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        yeoman: {
            // configurable paths
            app: require('./bower.json').appPath || 'app',
            dist: 'dist',
            docs: {
                base: 'docs',
                port: 9010
            }
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            sass: {
                files: ['<%= yeoman.app %>/styles/scss/*.scss'],
                tasks: ['sass']
            },
            bower: {
                files: ['bower.json'],
                tasks: ['bowerInstall']
            },
            js: {
                files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
                tasks: ['newer:jshint:all'],
                options: {
                    livereload: true
                }
            },
            jsTest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['newer:jshint:test', 'karma']
            },
            styles: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'autoprefixer']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '.tmp/styles/{,*/}*.css',
                    '<%= yeoman.app %>/{,*/}*.html',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        usebanner: {
            taskName: {
                options: {
                    position: 'bottom',
                    banner: '<!-- <%= grunt.template.today("mm-dd-yyyy::hh:mm:ss") %> -->',
                    linebreak: true
                },
                files: {
                    src: [ 'dist/index.html' ]
                }
            }
        },

        ngdocs: {
            options: {
                references: {
                    official: 'https://github.com/angular/angular.js/wiki/Writing-AngularJS-Documentation',
                    gruntPlugin: 'https://www.npmjs.org/package/grunt-ngdocs',
                    generator: 'https://github.com/angular/dgeni',
                    examples: [
                        'https://github.com/petebacondarwin/dgeni-example',
                        'https://github.com/m7r/grunt-ngdocs-example'
                    ]
                },
                title: '360 One View FED Docs',
                //image: "path/to/my/image.png",
                dest: '<%= yeoman.docs.base %>',
                //titleLink: "/api",
                //bestMatch: true,
                discussions: {
                    url: 'http://localhost:<%= yeoman.docs.port %>',
                    shortName: 'ms-fed',
                    dev: false
                }
            },
            app: {
                src: [
                    '<%= yeoman.app %>/scripts/**/*.js',
                    'test/**/*.js'
                ],
                title: 'App Documentation'
            }
        },

        ngtemplates: {
            ThreeSixtyOneView: {
              // options: {
              //   base:       'public/partials',
              //   prepend:    'partials/',
              //   module:     'project'
              // },
              cwd:'app',
              src: ['views/directives/*.html', 'views/modal/*.html'],
              dest: 'app/views/templates/templates.js'
            }
        },

        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.',
                    src: ['<%= yeoman.app %>/styles/scss/*.scss'],
                    dest: '<%= yeoman.app %>/styles',
                    ext: '.css',
                    flatten: true
                }]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9001,
                livereload: 35730,
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            test: {
                options: {
                    port: 9001,
                    base: [
                        '.tmp',
                        'test',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            docs: {
                options: {
                    open: true,
                    port: '<%= yeoman.docs.port %>',
                    base: '<%= yeoman.docs.base %>'
                }
            },
            dist: {
                options: {
                    base: '<%= yeoman.dist %>'
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js'
            ],
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/spec/{,*/}*.js']
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.docs %>/*',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },

        // Automatically inject Bower components into the app
        bowerInstall: {
            app: {
                src: ['<%= yeoman.app %>/index.html'],
                ignorePath: '<%= yeoman.app %>/'
            }
        },

        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: [{
                    expand: true,
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}*.js',
                        '<%= yeoman.dist %>/styles/{,*/}*.css',
                        '<%= yeoman.dist %>/styles/fonts/*',
                        '!<%= yeoman.dist %>/scripts/external/*.js'
                    ]
                }]
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>',
                // flow: {
                //     html: {
                //         steps: {
                //             js: ['concat', 'uglifyjs'],
                //             css: ['cssmin']
                //         },
                //         post: {}
                //     }
                // }
            }
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            options: {
                assetsDirs: ['<%= yeoman.dist %>']
            },
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css']
        },

        //The following *-min tasks produce minified files in the dist folder
        // cssmin: {
        //     options: {
        //         root: '<%= yeoman.app %>',
        //         noRebase: true
        //     }
        // },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },

        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: ['*.html', 'views/{,*/}*.html'],
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },

        // ngmin tries to make the code safe for minification automatically by
        // using the Angular long form for dependency injection. It doesn't work on
        // things like resolve or inject so those have to be done manually.
        // ngmin: {
        //     dist: {
        //         files: [{
        //             expand: true,
        //             cwd: '.tmp/concat/scripts',
        //             src: '*.js',
        //             dest: '.tmp/concat/scripts'
        //         }]
        //     }
        // },

        ngAnnotate: {
            options: {},
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/scripts',
                    src: '*.js',
                    dest: '.tmp/concat/scripts'
                }]
            }
        },

        // Replace Google CDN references
        cdnify: {
            dist: {
                html: ['<%= yeoman.dist %>/*.html']
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        '*.html',
                        'views/{,*/}*.html',
                        'images/{,*/}*.{webp}',
                        'fonts/*',
                        'styles/vendor/*.css'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/images',
                    dest: '<%= yeoman.dist %>/images',
                    src: ['generated/*']
                }, {
                  expand: true,
                  flatten: true,
                  cwd: '<%= yeoman.app %>',
                  dest: '<%= yeoman.dist %>/fonts',
                  src: ['bower_components/bootstrap/dist/css/*.*', 'bower_components/components-font-awesome/css/*.*']
                },{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: ['scripts/external/*.js']
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'copy:styles',
                'imagemin',
                'svgmin'
            ]
        },

        // By default, your `index.html`'s <!-- Usemin block --> will take care of
        // minification. These next options are pre-configured if you do not wish
        // to use the Usemin blocks.
        // cssmin: {
        //   dist: {
        //     files: {
        //       '<%= yeoman.dist %>/styles/main.css': [
        //         '.tmp/styles/{,*/}*.css',
        //         '<%= yeoman.app %>/styles/{,*/}*.css'
        //       ]
        //     }
        //   }
        // },
        uglify: {
          // dist: {
            options: {
                mangle: false
            },
            files: {
              '<%= yeoman.dist %>/scripts/scripts.js': [
                '<%= yeoman.dist %>/scripts/scripts.js'
              ]
            }
          // }
        },
        // concat: {
        //   dist: {}
        // },

        // Test settings
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        },

        protractor: {
            options: {
                keepAlive: true, // If false, the grunt process stops when the test fails.
                noColor: false, // If true, protractor will not use colors in its output.
                args: {}
            },
            proto: {   // Grunt requires at least one target to run so you can simply put 'all: {}' here too.
                options: {
                    configFile: "protractor.conf.js", // Target-specific config file
                    args: {
                        baseUrl: "http://360-ui-prototype.marketshare.com"
                    } // Target-specific arguments
                }
            },
            local: {   // Grunt requires at least one target to run so you can simply put 'all: {}' here too.
                options: {
                    configFile: "protractor.conf.js", // Target-specific config file
                    args: {
                        baseUrl: "http://127.0.0.1:9001"
                    } // Target-specific arguments
                }
            }
        }
    });


    grunt.registerTask('serve', function(target) {
        var taskRunners = ['watch'];

        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'bowerInstall',
            'sass',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload'
        ]);

        if (target === 'docs') { // Documentation server.
            taskRunners.unshift('ngdocs', 'connect:docs');
        }

        grunt.task.run(taskRunners);
    });

    grunt.registerTask('docs', [
        'ngdocs'
    ]);

    grunt.registerTask('msserve', function(target) {
        grunt.log.warn('Running:', target);
        grunt.task.run([
            'connect:dist:keepalive'
        ]);
    });

    grunt.registerTask('server', function(target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve:' + target]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'karma'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'bowerInstall',
        'sass',
        'ngtemplates',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        // 'ngmin',
        'ngAnnotate',
        'copy:dist',
        'cdnify',
        'cssmin',
        'uglify',
        'rev',
        'usemin',
        'htmlmin',
        'usebanner'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'test',
        'build'
    ]);

    grunt.registerTask('retemp', [
        'ngtemplates',
        'serve'
    ]);
};
