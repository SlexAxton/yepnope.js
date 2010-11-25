/**
 * Yepnope JS
 * 
 * Version 0.2.6pre 
 *
 * by Alex Sexton - AlexSexton@gmail.com 
 *
 * Tri-Licensed WTFPL, BSD, & MIT
 */
(function(window, doc, undef) {
/*!
* A.getJS v1.0
* http://www.artzstudio.com/A.js/getJS/
*
* Developed by: 
* - Dave Artz http://www.artzstudio.com/
*
* Copyright (c) 2010
* Not yet licensed cuz I lack free time.
*/

/*
* A.getJS is a script that loads JavaScript asynchronously while
* preserving execution order via a chaining interface.
* 
* @author        Dave Artz
* @copyright     (c) 2010 Dave Artz
*/

// Artz: Consider implementing Image() for IE? Might be more bloaty.
// http://platform.aol.com/code/upusi/2/edit
function getObject ( elem, url, callback, type ) {
	
	var	object = doc.createElement( elem ),
		done = 0;
	
	object.src = object.data = url;
	object.type = type;
	
	// Attach handlers for all browsers
	object[ strOnLoad ] = object[ strOnReadyStateChange ] = function() {
		
		if ( !done && (!object[ strReadyState ] ||
			object[ strReadyState ] == "loaded" || object[ strReadyState ] == "complete") ) {
			
			// Tell global scripts object this script has loaded.
			// Set scriptDone to prevent this function from being called twice.
			done = 1;
			
			callback( url );
			
			// Handle memory leak in IE
			object[ strOnLoad ] = object[ strOnReadyStateChange ] = null;
			docHead.removeChild( object );
		}
	};
	
	docHead.appendChild( object );
}

function getJS ( urls, urlKeyCallback ) {
	
	function executeJS () {
		
		function executeCallback () {
			
			// If all scripts have been cached in the set, it's time
			// to execute the urlKey callback after the script loads.
			if ( ++cacheCount == thisUrlsCount ) {
				
				// Execute the callback associated with this urlKey
				thisUrlKeyCallback && thisUrlKeyCallback();
				
				// Kill the first item in the url chain and redo executeJS
				urlKeyChain.shift();
				executeJS();
			}
		}
		
		for ( var i = 0,
			thisUrlKey = urlKeyChain[0] || "",
			thisUrls = thisUrlKey.split( urlSplit ),
			thisUrl,
			thisUrlsCount = thisUrls.length,
			thisUrlKeyCallback = urlKeyCallbacks[ thisUrlKey ],
			cacheCount = 0; i < thisUrlsCount; i++ ) {
			
			thisUrl = thisUrls[i];
			
			if ( urlCached[ thisUrl ] ) {
				if ( urlExecuted[ thisUrl ] ) {
					// If we already executed, just do the callback.
					executeCallback();					
				} else {
					// Rememeber that this script already executed.
					urlExecuted[ thisUrl ] = 1;
					type = ""; // Clear out the type so we load normally.
					getObject( strScript, thisUrl, executeCallback, type );	
				}
			}
		}
	}
	
	function getJSCallback ( url ) {

		// Remember that we have this script cached.
		urlCached[ url ] = 1;
		
		// If this callback happens to be for the first urlKey
		// in the chain, we can trigger the execution. 
		urlKey == urlKeyChain[0] && executeJS();
	}
	
	var urlKey = urls.join( urlSplit ),
		urlCountTotal = urls.length,
		i = 0,
		elem = strScript,
		type,
		urlKeyChain = this.c; // Contains an arays of urlKeys of this chain, if available.
		
	// Gecko no longer does what we want out of the box.
	// Use object instead.
	if ( isGecko ) {
		
		elem = "object";
		
	// Manage callbacks and execution order manually.
	} else {
	
		// We set this to something bogus so browsers do not 
		// execute code on our initial request.
		// http://ejohn.org/blog/javascript-micro-templating/
		type = "c";
	}
	
	// If this is a new chain, start a new array, otherwise push the new guy in.
	// This is used to preserve execution order for non FF browsers.
	if ( urlKeyChain ) {
		// Push the urlKey into the chain.
		urlKeyChain.push( urlKey );
	} else {
		// Create a new urlKeyChain to pass on to others.
		urlKeyChain = [ urlKey ];
	}
	
	// Remember the original callback for this key for later.
	urlKeyCallbacks[ urlKey ] = urlKeyCallback;
	// Cache the scripts requested.
	for (; i < urlCountTotal; i++) {
		// Fetch the script.
		getObject( elem, urls[i], getJSCallback, type );
	}
	
	return {
		c: urlKeyChain,
		getJS: getJS
	};
}
var docHead  = doc.getElementsByTagName("head")[0] || doc.documentElement,
    docFirst = docHead.firstChild,
    toString = {}.toString,
    noop     = function(){},
    test     = {
      isArray: Array.isArray || function( obj ) {
        return toString.call(obj) == "[object Array]";  
      },
      isObject: function(obj) {
        // Lame object detection, but don't pass it stupid stuff?
        return typeof obj == "object";
      },
      isString: function(s) {
        return typeof s == "string";
      },
      isFunction: function(fn) {
        return toString.call(fn) == '[object Function]';
      }
    },
    globalFilters = [],
    prefixes = {
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
    urlKeyCallbacks = {},
    urlCached = {},
    urlExecuted = {},
    urlSplit = ",",
    strScript = "script",
    strReadyState = "readyState",
    strOnReadyStateChange = "onreadystatechange",
    strOnLoad = "onload",
    isGecko = ("MozAppearance" in docHead.style),
    
    // Yepnope
    yepnope = function(needs, currentchain) {
  var i,
      need,
      nlen = needs.length,
      // start the chain as a plain instance
      chain = currentchain || getjs;

  function satisfyPrefixes(url) {
    // make sure we have a url
    if (url) {
      // split all prefixes out
      var parts = url.split('!'),
          pLen  = parts.length,
          gLen  = globalFilters.length,
          origUrl = parts[pLen-1],
          res = {
            url: origUrl,
            origUrl: origUrl, // keep this one static for callback variable consistency
            prefixes: (pLen > 1) ? parts.slice(0, pLen-1) : undef
          },
          mFunc, j, z;

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
	    callback = test.isFunction(callback) ? callback : callback[input] || callback[index] || callback[( input.split('/').pop().split('?')[0])]
    }

    // if someone is overriding all normal functionality
    if (instead) {
      return instead(input, callback, chain, index, testResult);
    }
    // If it's specifically css with the prefix, just inject it (useful for weird extensions and cachebusted urls, etc)
    // Also do this if it ends in a .css extension
    else if (incLen > 4 && (forceCSS || (!forceJS && inc.substr(incLen-4) === '.css'))) {
      styleElem = doc.createElement('link');
      
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
      // Don't do a callback if it didn't have one
      chain = chain.script(inc);
      
      // Call the callback if we have one (via the getjs second argument)
      if (callback || autoCallback) {
        chain = chain.wait(function(){
          // pass the callback the unique loaded script
          callback && callback(origInc, testResult, index);
          // If the autoCallback exists, call it
          autoCallback && autoCallback(inc, testResult, index);
        });
      }
    }
    
    return chain;
  }
  
  function loadFromTestObject(testObject, chain) {
      var testResult = !!(testObject.test),
          needGroup = (testResult) ? testObject.yep : testObject.nope,
          // Callback or wait option should cause getjs to block
          callback = testObject.callback || (testObject.wait ? noop : undef);
      
      // If it's a string
      if (test.isString(needGroup)) {
        // Just load the script of style
        chain = loadScriptOrStyle(needGroup, callback, chain, 0, testResult);
      }
      // If it's an array
      else if (test.isArray(needGroup)) {
        // Grab each thing out of it
        for (var l = 0; l < needGroup.length; l++) {
          // Load each thing
          chain = loadScriptOrStyle(needGroup[l], callback, chain, l, testResult);
        }
      }
      
      // Alias 'both' as 'load' so it's more semantic sometimes
      if (testObject.both && !testObject.load) {
        testObject.load = testObject.both;
      }
      
      // get anything in the load object as well
      if (test.isString(testObject.load)) {
        // Just load the script of style
        chain = loadScriptOrStyle(testObject.load, callback, chain, 0, testResult);
      }
      // If it's an array
      else if (test.isArray(testObject.load)) {
        // Grab each thing out of it
        for (var k = 0; k < testObject.load.length; k++) {
          // Load each thing
          chain = loadScriptOrStyle(testObject.load[k], callback, chain, k, testResult);
        }
      }

      // Fire complete callback
      if (testObject.complete) {
        chain = chain.wait(testObject.complete);
      }

      return chain;
  }
  
  // Someone just decides to load a single script or css file as a string
  if (test.isString(needs)) {
    chain = loadScriptOrStyle(needs, false, chain, 0);
  }
  // Normal case is likely an array of different types of loading options
  else if (test.isArray(needs)) {
    // go through the list of needs
    for(i=0; i < nlen; i++) {
      need = needs[i];
      
      // if it's a string, just load it
      if (test.isString(need)) {
        chain = loadScriptOrStyle(need, false, chain, 0);
      }
      // if it's an array, call our function recursively
      else if (test.isArray(need)) {
        chain = yepnope(need, chain);
      }
      // if it's an object, use our modernizr logic to win
      else if (test.isObject(need)) {
        chain = loadFromTestObject(need, chain);
      }
    }
  }
  // Allow a single object to be passed in
  else if (test.isObject(needs)) {
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
yepnope.getjs = getjs;

// Leak me
window.yepnope = yepnope;
})(this, this.document);
