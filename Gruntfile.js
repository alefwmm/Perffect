module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jade: {
            default: {
                options: {
                    pretty: true
                },
                files: {
                    "index.html": "index.jade"
                }
            }
        },
        watch: {
            jade: {
                files: "index.jade",
                tasks: "jade"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['jade']);
};
