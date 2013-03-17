module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: 'dist/yepnope.js'
      }
    },
    uglify: {
      options: {
        banner: '/*!yepnope<%= pkg.version %>|MIT*/\n'
      },
      dist: {
        files: {
          'dist/yepnope.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    mocha: {
      all : {
        options: {
          reporter: 'Spec',

          // mocha options
          mocha: {
            ignoreLeaks: false
          },

          // URLs passed through as options
          urls: [ 'http://127.0.0.1:3000/test/test.html' ],

          // Indicates whether 'mocha.run()' should be executed in
          // 'bridge.js'
          run: true
        }
      }
    },
    jshint: {
      files: ['gruntfile.js', 'src/**/*.js', 'test/test.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          yepnope: true,
          document: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha');

  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('test', ['jshint', 'mocha']);

  grunt.registerTask('default', ['jshint', 'mocha', 'concat', 'uglify']);

};
