if ( ! window.console ) {
  window.console = {
    log : function( msg ) {
    }
  };

};
(function( w ) {

  var rgbRegex = /rgb\((\d+),\s?(\d+),\s?(\d+)\)/;

  function cssIsLoaded(rgb, cb) {
    var $elem = $('#item_' + rgb.join(''));

    if (!$elem.length) {
      $elem = $('<div id="item_' + rgb.join('') + '">&nbsp;</div>');
      $('#cssTests').append($elem);
    }

    // Let the reflow occur, or whatever it would be called here.
    setTimeout(function(){

      var color = $elem.css('color'),
          matches = rgbRegex.exec( color ),
          result = true;
      if ( matches ) {
        matches.shift();
        $.each(matches, function( i, v ) {
          if ( result ) {
            result = rgb[i] == matches[i];
          }
        });
        cb(result);
      } else if (/#(\w+)/.test( color )) {
        cb( color.toLowerCase() == '#' + ($.map(rgb, function( v, i ) { return  v.toString(16); }).join('').toLowerCase()) );

      } else {
        cb(false);
      }
    }, 0);
  }

  var timeout   = 25000,
      rgb       = (function( i ){
        var a = [];
        while ( i-- ) a.push( Math.floor( Math.random() * 255 ) );
        return a;
      })(3),
      u         = (+new Date);

  module("Input Support")
  asyncTest("Accept as many input types as possible", 8, function() {
    ++u;

    // single string
    yepnope("js/a"+u+".js");
    // since we'd like to test just single string input, give the test for the existence of this one a long
    // wait time and then a check. This isn't foolproof (could show false-positives), but worthwhile for making
    // sure that a common practice is well-supported. Increase the timeout if you have slow internet connection, etc.
    setTimeout(function(){
      ok( w['a'+u], "Single string*");
    }, 3000); // 3 seconds of leeway

    // array of strings
    yepnope(['js/b'+u+'.js', 'js/c'+u+'.js']);
    setTimeout(function(){
      ok( w['b'+u] && w['c'+u], "Array of strings*");
    }, 3000);

    // single object
    yepnope({
      load: 'js/d'+u+'.js',
      callback: function() {
        ok(w['d'+u], "Single Object (with `load` keyword)");
      }
    });

    // single object (with both keyword instead)
    yepnope({
      both: 'js/e'+u+'.js',
      callback: function() {
        ok(w['e'+u], "Single Object (with `both` keyword)");
      }
    });

    // single object with array of strings inside
    yepnope({
      load: ['js/f'+u+'.js', 'js/g'+u+'.js'],
      complete: function() {
        ok(w['f'+u] && w['g'+u], "Single object with array of strings inside");
      }
    });

    // array of objects
    yepnope([{
      load: 'js/sleep-1/h'+u+'.js'
    },
    {
      load: 'js/i'+u+'.js',
      callback: function() {
        ok(w['h'+u] && w['i'+u], "Array of objects (forces order)");
      }
    }]);

    // mixed array of strings and objects
    yepnope(['js/j'+u+'.js', {
      load: 'js/sleep-1/k'+u+'.js', // use the sleep like the crappy timeout hack to test the string
      callback: function() {
        ok(w['j'+u] && w['k'+u], "Mixed array of strings and objects*");
      }
    }]);

    // array of objects with array of strings inside
    yepnope([{
      load: ['js/l'+u+'.js', 'js/m'+u+'.js'],
      complete: function() {
        ok(w['l'+u] && w['m'+u], "Array of objects with array of strings inside");
      }
    }]);

    // We do not intentionally support any deeper nesting than this of arrays and objects, but won't actively prevent it.

    // Since we're using crappy logic to test the single string loads, we have to start the tests crappily as well
    setTimeout(function(){
      start();
    }, 6000);
  });

  module("Asynchronous Script Loading")
  asyncTest("Execution Order", 1, function() {
    ++u;

    // In this case we'd want d to wait for c before executing, most user friendly default
    // use 'immediate' flag to avoid
    yepnope([{
      load: 'js/sleep-3/c'+u+'.js'
    },
    {
      load: 'js/d'+u+'.js',
      callback: function() {
        ok(w['c'+u] && w['d'+u], "d waited for c to complete.");
      },
      complete: function() {
        start();
      }
    }]);
  });

  asyncTest("Non-recursive loading of a &rarr; b &rarr; c", 3, function() {
    // Increment the unique value per test, so caching doesn't occur between tests
    ++u;

    yepnope([
      {
        load : 'js/sleep-2/a'+u+'.js',
        callback : function( id ) {
          ok( w['a'+u] && !w['b'+u] && !w['c'+u], "a has loaded; not b or c");
        }
      },
      {
        load : 'js/b'+u+'.js',
        callback : function( id ) {
          ok( w['a'+u] && w['b'+u] && !w['c'+u], "a & b have loaded; not c");
        }
      },
      {
        load : 'js/c'+u+'.js',
        callback : function( id ) {
          ok( w['a'+u] && w['b'+u] && w['c'+u], "a, b, and c have loaded");
        },
        complete: function() {
          start();
        }
      }
    ]);
    stop(timeout);
  });

  asyncTest("Recursive loading of d &rarr; e &rarr; f &rarr; g &rarr; h", 5, function() {
    ++u;

    yepnope([
      {
        load : 'js/d'+u+'.js',
        callback : function(url, res, key, yepnope) {

          ok( w['d'+u] && !w['e'+u] && !w['f'+u] && !w['g'+u] && !w['h'+u], "d has loaded; e,f,g,h have not.");

          yepnope({
            load : 'js/e'+u+'.js',
            callback : function(url, res, key, yepnope){

              ok( w['d'+u] && w['e'+u] && !w['f'+u] && !w['g'+u] && !w['h'+u], "d,e have loaded; f,g,h have not.");

              yepnope({
                load : 'js/f'+u+'.js',
                callback : function(url, res, key, yepnope) {

                  ok( w['d'+u] && w['e'+u] && w['f'+u] && !w['g'+u] && !w['h'+u], "d,e,f have loaded; g,h have not.");

                  yepnope({
                    load : 'js/g'+u+'.js',
                    callback : function() {

                      ok( w['d'+u] && w['e'+u] && w['f'+u] && w['g'+u] && !w['h'+u], "d,e,f,g have loaded; h has not.");

                    } // g
                  });
                } // f
              });
            } // e
          });
        } // d
      },
      {
        load : 'js/h'+u+'.js',
        callback : function() {
          ok( w['d'+u] && w['e'+u] && w['f'+u] && w['g'+u] && w['h'+u], "d,e,f,g,h have all loaded");
        },
        complete: function(){
          start();
        }
      }
    ]);
    stop(timeout);
  });

  asyncTest("CSS Callback Timing", 3, function() {
    var startTime = (+new Date);

    // For good measure, make sure this is always true
    cssIsLoaded(rgb, function(result) {
      ok(!result, 'CSS is not already loaded.');
    });

    yepnope([
      {
        load : 'css!css/sleep-3/' + rgb.join(',') + '.css',
        callback : function() {
          cssIsLoaded(rgb, function(result) {

            ok(result, 'CSS is loaded at callback runtime.');

          });

        },
        complete: function() {
          start();
        }
      }
    ]);

    // Since the load is slept for 3 seconds, it should not exist after 1.5 seconds
    setTimeout(function() {
      cssIsLoaded(rgb, function(result) {
        ok(!result, 'CSS is not loaded before callback.');
      });
    }, 1500);

    stop(timeout);
  });

  module("Caching");
  asyncTest("Don't Load Twice", 1, function(){
    ++u;

    yepnope('js/sleep-3/a'+u+'.js');

    // If it caches, it will take 3 seconds and change, if not, it'll take 6 seconds
    setTimeout(function(){
      ok(w['a'+u], "a exists already");
      start();
    }, 5500);
  });

  module("Inner api");
  asyncTest("Key Value Callbacks", 2, function() {
    ++u;

    yepnope([
      {
        load : {
          'myscript-a': 'js/a'+u+'.js',
          'myscript-b': 'js/b'+u+'.js'
        },
        callback : {
          'myscript-a': function() {
            ok( w['a'+u], "a has loaded");
          },
          'myscript-b': function() {
            ok( w['b'+u], "b has loaded");
          }
        },
        complete: function() {
          start();
        }
      }
    ]);
    stop(timeout);
  });

  asyncTest("404 Fallback", 2, function() {
    ++u;
    yepnope([
      {
        load : 'iDoesNotExist',
        callback : function(url, res, key, yepnope){

          ok( ! w['i'+u], "i returned a 404");

          yepnope({
            load : 'js/i'+u+'.js',
            callback: function() {

              ok( w['i'+u], "i has loaded" );

            },
            complete: function(){
              start();
            }
          })
        }
      }
    ]);
    stop(timeout);
  });

  module("Supported Plugins")
  asyncTest("autoprotocol supported global filter plugin", 1, function() {
    ++u;
    yepnope([
      {
        load : '//' + w.location.hostname + (w.location.port ? ':'+w.location.port : '') + (w.location.pathname.replace('index.html', '')) + 'js/a'+u+'.js',
        callback : function(url, res, key, yepnope){
          ok( w['a'+u], "The correct script was loaded with the // prefix");
        },
        complete: function() {
          start();
        }
      }
    ]);
    stop(timeout);
  });

  asyncTest("IE prefix test", 2, function() {
    ++u;
    yepnope([
      {
        load: 'ie!js/a'+u+'.js',
        callback : function(url, res, key, yepnope){
          // The script uses IE conditionals, so we'll cross check with user-agent... could be bad, idk, good enough for now.
          if ($.browser.msie) {
            ok( w['a'+u], "The browser is IE, and the script was loaded");
          }
        }
      },
      {
        // we need to load another script that _would_ wait if the ie one loaded, and wont wait if it doesn't.
        load: 'js/b'+u+'.js',
        callback: function() {
          // Might as well make sure this script loaded, even though that's already in another test
          ok(w['b'+u], "Other scripts still load after an ie prefixed script.");
          if (!$.browser.msie) {
            ok(!w['a'+u], "The browser is not IE, but the complete callback was called an no script was loaded.");
          }
        },
        complete: function() {
          start();
        }
      }
    ]);
    stop(timeout);
  });

})( window )
