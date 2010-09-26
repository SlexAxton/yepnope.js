#Yepnope JS#

A small wrapper around LABjs to help use feature detection to load exactly the scripts that your _user_ needs, not just all the scripts that you _think_ they might need.

A simple example (assuming modernizr is there):

    yepnope([
      {
        test : Modernizr.indexeddb,
        yep  : ['/indexeddb-wrapper.js', 'coolbrowser.css'],
        nope : ['/js/lawnchair.js', '/js/cookies.js', '/css/oldbrowser.css']
      }
    ]);

A crazy/contrived example:

    yepnope([
      // straight up load
      'css!http://yayquery.com/css/base.css?alwaysload',
      
      // no tests, just a load and a callback
      {
        load:'http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.js',
        callback: function(){
          console.log('jQuery was loaded!');
          window.oldalert = window.alert;
          window.alert = function(){};
        }
      },
      
      // conditional test based loading, with a default load
      {
        // The test
        test: Modernizr.csstransforms && Modernizr.csstransforms3d,
        
        // If it passes
        yep: 'css!http://yayquery.com/css/base.css?supports3d=true',
        
        // If it fails
        nope: [
          'http://github.com/madrobby/vapor.js/raw/master/vapor.min.js',
          'css!http://yayquery.com/css/base.css?supports3d=false'
        ],
        
        // Load it no matter what
        both: 'http://www.json.org/json2.js',
        
        // For each thing loaded
        callback: function(id) {
          
          // check for the load of json2, specifically
          if (id === 'http://www.json.org/json2.js') {
            window.alert = window.oldalert;
            console.log('bypassed crock\'s alert in json2 yo');
          }
        }
      }
    ]);

Any forks and stuff are welcome.

##License##

All of the yepnope specific code is under the WTFPL license. However, LABjs is subject to it's own license (currently BSD or MIT)

##Thanks##

Kyle Simpson - He is the creator of LABjs of which is fantastic. All of the _actual_ loading in yepnope uses LABjs under the covers, so that's all him.

Paul Irish - Thanks or whatever.