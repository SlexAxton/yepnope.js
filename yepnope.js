/**
 * yepnope.js 0.5.0pre
 * by Alex Sexton - AlexSexton@gmail.com 
 *
 * Major Contributions by:
 * Ralph Holzmann - @ralphholzmann
 *
 * Tri-Licensed WTFPL, BSD, & MIT
 *
 * Yepnope relies on a modified version of A.getJS
 * ==========================
 * | A.getJS v1.0
 * | http://www.artzstudio.com/A.js/getJS/
 * |
 * | Developed by: 
 * | - Dave Artz http://www.artzstudio.com/
 * |
 * | Copyright (c) 2010
 * | Not yet licensed cuz I lack free time.
 * |
 * | A.getJS is a script that loads JavaScript asynchronously while
 * | preserving execution order via a chaining interface.
 * ============================
 */

(function(window, doc, undef) {
  function getObject(elem, url, callback, type) {
    
    var object = doc.createElement(elem),
        done   = 0;
        
    object.src   = object.data = url;
    object.type  = type;

    // Just in case
    if (type == strScript && isAsyncable) {
      // Breaks in a few FF4 Betas, but fixed now (via LABjs)
      object.async = strFalse;
    }
        
    // Attach handlers for all browsers
    object[strOnLoad] = object[strOnReadyStateChange] = function() {
                
      if ( !done && (!object[strReadyState] || object[strReadyState] == "loaded" || object[strReadyState] == "complete") ) {

        // Tell global scripts object this script has loaded.
        // Set scriptDone to prevent this function from being called twice.
        done = 1;
                
        callback(url);

        // Handle memory leak in IE
        object[strOnLoad] = object[strOnReadyStateChange] = null;
        docHead.removeChild(object);
      }
    };

    docHead.appendChild(object);
  }

  function getJS(urls, urlKeyCallback) {
    
    function executeJS() {
      
      function executeCallback() {

        // If all scripts have been cached in the set, it's time
        // to execute the urlKey callback after the script loads.
        if (++cacheCount == thisUrlsCount) {

          // Execute the callback associated with this urlKey
          thisUrlKeyCallback && thisUrlKeyCallback();

          // Kill the first item in the url chain and redo executeJS
          urlKeyChain.shift();
          executeJS();
        }
      }

      for (var i = 0,
               thisUrlKey = urlKeyChain[0] || "",
               thisUrls = thisUrlKey.split( urlSplit ),
               thisUrl,
               thisUrlsCount = thisUrls.length,
               thisUrlKeyCallback = urlKeyCallbacks[ thisUrlKey ],
               cacheCount = 0; i < thisUrlsCount; i++ ) {
                        
        thisUrl = thisUrls[i];
        if (urlCached[thisUrl]) {

          if (urlExecuted[thisUrl]) {
            // If we already executed, just do the callback.
            executeCallback();                                  
          }
          else {
            // Rememeber that this script already executed.
            urlExecuted[thisUrl] = 1;
            // Clear out the type so we load normally.
            type = ""; 
            getObject(strScript, thisUrl, executeCallback, type);       
          }
        }
      }
    }

    function getJSCallback(url) {

      // Remember that we have this script cached.
      urlCached[url] = 1;

      // If this callback happens to be for the first urlKey
      // in the chain, we can trigger the execution. 
      urlKey == urlKeyChain[0] && executeJS();
    }

    var urlKey        = urls.join(urlSplit),
        urlCountTotal = urls.length,
        i             = 0,
        elem          = strScript,
        type,
        // Contains an arays of urlKeys of this chain, if available.
        urlKeyChain = this.c;
                
    // Manage callbacks and execution order manually.
    // We set this to something bogus so browsers do not 
    // execute code on our initial request.
    // http://ejohn.org/blog/javascript-micro-templating/
    type = "c";
        
    // If this is a new chain, start a new array, otherwise push the new guy in.
    // This is used to preserve execution order for non FF browsers.
    if (urlKeyChain) {
      // Push the urlKey into the chain.
      urlKeyChain.push(urlKey);
    }
    else {
      // Create a new urlKeyChain to pass on to others.
      urlKeyChain = [urlKey];
    }

    // Remember the original callback for this key for later.
    urlKeyCallbacks[urlKey] = urlKeyCallback;
    // Cache the scripts requested.
    for (; i < urlCountTotal; i++) {
      // Fetch the script.
      getObject(elem, urls[i], getJSCallback, type);
    }

    return {
      c     : urlKeyChain,
      getJS : getJS
    };
  }

var docElement            = doc.documentElement,
    docHead               = doc.getElementsByTagName("head")[0] || docElement,
    docFirst              = docHead.firstChild,
    toString              = {}.toString,
    noop                  = function(){},
    preObj                = "[object ",
    isArray               = Array.isArray || function(obj) {
      return toString.call(obj) == "[object Array]";  
    },
    isObject              = function(obj) {
      // Lame object detection, but don't pass it stupid stuff?
      return typeof obj == "object";
    },
    isString              = function(s) {
      return typeof s == "string";
    },
    isFunction            = function(fn) {
      return toString.call(fn) == preObj + 'Function]';
    },
    globalFilters         = [],
    prefixes              = {
      'css': function(resource) {
        resource.forceCSS = true;
        return resource;
      },
      'wait': function(resource) {
        // This just adds an empty callback to force a wait
        resource.autoCallback = noop;
        return resource;
      }
    },
    urlKeyCallbacks       = {},
    urlCached             = {},
    urlExecuted           = {},
    urlSplit              = ",",
    strFalse              = "false",
    strScript             = "script",
    strReadyState         = "readyState",
    strOnReadyStateChange = "onreadystatechange",
    strOnLoad             = "onload",
    isOrderSafe           = ("MozAppearance" in docElement.style) || (window.opera && toString.call(window.opera) == (preObj+"Opera]")) || (doc.createElement(strScript).async === true),
    
    // Yepnope Function
    yepnope               = function(needs, currentchain, stack) {
    
    // Allow the recursive stack
    stack = stack || [];

    var i,
        need,
        nlen  = needs.length,
        // start the chain as a plain instance
        chain = currentchain || {getJS:getJS};

    function satisfyPrefixes(url) {
      // make sure we have a url
      if (url) {
        // split all prefixes out
        var parts   = url.split('!'),
            pLen    = parts.length,
            gLen    = globalFilters.length,
            origUrl = parts[pLen-1],
            res     = {
              url      : origUrl,
              // keep this one static for callback variable consistency
              origUrl  : origUrl, 
              prefixes : (pLen > 1) ? parts.slice(0, pLen-1) : undef
            },
            mFunc,
            j,
            z;

        // loop through prefixes
        // if there are none, this automatically gets skipped
        for (j = 0; j < pLen-1; j++) {
          mFunc = prefixes[parts[j]];
          if (mFunc) {
            res = mFunc(res);
          }
        }
      
        // Go through our global filters
        for (z = 0; z < gLen; z++) {
          res = globalFilters[z](res);
        }

        // return the final url
        return res;
      }
      return false;
    }
  
    function loadScriptOrStyle(input, callback, chain, index, testResult) {
      // run through our set of prefixes
      var resource = satisfyPrefixes(input);

      // if no object is returned or the url is empty/false just exit the load
      if (!resource || !resource.url || resource.bypass) {
        return chain;
      }
    
      var inc          = resource.url,
          origInc      = resource.origUrl,
          incLen       = inc.length,
          instead      = resource.instead,
          autoCallback = resource.autoCallback,
          forceJS      = resource.forceJS,
          forceCSS     = resource.forceCSS,
          styleElem;
    
      // Determine callback, if any
      if ( callback ) {
        callback = isFunction(callback) ? callback : callback[input] || callback[index] || callback[( input.split('/').pop().split('?')[0])];
      }

      // if someone is overriding all normal functionality
      if (instead) {
        return instead(input, callback, chain, index, testResult);
      }
      // If it's specifically css with the prefix, just inject it (useful for weird extensions and cachebusted urls, etc)
      // Also do this if it ends in a .css extension
      else if (incLen > 4 && (forceCSS || (!forceJS && inc.substr(incLen-4) === '.css'))) {
        styleElem      = doc.createElement('link');
      
        // add our src to it
        styleElem.href = inc;
        styleElem.rel  = 'stylesheet';
        styleElem.type = 'text/css';
      
        // inject the file
        docHead.insertBefore(styleElem, docFirst);
      
      
        // call the callback
        callback && callback(origInc, testResult, index)
        autoCallback && autoCallback(origInc, testResult, index);
      }
      // Otherwise assume that it's a script
      else {
        stack.push(inc);

        // If we have a callback, we'll start the chain over
        if (isFunction(callback) || isFunction(autoCallback)) {
          // Call getJS with our current stack of things
          chain = chain.getJS(stack, function(){
            // Call our callbacks with this set of data
            callback && callback(origInc, testResult, index);
            autoCallback && autoCallback(origInc, testResult, index);
          });
          // Reset the stack
          stack = [];
        }
      }
    
      return chain;
    }
  
    function loadFromTestObject(testObject, chain) {
        var testResult = !!(testObject.test),
            needGroup  = (testResult) ? testObject.yep : testObject.nope,
            // Callback or wait option should cause getjs to block
            callback   = testObject.callback || (testObject.wait ? noop : undef),
            k,
            l;
      
        // If it's a string
        if (isString(needGroup)) {
          // Just load the script of style
          chain = loadScriptOrStyle(needGroup, callback, chain, 0, testResult);
        }
        // If it's an array
        else if (isArray(needGroup)) {
          // Grab each thing out of it
          for (l = 0; l < needGroup.length; l++) {
            // Load each thing
            chain = loadScriptOrStyle(needGroup[l], callback, chain, l, testResult);
          }
        }
      
        // Alias 'both' as 'load' so it's more semantic sometimes
        if (testObject.both && !testObject.load) {
          testObject.load = testObject.both;
        }
      
        // get anything in the load object as well
        if (isString(testObject.load)) {
          // Just load the script of style
          chain = loadScriptOrStyle(testObject.load, callback, chain, 0, testResult);
        }
        // If it's an array
        else if (isArray(testObject.load)) {
          // Grab each thing out of it
          for (k = 0; k < testObject.load.length; k++) {
            // Load each thing
            chain = loadScriptOrStyle(testObject.load[k], callback, chain, k, testResult);
          }
        }

        // Fire complete callback
        if (testObject.complete) {
          chain = chain.getJS(stack, testObject.complete);
          stack = [];
        }
  
        return chain;
    }
  
    // Someone just decides to load a single script or css file as a string
    if (isString(needs)) {
      chain = loadScriptOrStyle(needs, false, chain, 0);
    }
    // Normal case is likely an array of different types of loading options
    else if (isArray(needs)) {
      // go through the list of needs
      for(i=0; i < nlen; i++) {
        need = needs[i];
      
        // if it's a string, just load it
        if (isString(need)) {
          chain = loadScriptOrStyle(need, false, chain, 0);
        }
        // if it's an array, call our function recursively
        else if (isArray(need)) {
          chain = yepnope(need, chain, stack);
        }
        // if it's an object, use our modernizr logic to win
        else if (isObject(need)) {
          chain = loadFromTestObject(need, chain);
        }
      }
    }
    // Allow a single object to be passed in
    else if (isObject(needs)) {
      chain = loadFromTestObject(needs, chain);
    }

    // Since we're queueing up requests between callbacks
    // if we still have stuff left over at the end
    // then we'll just call it with straight up
    if (stack.length) {
      chain = chain.getJS(stack);
    }
  
    // allow more loading on this chain
    return chain;
  };

  yepnope.addPrefix = function(prefix, callback) {
    prefixes[prefix] = callback;
  };
  
  yepnope.addFilter = function(filter) {
    globalFilters.push(filter);
  };
  
  yepnope.getJS     = getJS;

  // Leak me
  window.yepnope    = yepnope;
  
})(this, this.document);
