module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jade: {
            default: {
                options: {
                    pretty: true
                },
                files: {
                    "demo/index.html": "demo/index.jade"
                }
            }
        },
        watch: {
            jade: {
                files: "demo/*.jade",
                tasks: "jade"
            }
        },
        uglify: {
            default: {
                files: {
                    'dist/Perffect.min.js': 'src/Perffect.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['jade'], ['uglify']);
};
