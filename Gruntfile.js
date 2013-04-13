// JavaScript source code

module.exports = function (grunt) {
  grunt.initConfig({
    typescript: {
      scripts: {
        src: [
          'src/dataview.ts',
          'src/interface.box.ts',
          'src/interface.descr.ts',
          'src/parser.ts',
          'src/parser.descr.ts',
          'src/parser.box.ts',
          'src/composer.ts',
          'src/composer.descr.ts',
          'src/composer.box.ts',
          'src/finder.ts',
          'src/mp4.ts'
        ]
      },
      tests: {
        src: ['test/test.ts']
      },
      options: {
        target: 'es5',
        sourcemap: true
      }
    },

    watch: {
      scripts: {
        files: ['<%= typescript.scripts.src %>'],
        tasks: ['typescript:srcipts']
      },
      tests: {
        files: ['<%= typescript.tests.src %>'],
        tasks: ['typescript:tests']
      }
    },

    uglify: {
      scripts: {
        files: {
          'dest/mp4.min.js': [
            'src/dataview.js',
            'src/interface.box.js',
            'src/interface.descr.js',
            'src/parser.js',
            'src/parser.descr.js',
            'src/parser.box.js',
            'src/composer.js',
            'src/composer.descr.js',
            'src/composer.box.js',
            'src/finder.js',
            'src/mp4.js'
          ]
        },
        options: {
          banner: '/* mp4.js - Licensed under the Apache License 2 https://github.com/ukyo/mp4.js/blob/master/LICENSE */'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-typescript');
};