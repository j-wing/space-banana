module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        clean: ['dist'],
        '6to5': {
            options: {
                modules: 'amd',
                sourceMap:true,
                experimental:true,
            },

            build: {
                files: [{
                    expand: true,
                    cwd: 'js/es6',
                    src: ['*.js'],
                    dest: 'dist/',
                }],
            }
        },
        "watch":{
            files: [
                'js/es6/*.js',
            ],
          tasks: ['6to5']

        }

        // copy: {
        //     main: {
        //         cwd: './src/sample',
        //         src: 'index.html',
        //         dest: 'dist/',
        //         expand: true,
        //         flatten: true,
        //         filter: 'isFile'
        //     },
        // }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['watch']);
}
