(function( w ) {

  var timeout = 5000,
      u       = (+new Date);

  module("Asynchronous Script Loading")
  asyncTest("Non-recursive loading of a &rarr; b &rarr; c", 9, function() {
    yepnope([
      {
        load : 'js/a'+u+'.js',
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
