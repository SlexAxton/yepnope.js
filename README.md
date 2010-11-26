#Yepnope JS#

A Script Loader For Your Polyfills, or Regressive Enhancement With Style.

A small script loader to help use feature detection to load exactly the scripts that your _user_ needs, not just all the scripts that you _think_ they might need.

More docs, etc at: [http://yepnopejs.com]

##A simple example (assuming modernizr is there):##

    yepnope([
      {
        test : Modernizr.indexeddb,
        yep  : ['/js/indexeddb-wrapper.js', '/css/coolbrowser.css'],
        nope : ['/js/polyfills/lawnchair.js', '/js/cookies.js', '/css/oldbrowser.css']
      }
    ]);

##Common Use:##

###The `wait` Flag###
Forcing a wait between _all_ dependencies. The `wait` flag will ensure all items within the group execute in order, as well as before all subsequent groups.
In this example: `jquery.js` will execute before anything in the next group, and `googleapis.js` will execute before `needs-googleapis.js`. The `wait` flag is more of a global way to force order.

    yepnope([
      {
        load: 'js/jquery.js',
        wait: true
      },
      {
        test: Modernizr.geolocation,
        nope: ['googleapi.js', 'needs-googleapi.js'],
        wait: true
      }
    ]);

###The `wait!` prefix###
Adding the `wait!` prefix to your scripts will ensure that anything listed after that script will wait for it. This includes within a single array of script strings:
In this case, only `polyfill.js` has the `wait!` prefix, so `needs-polyfill.js` and `doesnt-need-anything.js` will execute after `polyfill.js` but may execute in different orders, between the two of them. The less `wait` calls you have, the faster your code may end up (as a general rule).

    yepnope([
    {
      test: Modernizr.borderradius,
      nope: ['wait!polyfill.js', 'needs-polyfill.js']
    },
    {
      test: Modernizr.multiplebgs,
      nope: ['doesnt-need-anything.js']
    }
    ]);

##A crazy/contrived example:##

    yepnope([
      // straight up load (using a force css prefix)
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
        
        // If it passes, 'yep' is completely optional, so let's not load anything...
        
        // If it fails
        nope: [
          'http://github.com/madrobby/vapor.js/raw/master/vapor.min.js',
          'css!http://yayquery.com/css/base.css?supports3d=false' //prefix with css! if it doesn't end in .css
        ],
        
        // Load it no matter what
        both: 'http://www.json.org/json2.js',
        
        // For each thing loaded
        callback: function(id, testResult) {
          
          // check for the load of json2, specifically
          if (id === 'http://www.json.org/json2.js') {
            window.alert = window.oldalert;
            console.log('bypassed crock\'s alert in json2 yo, because the test result was: ', testResult);
          }
        }
      }
    ]);



Any forks and stuff are welcome.

##Current Version##

0.5.0 

##License##

All of the yepnope specific code is under the WTFPL license. Which means it's also MIT and BSD (or anything you want). However, A.getJS is subject to it's own license (currently unlicensed)

##Thanks##

Ralph Holzmann - A lot of Yepnope's code is his.

Dave Artz      - A.getJS is his. It's tiny and fast. Yay.

Kyle Simpson   - He is the creator of LABjs of which a lot of this is inspired by.

Paul Irish     - Thanks or whatever.
