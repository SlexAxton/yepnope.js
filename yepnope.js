// yepnope.js
// Version - 2.0.0pre
//
// by
// Alex Sexton - @SlexAxton - AlexSexton[at]gmail.com
// Ralph Holzmann - @ralphholzmann - ralphholzmann[at]gmail.com
//
// http://yepnopejs.com/
// https://github.com/SlexAxton/yepnope.js/
//
// Tri-license - WTFPL | MIT | BSD
//
// Please minify before use.
// Also available as Modernizr.load via the Modernizr Project

window.yepnope = (function (window, document, undef) {
  // Yepnope's style is intentionally very flat to aid in
  // minification. The authors are usually against too much
  // self-minification, but in the case of a script loader, we're
  // especially file size sensitive. For this reason we also use
  // Closure Compiler Advanced Optimizations (as well as uglify).

  // Some aliases
  var sTimeout = window.setTimeout;
  var firstScript;
  var scriptCache = {};
  var scriptsQueue = [];
  var count = 0;
  var toString = {}.toString;

  // This is just used for a race condition,
  // so even if it fails it's not a huge risk
  var isOldIE = !!document.attachEvent && !(window.opera && toString.call(window.opera) == "[object Opera]");

  function noop (){}

  // Helper functions
  function isArray (obj) {
    return toString.call(obj) == '[object Array]';
  }

  function isObject (obj) {
    return Object(obj) === obj;
  }

  function isString (s) {
    return typeof s == 'string';
  }

  function isFunction (fn) {
    return toString.call( fn ) == '[object Function]';
  }

  // Loader Utilities
  function uniq () {
    return 'yn_' + (count++);
  }

  function readFirstScript () {
    if (!firstScript || !firstScript.parentNode) {
      firstScript = document.getElementsByTagName('script')[0];
    }
  }

  function isFileReady (readyState) {
    // Check to see if any of the ways a file can be ready are available as properties on the file's element
    return (!readyState || readyState == 'loaded' || readyState == 'complete' || readyState == 'uninitialized');
  }

  function runWhenReady (src, cb) {
    var fn = scriptCache[src];
    if (fn) {
      fn.call(window);
      cb();
    }
  }

  // Inject a script into the page and know when it's done
  function injectJs (src, cb, attrs, timeout) {
    cb = cb || noop;

    var cached = scriptCache[src];

    // If we already have a cached function for this just run it
    if (cached) {
      if (yepnope['dupes']) {
        runWhenReady(src, cb);
      }
      else {
        cb();
      }
      return;
    }

    var script = document.createElement('script');
    var attrs = attrs || {};
    var done;
    var i;

    timeout = timeout || yepnope['errorTimeout'];

    script.src = src;

    // IE Race condition
    // http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
    if (isOldIE) {
      script.event = 'onclick';
      script.id = script.htmlFor = attrs['id'] || uniq();
    }

    // Add our extra attributes to the script element
    for (i in attrs) {
      script.setAttribute(i, attrs[i]);
    }

    // Bind to load events
    script.onreadystatechange = script.onload = function () {

      if ( !done && isFileReady(script.readyState) ) {
        // Set done to prevent this function from being called twice.
        done = 1;

        // Second half of IE race condition hack
        if (isOldIE) {
          try {
            script.onclick();
          }
          catch (e) {}
        }

        scriptCache[src] = scriptsQueue.shift();
        runWhenReady(src, cb);

        // Handle memory leak in IE
        script.onload = script.onreadystatechange = script.onerror = null;
      }
    };

    // This won't work in every browser, but
    // would be helpful in those that it does.
    // http://stackoverflow.com/questions/2027849/how-to-trigger-script-onerror-in-internet-explorer/2032014#2032014
    // For those that don't support it, the timeout will be the backup
    script.onerror = function () {
      done = 1;
      cb(new Error('Script Error: ' + src));
      // We don't waste bytes on cleaning up memory in error cases
      // because hopefully it doesn't happen often enough to matter.
      // And you're probably already in an 'uh-oh' situation.
    };

    // 404 Fallback
    sTimeout(function () {
      if (!done) {
        done = 1;
        // Might as well pass in an error-state if we fire the 404 fallback
        cb(new Error('Timeout: ' + src));
      }
    }, timeout);

    // Inject script into to document
    readFirstScript();
    firstScript.parentNode.insertBefore(script, firstScript);
  }

  // Take the arguments passed to yepnope
  // and group them with their appropriate
  // actions.
  function parseArgs (args) {
    var i;
    var len = args.length;

    // Loop over the args
    for(i = 0; i < len; i++) {

    }
  }

  // The leaked function. Mostly just takes a set
  // of arguments, and then passes them to be run.
  function yepnope () {
    var args = [].slice.apply(arguments);
  }

  function wrap (fn) {
    scriptsQueue.push(fn);
  }

  // Add a default for the error timer
  yepnope['errorTimeout'] = 10e3;
  // Expose no BS script injection
  yepnope['injectJs'] = injectJs;
  // Expose the wrapper
  yepnope['wrap'] = wrap;

  return yepnope;
})(window, document);
