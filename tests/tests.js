(function( w ) {

  var timeout = 5000;

  module("Asynchronous Script Loading")
  asyncTest("Non-recursive loading of a &rarr; b &rarr; c", 9, function() {
    yepnope([
      {
        load : 'js/a.js',
        callback : function( id ) {
          ok( w.a, "a has loaded");
          ok( ! w.b, "b has not loaded");
          ok( ! w.c, "c has not loaded" );
        }
      },
      {
        load : 'js/b.js',
        callback : function( id ) {
          ok( w.a, "a has loaded");
          ok( w.b, "b has loaded");
          ok( ! w.c, "c has not loaded" );
        }
      },
      {
        load : 'js/c.js',
        callback : function( id ) {
          ok( w.a, "a has loaded");
          ok( w.b, "b has loaded");
          ok( w.c, "c has loaded" );
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
        load : 'js/d.js',
        callback : function() {

          ok( w.d, "d has loaded");
          ok( ! w.e, "e has not loaded");
          ok( ! w.f, "f has not loaded");
          ok( ! w.g, "g has not loaded");
          ok( ! w.h, "h has not loaded");

          yepnope({
            load : 'js/e.js',
            callback : function(){

              ok( w.d, "d has loaded");
              ok( w.e, "e has loaded");
              ok( ! w.f, "f has not loaded");
              ok( ! w.g, "g has not loaded");
              ok( ! w.h, "h has not loaded");


              yepnope({
                load : 'js/f.js',
                callback : function() {

                  ok( w.d, "d has loaded");
                  ok( w.e, "e has loaded");
                  ok( w.f, "f has loaded");
                  ok( ! w.g, "g has not loaded");
                  ok( ! w.h, "h has not loaded");

                  yepnope({
                    load : 'js/g.js',
                    callback : function() {

                      ok( w.d, "d has loaded");
                      ok( w.e, "e has loaded");
                      ok( w.f, "f has loaded");
                      ok( w.g, "g has loaded");
                      ok( ! w.h, "h has not loaded");

                    } // g
                  });
                } // f
              });
            } // e
          });
        } // d
      },
      {
        load : 'js/h.js',
        callback : function() {
          ok( w.d, "d has loaded");
          ok( w.e, "e has loaded");
          ok( w.f, "f has loaded");
          ok( w.g, "g has loaded");
          ok( w.h, "h has loaded");
        },
        complete: function(){
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
        callback : function(){

          ok( ! w.i, "i returned a 404");

          yepnope({
            load : 'js/i.js',
            callback: function() {

              ok( w.i, "i has loaded" );

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
