[![Build Status](https://api.travis-ci.org/SlexAxton/yepnope.js.svg?branch=master)](https://travis-ci.org/SlexAxton/yepnope.js)

# Deprecation Notice

**TL;DR: we've replaced what yepnope used to do with a very minimal script to help you do what we think is best for your apps.**

The authors of yepnope feel that the front-end community now offers better software for loading scripts, as well
as conditionally loading scripts. None of the APIs for these new tools are quite as easy as yepnope, but we assure
you that it's probably worth your while. We don't officially endorse any replacement, however we strongly suggest
you follow an approach using modules, and then package up your application using require.js, webpack, browserify,
or one of the many other excellent **dependency managed** build tools.

When it comes to loading things conditionally, we suggest that you output a build for each combination of the things
you're testing. This might sound like it will generate a lot of files (it might), but computers are pretty good
at that. Then you can inline a script into your page that only loads (asynchronously!) a single built script
that is tuned to the features of that user. All the performance win of conditional loading, and none of the
latency problems of loading 100 things at once.

**We have replaced this repo with a script that will help you load the correct conditional build and will
only be taking issues and pull requests for this new script. It retains many of the original functions
and features as the original yepnope. However it no longer executes scripts in an order. If you're looking
for something that specifically does that, you can use an old version of yepnope, or another in-order
script loader like LABjs.**

For these reasons, we're also not going to include yepnope in the next version of Modernizr as `Modernizr.load`.

# yepnope.js

A Script Loader For Your Conditional Builds

By [@SlexAxton](http://twitter.com/SlexAxton) and [@rlph](http://twitter.com/rlph)

## Example

```javascript
// It will Do The Right Thing™ with a .js or .css extension
yepnope('script.js', {
  modernimages: Modernizr.webp && Modernizr.apng,
  css3: Modernizr.borderradius && Modernizr.boxshadow,
  consoleapis: window.console && window.console.log
});
```

And a request for `script.js?yep=css3,consoleapis&nope=modernimages` would be made (assuming that set of results).

**It's up to you to serve the correct build file from that url (you should statically build and/or cache this endpoint)**

## With Modernizr

If you're running a custom build of Modernizr (version 3+), the only "own properties" of the `Modernizr` object are the
tests. All other properties are stored on the prototype. Because of this, you can easily just pass yepnope your `Modernizr`
object, and not have to worry about creating a test object.

```javascript
yepnope('build.js', Modernizr, function() {
  MyApp.init();
});
```

## Just regular script and css injection

We also expose our underlying script and css injection functions as

* `yepnope.injectJs`
* `yepnope.injectCss` (The callback does not wait for the css to actually be loaded)

The `tests` are a good place to look at the uses.

## Customizing the generated URL

If you need the generated URL from the tests to look a certain way, feel free to override the
`yepnope.urlFormatter` function.

```javascript
// change it to only output passing tests, as dashes on the file name
yepnope.urlFormatter = function(url, tests) {
  var parts = url.split('.');
  var extension = parts.pop();
  var filename = parts.join('.');
  var passes = [];

  if (tests) {
    for(var testname in tests) {
      if (tests.hasOwnProperty(testname) && tests[testname]) {
        passes.push(testname);
      }
    }
  }
  if (passes.length) {
    return filename + '-' + passes.join('-') + '.' + extension;
  }
  return url;
};
```

Then the url generated from the first example above would be: `script-css3-consoleapis.js`

## Building and Testing

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
open http://127.0.0.1:3333/test/

# Run the tests and build
grunt
```

Your build will be in the `dist/` folder.

## CHANGELOG

Version 2 is a significant diversion from Version 1.x. We feel that the direction helps developers make the best decisions for performance rather than enabling poor uses.

Changes in 2.0+ :

* Rewrote entire library
* Relicensed to New BSD
* Deprecated Library

## License

### BSD-3-Clause License

```
Copyright (c) 2014, Alex Sexton
Copyright (c) 2014, Ralph Holzmann
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```

##Thanks##

* Dave Artz - A.getJS was a huge code-inspiration for our loader. So he's responsible for a ton of awesome techniques here.
* Kyle Simpson - He is the creator of LABjs of which a lot of this is inspired by.
* Stoyan Stefanov - His work on resource preloading has been awesome: [http://www.phpied.com/preload-cssjavascript-without-execution/](http://www.phpied.com/preload-cssjavascript-without-execution/)
* Steve Souders - His evangelism and work in the space (ControlJS) have brought light to the issues at hand, he is the father of front-end performance.

