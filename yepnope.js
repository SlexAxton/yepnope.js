/**
 * Yepnope JS
 * 
 * Version 0.2.3 
 *
 * by Alex Sexton - AlexSexton@gmail.com 
 *
 * Tri-Licensed WTFPL, BSD, & MIT
 */
(function(window, doc, undef){
// Save old $LAB value
var $LAB,
    old$LAB  = window.$LAB,
    docHead  = doc.getElementsByTagName("head")[0] || doc.documentElement,
    docFirst = docHead.firstChild,
    toString = {}.toString,
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
      }
    },
    globalFilters = [],
    prefixes = {
      'css': function(resource) {
        resource.forceCSS = true;
        return resource;
      },
      'wait': function(resource) {
        // This just adds an empty callback to force a lab wait
        resource.autoCallback = function(){};
        return resource;
      }
    };

// LABJS 1.0.3
(function(q){function M(g,e){var h=/^\w+\:\/\//,j;if(typeof g!=r)g="";if(typeof e!=r)e="";j=(h.test(g)?"":e)+g;return(h.test(j)?"":j.charAt(0)==="/"?Y:Z)+j}function G(g,e){function h(a,b){if(a[w]&&a[w]!==$&&a[w]!=="loaded"||b[A])return k;a[aa]=a[H]=f;return i}function j(a,b,d){if((d=!!d)||h(a,b)){b[A]=i;for(var c in n)if(n[N](c)&&!n[c][A])return;ba=i;ca()}}function s(a){if(B.call(a[C])===O){a[C]();a[C]=f}}function ra(a,b){if(h(a,b)){b[o]=i;D(function(){t[b[E]].removeChild(a);s(b)},0)}}function sa(a,
b){if(a[w]===4){a[H]=P;b[o]=i;D(function(){s(b)},0)}}function Q(a,b,d,c,l,p){var x=a[E];D(function(){if("item"in t[x]){if(!t[x][0]){D(arguments.callee,25);return}t[x]=t[x][0]}var u=m.createElement(da);if(typeof d==r)u.type=d;if(typeof c==r)u.charset=c;if(B.call(l)===O){u[aa]=u[H]=function(){l(u,a)};u.src=b}t[x].insertBefore(u,x===z?t[x].firstChild:f);if(typeof p==r){u.text=p;j(u,a,i)}},0)}function ea(a,b,d,c){R[a[S]]=i;Q(a,b,d,c,j)}function fa(a,b,d,c){var l=arguments;if(v&&a[o]==f){a[o]=k;Q(a,b,
ga,c,ra)}else if(!v&&a[o]!=f&&!a[o])a[C]=function(){fa.apply(f,l)};else v||ea.apply(f,l)}function ha(a,b,d,c){var l=arguments,p;if(v&&a[o]==f){a[o]=k;p=a.xhr=ia?new ia("Microsoft.XMLHTTP"):new q.XMLHttpRequest;p[H]=function(){sa(p,a)};p.open("GET",b);p.send("")}else if(!v&&a[o]!=f&&!a[o])a[C]=function(){ha.apply(f,l)};else if(!v){R[a[S]]=i;Q(a,b,d,c,f,a.xhr.responseText);a.xhr=f}}function ja(a){if(a.allowDup==f)a.allowDup=e.dupe;var b=a.type,d=a.charset,c=a.allowDup;a=M(a.src,ta);var l=M(a).indexOf(Y)===
0;if(typeof d!=r)d=f;c=!!c;if(c=!c){if(!(c=R[a]!=f)){if(!(c=v&&n[a]))a:{for(var p=-1;c=ua[++p];)if(typeof c.src==r&&a===M(c.src)&&c.type!==ga){c=i;break a}c=k}c=c}c=c}if(c)n[a]!=f&&n[a][o]&&!n[a][A]&&l&&j(f,n[a],i);else{if(n[a]==f)n[a]={};c=n[a];if(c[E]==f)c[E]=va;c[A]=k;c[S]=a;T=i;if(!I&&ka&&l)ha(c,a,b,d);else!I&&la?fa(c,a,b,d):ea(c,a,b,d)}}function U(a){g&&!I&&J.push(a);if(!g||F)a()}function ma(a){var b=[],d;for(d=-1;++d<a.length;)if(B.call(a[d])===wa)b=b.concat(ma(a[d]));else b[b.length]=a[d];
return b}g=!!g;if(e==f)e=y;var ba=k,F=g&&e[K],la=F&&e.cache,I=F&&e.order,ka=F&&e.xhr,xa=e[V],va=e.which,ta=e.base,ca=P,T=k,L,v=i,n={},J=[],W=f;F=la||ka||I;L={script:function(){na(W);var a=ma(arguments),b=L,d;if(xa)for(d=-1;++d<a.length;){if(d===0)U(function(){ja(typeof a[0]==r?{src:a[0]}:a[0])});else b=b.script(a[d]);b=b.wait()}else U(function(){for(d=-1;++d<a.length;)ja(typeof a[d]==r?{src:a[d]}:a[d])});W=D(function(){v=k},5);return b},wait:function(a){na(W);v=k;B.call(a)===O||(a=P);var b=G(i,e),
d=b.trigger,c=function(){try{a()}catch(p){}d()};delete b.trigger;var l=function(){if(T&&!ba)ca=c;else c()};g&&!T?J.push(l):U(l);return b}};if(g)L.trigger=function(){for(var a,b=-1;a=J[++b];)a();J=[]};return L}function oa(g){var e,h={},j={UseCachePreload:"cache",UseLocalXHR:"xhr",UsePreloading:K,AlwaysPreserveOrder:V,AllowDuplicates:"dupe"},s={AppendTo:E,BasePath:"base"};for(e in j)s[e]=j[e];h.order=!!y.order;for(e in s)if(s[N](e)&&y[s[e]]!=f)h[s[e]]=g[e]!=f?g[e]:y[s[e]];for(e in j)if(j[N](e))h[j[e]]=
!!h[j[e]];if(!h[K])h.cache=h.order=h.xhr=k;h.which=h.which===z||h.which===X?h.which:z;return h}var r="string",z="head",X="body",da="script",w="readyState",o="preloaddone",C="loadtrigger",S="srcuri",K="preload",$="complete",A="done",E="which",V="preserve",H="onreadystatechange",aa="onload",N="hasOwnProperty",ga="script/cache",O="[object Function]",wa="[object Array]",f=null,i=true,k=false,m=q.document,ia=q.ActiveXObject,D=q.setTimeout,na=q.clearTimeout,B=Object.prototype.toString,P=function(){},t=
{},R={},Z=/^[^?#]*\//.exec(q.location.href)[0],Y=/^\w+\:\/\/\/?[^\/]+/.exec(Z)[0],ua=m.getElementsByTagName(da),pa=q.opera&&B.call(q.opera)=="[object Opera]",qa="MozAppearance"in m.documentElement.style,y={cache:!(qa||pa),order:qa||pa,xhr:i,dupe:i,base:"",which:z};y[V]=k;y[K]=i;t[z]=m.head||m.getElementsByTagName(z);t[X]=m.getElementsByTagName(X);q.$LAB={setGlobalDefaults:function(g){y=oa(g)},setOptions:function(g){return G(k,oa(g))},script:function(){return G().script.apply(f,arguments)},wait:function(){return G().wait.apply(f,
arguments)}};(function(g,e,h){if(m[w]==f&&m[g]){m[w]="loading";m[g](e,h=function(){m.removeEventListener(e,h,k);m[w]=$},k)}})("addEventListener","DOMContentLoaded")})(window);

// Remove LAB from the window
$LAB        = window.$LAB;
window.$LAB = old$LAB;

// Yepnope
var yepnope = function(needs, currentLabChain){
  var i,
      need,
      nlen = needs.length,
      // start the chain as a plain instance
      labChain = currentLabChain || $LAB;

  function satisfyPrefixes(url) {
    // make sure we have a url
    if (url) {
      // split all prefixes out
      var parts = url.split('!'),
          pLen  = parts.length,
          gLen  = globalFilters.length,
          res = {
            url: parts[pLen-1],
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
  
  function loadScriptOrStyle (input, callback, labChain, testResult) {
    // run through our set of prefixes
    var resource = satisfyPrefixes(input);

    // if no object is returned or the url is empty/false just exit the load
    if (!resource || !resource.url || resource.bypass) {
      return labChain;
    }
    
    var inc          = resource.url,
        incLen       = inc.length,
        instead      = resource.instead,
        autoCallback = resource.autoCallback,
        forceJS      = resource.forceJS,
        forceCSS     = resource.forceCSS; 
    
    // if someone is overriding all normal functionality
    if (instead) {
      return instead(input, callback, labChain, testResult);
    }
    // If it's specifically css with the prefix, just inject it (useful for weird extensions and cachebusted urls, etc)
    // Also do this if it ends in a .css extension
    else if (incLen > 4 && (forceCSS || (!forceJS && inc.substr(incLen-4) === '.css'))) {
      var styleElem = doc.createElement('link'),
          origInc   = inc;
      
      // add our src to it
      styleElem.href = inc;
      styleElem.rel  = 'stylesheet';
      styleElem.type = 'text/css';
      
      // inject the file
      docHead.insertBefore(styleElem, docFirst);
      
      // call the callback
      if (callback) {
        callback(origInc, testResult);
      }
      if (autoCallback) {
        autoCallback(origInc, testResult);
      }
    }
    // Otherwise assume that it's a script
    else {
      // Don't do a callback if it didn't have one
      labChain = labChain.script(inc);
      
      // Call the callback if we have one (via the labjs wait)
      if (callback || autoCallback) {
        labChain = labChain.wait(function(){
          // pass the callback the unique loaded script
          callback && callback(inc, testResult);
          // If the autoCallback exists, call it
          autoCallback && autoCallback(inc, testResult);
        });
      }
    }
    
    return labChain;
  }
  
  function loadFromTestObject(testObject, labChain) {
      var testResult = !!(testObject.test),
          needGroup = (testResult) ? testObject.yep : testObject.nope,
          // Callback or wait option should cause LabLS to block
          callback = testObject.callback || (testObject.wait ? function(){} : undef);
      
      // If it's a string
      if (test.isString(needGroup)) {
        // Just load the script of style
        labChain = loadScriptOrStyle(needGroup, callback, labChain, testResult);
      }
      // If it's an array
      else if (test.isArray(needGroup)) {
        // Grab each thing out of it
        for (var l = 0; l < needGroup.length; l++) {
          // Load each thing
          labChain = loadScriptOrStyle(needGroup[l], callback, labChain, testResult);
        }
      }
      
      // Alias 'both' as 'load' so it's more semantic sometimes
      if (testObject.both && !testObject.load) {
        testObject.load = testObject.both;
      }
      
      // get anything in the load object as well
      if (test.isString(testObject.load)) {
        // Just load the script of style
        labChain = loadScriptOrStyle(testObject.load, callback, labChain, testResult);
      }
      // If it's an array
      else if (test.isArray(testObject.load)) {
        // Grab each thing out of it
        for (var k = 0; k < testObject.load.length; k++) {
          // Load each thing
          labChain = loadScriptOrStyle(testObject.load[k], callback, labChain, testResult);
        }
      }
      
      return labChain;
  }
  
  // Someone just decides to load a single script or css file as a string
  if (test.isString(needs)) {
    labChain = loadScriptOrStyle(needs, false, labChain);
  }
  // Normal case is likely an array of different types of loading options
  else if (test.isArray(needs)) {
    // go through the list of needs
    for(i=0; i < nlen; i++) {
      need = needs[i];
      
      // if it's a string, just load it
      if (test.isString(need)) {
        labChain = loadScriptOrStyle(need, false, labChain);
      }
      // if it's an array, call our function recursively
      else if (test.isArray(need)) {
        labChain = yepnope(need, labChain);
      }
      // if it's an object, use our modernizr logic to win
      else if (test.isObject(need)) {
        labChain = loadFromTestObject(need, labChain);
      }
    }
  }
  // Allow a single object to be passed in
  else if (test.isObject(needs)) {
    labChain = loadFromTestObject(needs, labChain);
  }
  
  // allow more loading on this chain
  return labChain;
};

yepnope.addPrefix = function(prefix, callback) {
  prefixes[prefix] = callback;
};
yepnope.addFilter = function(filter) {
  globalFilters.push(filter);
};
yepnope.$LAB = $LAB;

// Leak me
window.yepnope = yepnope;
})(this, this.document);
