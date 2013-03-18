var path = require('path');

module.exports = function(grunt) {

  var testport = 3011;
  var testhostname = '127.0.0.1';

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
          urls: [ 'http://' + testhostname + ':' + testport + '/test/' ],

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
    },
    express: {
      test: {
        options: {
          hostname: testhostname,
          port: testport,
          bases: path.resolve('.'),
          monitor: {},
          server: path.resolve('./test/app/server')
        }
      },
      serve: {
        options : {
          hostname: testhostname ,
          port: testport - 1,
          bases: path.resolve('.'),
          monitor: {},
          server: path.resolve('./test/app/server')
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-express');

  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('test', ['jshint', 'express:test', 'mocha']);
  grunt.registerTask('serve', ['express:serve', 'express-keepalive']);

  // Travis CI task.
  grunt.registerTask('travis', 'test');

  grunt.registerTask('default', ['jshint', 'express:test', 'mocha', 'concat', 'uglify']);

};
