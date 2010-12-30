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

  var timeout   = 15000,
  		rgb				= (function( i ){  			
  			var a = [];
  			while ( i-- ) a.push( Math.floor( Math.random() * 255 ) );
  			return a;
  		})(3),
      u         = (+new Date);

  module("Asynchronous Script Loading")
  asyncTest("Non-recursive loading of a &rarr; b &rarr; c", 9, function() {
    yepnope([
      {
        load : 'js/a'+u+'.js?sleep=2',
        callback : function( id ) {
          ok( w['a'+u], "a has loaded");
          ok( ! w['b'+u], "b has not loaded");
          ok( ! w['c'+u], "c has not loaded" );
        }
      },
      {
        load : 'js/b'+u+'.js',
        callback : function( id ) {
          ok( w['a'+u], "a has loaded");
          ok( w['b'+u], "b has loaded");
          ok( ! w['c'+u], "c has not loaded" );
        }
      },
      {
        load : 'js/c'+u+'.js',
        callback : function( id ) {
          ok( w['a'+u], "a has loaded");
          ok( w['b'+u], "b has loaded");
          ok( w['c'+u], "c has loaded" );
        },
        complete: function() {
          start();
        }
      }
    ]);
    stop(timeout);
  });

  asyncTest("Recursive loading of d &rarr; e &rarr; f &rarr; g &rarr; h", 25, function() {
    yepnope([
      {
        load : 'js/d'+u+'.js',
        callback : function(url, res, key, yepnope) {

          ok( w['d'+u], "d has loaded");
          ok( ! w['e'+u], "e has not loaded");
          ok( ! w['f'+u], "f has not loaded");
          ok( ! w['g'+u], "g has not loaded");
          ok( ! w['h'+u], "h has not loaded");

          yepnope({
            load : 'js/e'+u+'.js',
            callback : function(url, res, key, yepnope){

              ok( w['d'+u], "d has loaded");
              ok( w['e'+u], "e has loaded");
              ok( ! w['f'+u], "f has not loaded");
              ok( ! w['g'+u], "g has not loaded");
              ok( ! w['h'+u], "h has not loaded");


              yepnope({
                load : 'js/f'+u+'.js',
                callback : function(url, res, key, yepnope) {

                  ok( w['d'+u], "d has loaded");
                  ok( w['e'+u], "e has loaded");
                  ok( w['f'+u], "f has loaded");
                  ok( ! w['g'+u], "g has not loaded");
                  ok( ! w['h'+u], "h has not loaded");

                  yepnope({
                    load : 'js/g'+u+'.js',
                    callback : function() {

                      ok( w['d'+u], "d has loaded");
                      ok( w['e'+u], "e has loaded");
                      ok( w['f'+u], "f has loaded");
                      ok( w['g'+u], "g has loaded");
                      ok( ! w['h'+u], "h has not loaded");

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
          ok( w['d'+u], "d has loaded");
          ok( w['e'+u], "e has loaded");
          ok( w['f'+u], "f has loaded");
          ok( w['g'+u], "g has loaded");
          ok( w['h'+u], "h has loaded");
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
        load : 'css!css/' + rgb.join(',') + '.css?sleep=3',
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
  asyncTest("Key Value Callbacks", 2, function() {
    yepnope([
      {
        load : {
          'myscript-aa': 'js/aa'+u+'.js',
          'myscript-bb': 'js/bb'+u+'.js'
        },
        callback : {
          'myscript-aa': function() {
            ok( w['aa'+u], "aa has loaded");
          },
          'myscript-bb': function() {
            ok( w['bb'+u], "bb has loaded");
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

})( window )
