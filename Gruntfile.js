// JavaScript source code

module.exports = function (grunt) {
    grunt.initConfig({
        concat: {
            all: {
                src: [
                    'src/dataview.ts',
                    'src/Parser.ts',
                    'src/BoxParser.ts',
                    'src/FullBoxParser.ts',
                    'src/RootParser.ts',
                    'src/mp4.ts'
                ],
                dest: 'src/all.ts'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
};