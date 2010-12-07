(function( w ) {
	
	module("Asynchronous Script Loading")
  asyncTest("Non-recursive loading of a &rarr; b &rarr; c", 9, function() {
    yepnope([
      {
        load : '../js/a.js',
        callback : function( id ) {
          ok( w.a, "a has loaded");
          ok( ! w.b, "b has not loaded");
          ok( ! w.c, "c has not loaded" );
        }
      },
      {
        load : '../js/b.js',
        callback : function( id ) {
          ok( w.a, "a has loaded");
          ok( w.b, "b has loaded");
          ok( ! w.c, "c has not loaded" );
        }
      },
      {
        load : '../js/c.js',
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

  });

  asyncTest("Recursive loading of d &rarr; e &rarr; f &rarr; g &rarr; h", 25, function() {
    yepnope([
      {
        load : '../js/d.js',
        callback : function() {

          ok( w.d );
          ok( ! w.e );
          ok( ! w.f );
          ok( ! w.g );
          ok( ! w.h );

          yepnope({
            load : '../js/e.js',
            callback : function(){

              ok( w.d );
              ok( w.e );
              ok( ! w.f );
              ok( ! w.g );
              ok( ! w.h );


              yepnope({
                load : '../js/f.js',
                callback : function() {

                  ok( w.d );
                  ok( w.e );
                  ok( w.f );
                  ok( ! w.g );
                  ok( ! w.h );

                  yepnope({
                    load : '../js/g.js',
                    callback : function() {

                      ok( w.d );
                      ok( w.e );
                      ok( w.f );
                      ok( w.g );
                      ok( ! w.h );

                    } // g
                  });
                } // f
              });
            } // e
          });
        } // d
      },
      {
        load : '../js/h.js',
        callback : function() {
          ok( w.d );
          ok( w.e );
          ok( w.f );
          ok( w.g );
          ok( w.h );
        },
        complete: function(){
          start();
        }
      }
    ]);

  });

  asyncTest("404 Fallback", 2, function() {
    yepnope([
      {
        load : 'asdfasdfasdf',
        callback : function(){

          ok( ! w.i );

          yepnope({
            load : '../js/i.js',
            callback: function() {

              ok( w.i );

            },
            complete: function(){
              start();
            }
          })
        }
      }
    ]);
    stop(2000);
  });

})( window )