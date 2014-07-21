// yepnope.js
// Version - 2.0.0
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
  var linkCache = {};
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

  function runWhenReady (src, cb, justTheCallback) {
    var fn = scriptCache[src];

    sTimeout(function(){
      // This is far from correct, but fine as a start
      if (typeof fn == 'function') {
        if (!justTheCallback) {
          fn.call(window);
        }
        cb.call(window);
      }
      // Otherwise, just call the callback
      else if (fn) {
        cb.call(window);
      }
    });
  }

  // Inject a script into the page and know when it's done
  function injectJs (options, cb) {
    var src, attrs, timeout, wrapped;

    if (isString(options)) {
      src = options;
    }
    else if (isObject(options)) {
      src = options.src;
      attrs = options.attrs;
      timeout = options.timeout;
      wrapped = options.wrapped;
    }


    cb = cb || noop;
    attrs = attrs || {};

    var cached = scriptCache[src];

    // If we already have a cached function for this just run it
    // as long as we're in a wrapped mode
    if (cached && wrapped) {

      // If we're allowing things to execute twice
      if (yepnope.dupes) {
        // Run the the contents of the wrapper again
        // then run the new callback
        runWhenReady(src, cb);
      }
      else {
        // Otherwise just run the callback
        // but still wait to make sure the src isn't still loading
        runWhenReady(src, cb, true);
      }
      // In all cases we're done
      return;
    }
    // If we're not wrapped, but cached (the script has been requested before)
    else if (cached && !wrapped) {
      if (!yepnope.dupes) {
        // In case the script has been called, but not completed
        runWhenReady(src, cb, true);
        return;
      }
      // otherwise just reinject and it'll rerun like normal
    }

    var script = document.createElement('script');
    var done;
    var i;

    timeout = timeout || yepnope.errorTimeout;

    script.src = src;

    // Ensure that his url is marked as active,
    // so we don't try to load it with itself
    // simultaneously.
    scriptCache[src] = true;

    // IE Race condition
    // http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
    if (isOldIE) {
      script.event = 'onclick';
      script.id = script.htmlFor = attrs.id || uniq();
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
            // By calling this here, we create a synchronous
            // execution of the contents of the script
            // and the execution of the callback below.
            script.onclick();
          }
          catch (e) {}
        }

        if (wrapped) {
          scriptCache[src] = scriptsQueue.pop();
        }

        // Run the inside and then the callback if it's wrapped,
        // otherwise, just run the callback
        runWhenReady(src, cb, !wrapped);
      }

      // Handle memory leak in IE
      script.onload = script.onreadystatechange = script.onerror = null;
    };

    // This won't work in every browser, but
    // would be helpful in those that it does.
    // http://stackoverflow.com/questions/2027849/how-to-trigger-script-onerror-in-internet-explorer/2032014#2032014
    // For those that don't support it, the timeout will be the backup
    script.onerror = function () {
      // Don't call the callback again, so we mark it done
      done = 1;
      cb(new Error('Script Error: ' + src));
      // We don't waste bytes on cleaning up memory in error cases
      // because hopefully it doesn't happen often enough to matter.
      // And you're probably already in an 'uh-oh' situation.
    };

    // 404 Fallback
    sTimeout(function () {
      // Don't do anything if the script has already finished
      if (!done) {
        // Mark it as done, which means the callback won't run again
        // and if you're using wrapped scripts, then the contents won't
        // execute if it ever finishes. For unwrapped scripts, you're a
        // bit SOL if this finishes way down the line and you don't want it
        // to execute as there's no reliable 'cancel' once we've started loading
        // it in the dom.
        done = 1;

        // Might as well pass in an error-state if we fire the 404 fallback
        cb(new Error('Timeout: ' + src));
      }
    }, timeout);

    // Inject script into to document
    readFirstScript();
    firstScript.parentNode.insertBefore(script, firstScript);
  }

  function injectCss (options, cb) {
    var href;
    var attrs = {};
    var i;
    var media;

    // optionally accept an object of settings
    // or a string that's the url
    if (isObject(options)) {
      href = options.href;
      attrs = options.attrs || {};
    }
    else if (isString(options)) {
      href = options;
    }

    // Create stylesheet link
    var link = document.createElement('link');

    cb = cb || noop;

    // No need to check 'dupes' since nothing new happens
    if (!linkCache[href]) {
      linkCache[href] = true;
      // Add attributes
      link.href = href;
      link.rel = 'stylesheet';
      // Technique to force non-blocking loading from:
      // https://github.com/filamentgroup/loadCSS/blob/master/loadCSS.js#L20
      link.media = 'only x';
      link.type = 'text/css';

      // On next tick, just set the media to what it's supposed to be
      sTimeout(function() {
        link.media = attrs.media || 'all';
      });

      // Add our extra attributes to the link element
      for (i in attrs) {
        link.setAttribute(i, attrs[i]);
      }

      readFirstScript();
      // We append link tags so the cascades work as expected.
      // A little more dangerous, but if you're injecting CSS
      // dynamically, you probably can handle it.
      firstScript.parentNode.appendChild(link);
    }

    // Always just run the callback for CSS on next tick. We're not
    // going to try to normalize this, so don't worry about runwhenready here.
    sTimeout(function() {
      cb.call(window);
    });
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
  yepnope.errorTimeout = 10e3;
  // Expose no BS script injection
  yepnope.injectJs = injectJs;
  // Expose super-lightweight css injector
  yepnope.injectCss = injectCss;
  // Expose the wrapper
  yepnope.wrap = wrap;
  // Default to allow duplicate executions of scripts
  yepnope.dupes = true;

  return yepnope;
})(window, document);
