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
 * inspired by A.getJS by Dave Artz
*/
(function(window, doc, undef) {

var docElement            = doc.documentElement,
    docHead               = doc.getElementsByTagName("head")[0] || docElement,
    docBody               = doc.getElementsByTagName("body")[0] || doc.body,
    docFirst              = docHead.firstChild,
    errorTimeout          = 5000,
    toString              = {}.toString,
    jsType                = 'j',
    cssType               = 'c',
    strScript             = "script",
    strFalse              = "false",
    strShift              = "shift",
    strReadyState         = "readyState",
    strOnReadyStateChange = "onreadystatechange",
    strOnLoad             = "onload",
    strObject             = "object",
    strImg                = "img",
    strPreobj             = "[" + strObject + " ",
    noop                  = function(){},
    execStack             = [],
    started               = 0,
    strAppear             = 'Appearance',
    defaultsToAsync       = (doc.createElement(strScript).async === true),
    isGecko               = ("Moz"+strAppear in docElement.style),
    isGecko18             = isGecko && !! window.Event.prototype.preventBubble,
    // Thanks to @jdalton for this opera detection 
    isOpera               = window.opera && toString.call(window.opera) == strPreobj + "Opera]",
    isWebkit              = ("webkit"+strAppear in docElement.style),
    strJsElem             = isOpera || isGecko18 ? strImg : ( isGecko ? strObject : strScript ),
    strCssElem            = isWebkit ? strImg : strJsElem,
    isArray               = Array.isArray || function(obj) {
      return toString.call(obj) == strPreobj + "Array]";  
    },
    isObject              = function(obj) {
      // Lame object detection, but don't pass it stupid stuff?
      return typeof obj == strObject;
    },
    isString              = function(s) {
      return typeof s == "string";
    },
    isFunction            = function(fn) {
      return toString.call(fn) == strPreobj + 'Function]';
    },
    globalFilters         = [],
    prefixes              = {
      'css': function(resource) {
        resource.forceCSS = true;
        return resource;
      }
    },
    yepnope;


  /* Loader helper functions */
  function isFileReady( script ) {
    return ( ! script[strReadyState] || script[strReadyState] == "loaded" || script[strReadyState] == "complete");
  }

  function execWhenReady() {
    var execStackReady = 1,
        len,
        i;

    for (i = -1, len = execStack.length; ++i < len;) {
      if ( execStack[i].src && ! ( execStackReady = isFileReady( execStack[i] ))) {        
        break;
      }
    }
    if ( execStackReady ) {
      executeStack();
    }
  }
  
  function injectCss(oldObj) {
    
    // Create stylesheet link
    var link      = doc.createElement('link'),
        done;

    // Add attributes
    link.href = oldObj.src;
    link.rel  = 'stylesheet';
    link.type = 'text/css';


    // Poll for changes in webkit and gecko
    if ( isWebkit || isGecko ) {

      (function poll( link ) {
        var args = arguments;
        setTimeout(function(){
          if ( ! done ) {            
            try {
              if ( link.sheet && link.sheet.cssRules && link.sheet.cssRules.length ) {
                done = true;
                execWhenReady();              
              } else {
                poll(link);
              }
            } catch (ex) {

              if ( (ex.code == 1000) || (ex.message.match(/security|denied/i)) ) {
                done = true;
                setTimeout(function(){
                  execWhenReady();
                }, 0 );
              } else {
                poll(link);              
              }
            }
             
          }
        }, 13);
      })( link );

    }
    // Onload handler for IE and Opera
    else {

      link.onload = function() {
        if ( ! done ) {
          done = true;
          setTimeout(function(){
            execWhenReady();
          }, 0);
        }
      }

    }

    // 404 Fallback
    setTimeout(function(){
      if ( ! done ) {
        done = true;
        execWhenReady();
      }
    }, errorTimeout);

    // Inject CSS
    docHead.insertBefore(link, docFirst);

  }

  function executeStack(a) {
    var i   = execStack[strShift](),
        src = i ? i.src  : undef,
        t   = i ? i.type : undef;

    started = 1;

    if ( a && src ) {
      i = execStack[strShift]();
      src = undef;
    }

    if ( i ) {
      if ( src && t == jsType ) {
        preloadFile(strScript, src, "", null, docHead); 
      } 
      else if ( src && t == cssType ) {
        injectCss(i);
      }
      else {
        i();
        started = 0;
        execWhenReady();
      }
    } else {
      started = 0;
    }
  }


  function preloadFile( elem, url, type, splicePoint, docHead ) {
    // Create script element
    var preloadElem = doc.createElement( elem ),
        done        = 0;

    function onload() {

      // If the script/css file is loaded
      if ( ! done && isFileReady( preloadElem ) ) {
        // Set done to prevent this function from being called twice.
        done = 1;

        // If the type is set, that means that we're offloading execution
        if ( ! type || (type && ! started) ) {
          execWhenReady();
        }

        // Handle memory leak in IE
        preloadElem[strOnLoad] = preloadElem[strOnReadyStateChange] = null;
        type && docHead.removeChild(preloadElem);
      }
    }

    preloadElem.src = preloadElem.data = url;
    if ( type ) { 
      preloadElem.type = type;
    }

    // Attach handlers for all browsers
    preloadElem[strOnLoad] = preloadElem[strOnReadyStateChange] = onload;
    
    if ( elem == strImg ) {
      preloadElem.onerror = onload;
    } else if ( elem == strScript ) {
      preloadElem.onerror = function(){
        executeStack(1);      
      };
    }

    type && execStack.splice( splicePoint, 0, preloadElem);

    docHead.appendChild(preloadElem);

    if ( isOpera && ! type && elem == strScript ) {
      setTimeout(function(){
        if ( ! done ) {
          done = 1;
          execWhenReady();
        }
      }, errorTimeout);
    }

  }

  function load(resource, type) {

    var a     = arguments,
        app   = this,
        count = a.length,
        elem  = ( type == 'c' ? strCssElem : strJsElem ),
        i,q;
    
    // We'll do 'j' for js and 'c' for css, yay for unreadable minification tactics
    type = type || jsType;
    if ( isString( resource )) {
      preloadFile(elem, resource, type, app.i++, (elem == strObject ? docBody : docHead) );
    } else {
      execStack.splice(app.i++, 0, resource);
    }

    // OMG is this jQueries? For chaining...
    return app;

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

  /* End loader helper functions */




    // Yepnope Function
    yepnope = function(needs) {
    
    var i,
        need,
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
          forceCSS     = resource.forceCSS;
    
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
/*      else if (incLen > 4 && (forceCSS || (!forceJS && inc.substr(incLen-4) === '.css'))) {
        var styleElem      = doc.createElement('link');
      
        // add our src to it
        styleElem.href = inc;
        styleElem.rel  = 'stylesheet';
        styleElem.type = 'text/css';
      
        // inject the file
        docHead.insertBefore(styleElem, docFirst);
      
      
        // call the callback
        callback && callback(origInc, testResult, index);
        autoCallback && autoCallback(origInc, testResult, index);
      }*/
      // Otherwise assume that it's a script
      else {

        chain.load(inc, (incLen > 4 && (forceCSS || (!forceJS && inc.substr(incLen-4) === '.css'))) ? cssType : undef);

        // If we have a callback, we'll start the chain over
        if (isFunction(callback) || isFunction(autoCallback)) {
          // Call getJS with our current stack of things
          chain.load(function(){
            // Hijack yepnope and restart index counter
            // NOTE:: This can't get minified... perhaps we need to pass it as a param isntead?
            var innernope = getYepnope();
            // Call our callbacks with this set of data
            // TODO :: get CSS preloading working so we can use innernope there too
            callback && callback(origInc, testResult, index, innernope);
            autoCallback && autoCallback(origInc, testResult, index, innernope);
          });
        }
      }
    
      return chain;
    }
  
    function loadFromTestObject(testObject, chain) {
        var testResult = !!(testObject.test),
            group      = (testResult) ? testObject.yep : testObject.nope,
            always     = testObject.load || testObject.both,
            callback   = testObject.callback || undef,  // || (testObject.wait ? noop : undef),
            callbackKey;

        // Reusable function for dealing with the different input types
            // NOTE:: relies on closures to keep 'chain' up to date, a bit confusing, but
            // much smaller than the functional equivalent in this case.
        function handleGroup(needGroup) {
          // If it's a string
          if (isString(needGroup)) {
            // Just load the script of style
            chain = loadScriptOrStyle(needGroup, callback, chain, 0, testResult);
          }
          // If it's an array
          /*else if (isArray(needGroup)) {
            // Grab each thing out of it
            for (l = 0; l < needGroup.length; l++) {
              // Load each thing
              chain = loadScriptOrStyle(needGroup[l], callback, chain, l, testResult);
            }
          }*/
          // See if we have an object. Doesn't matter if it's an array or a key/val hash
          // Note:: order cannot be guaranteed on an key value object with multiple elements
          // since the for-in does not preserve order. Arrays _should_ go in order though.
          else if (isObject(needGroup)) {
            for (callbackKey in needGroup) {
              // Safari 2 does not have hasOwnProperty, but not worth the bytes for a shim
              // patch if needed. Kangax has a nice shim for it. Or just remove the check
              // and promise not to extend the object prototype.
              if (needGroup.hasOwnProperty(callbackKey)) {
                chain = loadScriptOrStyle(needGroup[callbackKey], callback, chain, callbackKey, testResult);
              }
            }
          }
        }

        // figure out what this group should do
        handleGroup(group);

        // Run our loader on the load/both group too
        handleGroup(always);

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
          chain = yepnope(need);
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
  
  // Attach loader &
  // Leak it
  window.yepnope = yepnope = getYepnope();
    
})(this, this.document);
