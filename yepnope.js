/**
 * yepnope.js 0.5.0pre
 * by Alex Sexton - AlexSexton@gmail.com 
 *
 * Major Contributions by:
 * Ralph Holzmann - @ralphholzmann
 *
 * Tri-Licensed WTFPL, BSD, & MIT
 *
 * Yepnope relies on a script loading technique
 * inspired by A.getJS
*/
(function(window, doc, undef) {

  /* Loader helper functions */
  function isScriptReady( script ) {
    return ( ! script[strReadyState] || script[strReadyState] == "loaded" || script[strReadyState] == "complete");
  }

  function getLoader() {
    return {
      load: load,
      i : 0
    };
  }
  function getYepnope() {
    var y = yepnope;
    y.loader = getLoader();
    return y;
  }

  function callJsWhenReady() {

    var execStackReady = 1,
        i;

    for (var i = -1, len = execStack.length; ++i < len;) {
      if ( execStack[i].src && ! ( execStackReady = isScriptReady( execStack[i] ))) {        
        break;
      }
    }
    if ( execStackReady ) {
      execJs();
    }
  }

  function execJs(a) {
    var i = execStack[strShift]();
    started = 1;

    if ( i ) {
      if ( i.src ) {
        loadJs(strScript, i.src, "") 
      } else {
        i.call(getLoader());
        started = 0;
        callJsWhenReady();
      }
    }
  }

  function loadJs( elem, url, type, splicePoint ) {

    function onload() {
      // If the script is loaded
      if ( ! done && isScriptReady( script ) ) {

        // Set done to prevent this function from being called twice.
        done = 1;
        script.onloadCalled = 1;

        // If the type is set, that means that we're offloading execution
        if ( ! type || (type && ! started) ) {

          callJsWhenReady();
        }

        // Handle memory leak in IE
        script[strOnLoad] = script[strOnReadyStateChange] = null;
        type && docHead.removeChild(script);
      }
    };

    // Create script element
    var script    = doc.createElement( elem ),
        done      = 0,
        execArr;

    script.src    = script.data = url;
    type && (script.type   = type);

    // Just in case
    if (defaultsToAsync) {
      // Breaks in a few FF4 Betas, but fixed now (via LABjs)
      script.async = strFalse;
    }

    // Attach handlers for all browsers
    script[strOnLoad] = script[strOnReadyStateChange] = onload;
    
    if ( isOpera ) {
      script.onerror = onload;
    } else if ( type || ( isGecko && elem == strScript )) {
      script.onerror = function(){
        if ( ! done ) {
          done = 1;
          execJs();      
        }
      };
    }

    type && execStack.splice( splicePoint, 0, script);

    docHead.appendChild(script);
  }

  function load() {

    var a = arguments,
        count = a.length,
        i;
    
    for (i = 0, q = 0; i < count; i++) {
      if ( isString( a[i] )) {
        loadJs( strElem, a[i], 'x', this.i++);
      } else {
        execStack.splice(this.i++, 0, a[i]);
      }
    }

    // OMG is this jQueries? For chaining...
    return this;

  }
  /* End loader helper functions */

var docElement            = doc.documentElement,
    docHead               = doc.getElementsByTagName("head")[0] || docElement,
    docFirst              = docHead.firstChild,
    toString              = {}.toString,
    strScript             = "script",
    strFalse              = "false",
    strShift              = "shift",
    strReadyState         = "readyState",
    strOnReadyStateChange = "onreadystatechange",
    strOnLoad             = "onload",
    noop                  = function(){},
    strObject             = "object",
    execStack             = [],
    loading               = 0,
    started               = 0,
    defaultsToAsync       = (doc.createElement(strScript).async === true),
    isGecko               = ("MozAppearance" in docElement.style),
    // Thanks to @jdalton for this opera detection 
    isOpera               = window.opera && toString.call(window.opera) == "[" + strObject + " Opera]"
    strElem               = isGecko ? strObject : ( isOpera ? 'img' : strScript ),
    isArray               = Array.isArray || function(obj) {
      return toString.call(obj) == "[" + strObject + " Array]";  
    },
    isObject              = function(obj) {
      // Lame object detection, but don't pass it stupid stuff?
      return typeof obj == strObject;
    },
    isString              = function(s) {
      return typeof s == "string";
    },
    isFunction            = function(fn) {
      return toString.call(fn) == "[" + strObject + ' Function]';
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
    
    // Yepnope Function
    yepnope               = function(needs) {
    
    var i,
        needs,
        nlen  = needs.length,
        // start the chain as a plain instance
        chain = this.yepnope.loader || getLoader();

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
        chain.load(inc);

        // If we have a callback, we'll start the chain over
        if (isFunction(callback) || isFunction(autoCallback)) {
          // Call getJS with our current stack of things
          chain.load(function(){
            // Hijack yepnope and restart index counter
            yepnope = getYepnope();
            // Call our callbacks with this set of data
            callback && callback(origInc, testResult, index);
            autoCallback && autoCallback(origInc, testResult, index);
          });
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
          chain = chain.load(testObject.complete);
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
  
    // allow more loading on this chain
    return chain;
  };

  yepnope.addPrefix = function(prefix, callback) {
    prefixes[prefix] = callback;
  };
  
  yepnope.addFilter = function(filter) {
    globalFilters.push(filter);
  };
  
  // Attach loader 
  yepnope = getYepnope();
  
  // Leak me
  window.yepnope    = yepnope;
    
})(this, this.document);
