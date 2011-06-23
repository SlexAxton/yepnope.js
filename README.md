#yepnope.js#

A Conditional Script Loader For Your Polyfills, or Regressive Enhancement With Style.

A small script loader to help use feature detection to load exactly the scripts that your _user_ needs, not just all the scripts that you _think_ they might need.

More docs, etc at: [http://yepnopejs.com](http://yepnopejs.com)

By:

Alex Sexton - AlexSexton [at] gmail
 
Ralph Holzmann - RalphHolzmann [at] gmail


Follow: [@SlexAxton](http://twitter.com/SlexAxton) and [@ralphholzmann](http://twitter.com/ralphholzmann) on Twitter for more updates.

##A simple example (assuming modernizr is there):##

    yepnope([
      {
        test : Modernizr.indexeddb,
        yep  : ['/js/indexeddb-wrapper.js', '/css/coolbrowser.css'],
        nope : ['/js/polyfills/lawnchair.js', '/js/cookies.js', '/css/oldbrowser.css']
      }
    ]);

##A crazy/contrived example:##

    yepnope([
      // straight up load (using a force css prefix)
      'css!http://yayquery.com/css/base.css?alwaysload',
      
      // no tests, just a load and a callback
      {
        load:'http://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.js',
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
        callback: {
          'json2.js' : function() {
            window.alert = window.oldalert;
            console.log('bypassed crock\'s alert in json2 yo, because the test result was: ', testResult);
          }
        }
      }
    ]);



Any forks and stuff are welcome.

##Current Released Version##

1.0.2

NOTE: the code in the github repository is considered in development. Use at your own risk. The download buttons will link to our current release version.

##License##

All of the yepnope specific code is under the WTFPL license. Which means it's also MIT and BSD (or anything you want). However, the inspired works are subject to their own licenses.

All contributions to yepnope should be code that you wrote, and will be subject to the LGPL Contributor Agreement. By sending a pull request, you agree to this.

##Thanks##

Dave Artz       - A.getJS was a huge code-inspiration for our loader. So he's responsible for a ton of awesome techniques here.

Kyle Simpson    - He is the creator of LABjs of which a lot of this is inspired by.

Stoyan Stefanov - His work on resource preloading has been awesome: (http://www.phpied.com/preload-cssjavascript-without-execution/)[http://www.phpied.com/preload-cssjavascript-without-execution/]

Steve Souders   - His evangelism and work in the space (ControlJS) have brought light to the issues at hand, he is the father of front-end performance.

Paul Irish      - Thanks or whatever.
