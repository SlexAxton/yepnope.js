[![Build Status](https://api.travis-ci.org/SlexAxton/yepnope.js.png?branch=v2.0)](https://travis-ci.org/SlexAxton/yepnope.js)

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

Any forks and stuff are welcome.

##Building and Testing##

```sh
# Clone the repo
git clone git@github.com:SlexAxton/yepnope.js.git

# Go inside of it
cd yepnope.js

# Optionally switch branches
git checkout <the-branch-you-want>

# Install the dependencies
npm install

# Run the tests
grunt test

# In order to view them in a browser
grunt serve

# Open the test url in a browser
open http://127.0.0.1:3011/test/

# Run the tests and build
grunt
```

Your build will be in the `dist/` folder.

##Current Released Version##

2.0.0

Version 2 is a significant diversion from Version 1.x. We feel that the direction helps developers make the best decisions for performance rather than enabling poor uses.

Changes in 2.0+ :

* Rewrote entire library

NOTE: the code in the github repository is considered in development. Use at your own risk. The download buttons will link to our current release version.

##License##

All of the yepnope specific code is under the WTFPL license. Which means it's also MIT and BSD (or anything you want). However, the inspired works are subject to their own licenses.

All contributions to yepnope should be code that you wrote, and will be subject to the Dojo CLA. By sending a pull request, you agree to this. All commits thus far have also been committed under this license.

##Thanks##

Dave Artz       - A.getJS was a huge code-inspiration for our loader. So he's responsible for a ton of awesome techniques here.

Kyle Simpson    - He is the creator of LABjs of which a lot of this is inspired by.

Stoyan Stefanov - His work on resource preloading has been awesome: (http://www.phpied.com/preload-cssjavascript-without-execution/)[http://www.phpied.com/preload-cssjavascript-without-execution/]

Steve Souders   - His evangelism and work in the space (ControlJS) have brought light to the issues at hand, he is the father of front-end performance.

Paul Irish      - Thanks or whatever.
