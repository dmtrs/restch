module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            es6: {
                expand: true,
                files: [ "src/**/*.js", "test/**/*.js" ],
                tasks: [ 'eslint', 'mochaTest' ],
                options: {
                    spawn: false
                }
            }
        },
        eslint: {
            node: {
                src: [ "src/**/*.js", "test/**/*.js" ],
                options: {
                    configFile: "eslint.json"
                }
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: true, // https://github.com/pghalliday/grunt-mocha-test#running-in-permanent-environments-like-watch
                    require: [ "hook" ], //https://github.com/pghalliday/grunt-mocha-test/issues/101
                    colors: false
                },
                src: ['test/**/*.spec.js']
            }
        },
    });

    // on watch events configure babel to only run on changed file
    grunt.event.on('watch', function(action, filepath) {
        testpath = /\.spec\.js$/.test(filepath) ? filepath : filepath.replace(/^src/, 'test').replace(/\.js$/, '.spec.js');

        grunt.config('mochaTest.test.src', testpath);
        grunt.config('eslint.node.src', filepath);
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('default', ['watch']);
};
