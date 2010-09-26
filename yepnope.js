/**
 * Yepnope JS
 * 
 * Version 0.1.1
 *
 * by Alex Sexton - @SlexAxton
 *
 * Tri-Licensed WTFPL, BSD, & MIT
 *
 * Feature-test driven script loader on top of LABJS
 */
(function(window, doc){
// Save old $LAB value
var $LAB,
    old$LAB = window.$LAB,
    test = {
      isArray: Array.isArray || function( obj ) {
	return jQuery.type(obj) === "array";
      },
      isObject: function(obj) {
        // Lame object detection, but don't pass it stupid stuff?
        return typeof obj == "object";
      },
      isString: function(s) {
        return typeof s == "string";
      }
    };

// LABJS
(function(m){function M(f,d){var h=/^\w+\:\/\//,j;if(typeof f!==r)f="";if(typeof d!==r)d="";j=(h.test(f)?"":d)+f;return(h.test(j)?"":j.charAt(0)==="/"?Y:Z)+j}function H(f,d){function h(a,b){if(a[w]&&a[w]!==$&&a[w]!=="loaded"||b[B])return k;a[aa]=a[I]=g;return i}function j(a,b,e){if((e=!!e)||h(a,b)){b[B]=i;for(var c in n)if(n[N](c)&&!n[c][B])return;ba=i;ca()}}function s(a){if(C.call(a[D])===O){a[D]();a[D]=g}}function ra(a,b){if(h(a,b)){b[o]=i;E(function(){t[b[F]].removeChild(a);s(b)},0)}}function sa(a,
b){if(a[w]===4){a[I]=P;b[o]=i;E(function(){s(b)},0)}}function Q(a,b,e,c,l,p){var x=a[F];E(function(){if("item"in t[x]){if(!t[x][0]){E(arguments.callee,25);return}t[x]=t[x][0]}var u=q.createElement(da);u.type=e;if(typeof c===r)u.charset=c;if(C.call(l)===O){u[aa]=u[I]=function(){l(u,a)};u.src=b}t[x].insertBefore(u,x===z?t[x].firstChild:g);if(typeof p===r){u.text=p;j(u,a,i)}},0)}function ea(a,b,e,c){R[a[S]]=i;Q(a,b,e,c,j)}function fa(a,b,e,c){var l=arguments;if(v&&a[o]==g){a[o]=k;Q(a,b,ga,c,ra)}else if(!v&&
a[o]!=g&&!a[o])a[D]=function(){fa.apply(g,l)};else v||ea.apply(g,l)}function ha(a,b,e,c){var l=arguments,p;if(v&&a[o]==g){a[o]=k;p=a.xhr=ia?new ia("Microsoft.XMLHTTP"):new m.XMLHttpRequest;p[I]=function(){sa(p,a)};p.open("GET",b);p.send("")}else if(!v&&a[o]!=g&&!a[o])a[D]=function(){ha.apply(g,l)};else if(!v){R[a[S]]=i;Q(a,b,e,c,g,a.xhr.responseText);a.xhr=g}}function ja(a){if(a.allowDup==g)a.allowDup=d.dupe;var b=a.type,e=a.charset,c=a.allowDup;a=M(a.src,ta);var l=M(a).indexOf(Y)===0;if(typeof b!==
r)b="text/javascript";if(typeof e!==r)e=g;c=!!c;if(c=!c){if(!(c=R[a]!=g)){if(!(c=v&&n[a]))a:{for(var p=-1;c=ua[++p];)if(typeof c.src===r&&a===M(c.src)&&c.type!==ga){c=i;break a}c=k}c=c}c=c}if(c)n[a]!=g&&n[a][o]&&!n[a][B]&&l&&j(g,n[a],i);else{if(n[a]==g)n[a]={};c=n[a];if(c[F]==g)c[F]=va;c[B]=k;c[S]=a;T=i;if(!J&&ka&&l)ha(c,a,b,e);else!J&&la?fa(c,a,b,e):ea(c,a,b,e)}}function U(a){f&&!J&&K.push(a);if(!f||G)a()}function ma(a){var b=[],e;for(e=-1;++e<a.length;)if(C.call(a[e])===wa)b=b.concat(ma(a[e]));
else b[b.length]=a[e];return b}f=!!f;if(d==g)d=y;var ba=k,G=f&&d[L],la=G&&d.cache,J=G&&d.order,ka=G&&d.xhr,xa=d[V],va=d.which,ta=d.base,ca=P,T=k,A,v=i,n={},K=[],W=g;G=la||ka||J;A={script:function(){na(W);var a=ma(arguments),b=A,e;if(xa)for(e=-1;++e<a.length;){if(e===0)U(function(){ja(typeof a[0]===r?{src:a[0]}:a[0])});else b=b.script(a[e]);b=b.wait()}else U(function(){for(e=-1;++e<a.length;)ja(typeof a[e]===r?{src:a[e]}:a[e])});W=E(function(){v=k},5);return b},wait:function(a){na(W);v=k;C.call(a)===
O||(a=P);var b=H(i,d),e=b.trigger,c=function(){try{a()}catch(p){}e()};delete b.trigger;var l=function(){if(T&&!ba)ca=c;else c()};f&&!T?K.push(l):U(l);return b}};A.block=A.wait;if(f)A.trigger=function(){for(var a,b=-1;a=K[++b];)a();K=[]};return A}function oa(f){var d,h={},j={UseCachePreload:"cache",UseLocalXHR:"xhr",UsePreloading:L,AlwaysPreserveOrder:V,AllowDuplicates:"dupe"},s={AppendTo:F,BasePath:"base"};for(d in j)s[d]=j[d];h.order=!!y.order;for(d in s)if(s[N](d)&&y[s[d]]!=g)h[s[d]]=f[d]!=g?f[d]:
y[s[d]];for(d in j)if(j[N](d))h[j[d]]=!!h[j[d]];if(!h[L])h.cache=h.order=h.xhr=k;h.which=h.which===z||h.which===X?h.which:z;return h}var r="string",z="head",X="body",da="script",w="readyState",o="preloaddone",D="loadtrigger",S="srcuri",L="preload",$="complete",B="done",F="which",V="preserve",I="onreadystatechange",aa="onload",N="hasOwnProperty",ga="script/cache",O="[object Function]",wa="[object Array]",g=null,i=true,k=false,q=m.document,ia=m.ActiveXObject,E=m.setTimeout,na=m.clearTimeout,C=Object.prototype.toString,
P=function(){},t={},R={},Z=/^[^?#]*\//.exec(m.location.href)[0],Y=/^\w+\:\/\/\/?[^\/]+/.exec(Z)[0],ua=q.getElementsByTagName(da),pa=m.opera&&C.call(m.opera)=="[object Opera]",qa=function(f){f[f]=f+"";return f[f]!=f+""}(new String("__count__")),y={cache:!(qa||pa),order:qa||pa,xhr:i,dupe:i,base:"",which:z};y[V]=k;y[L]=i;t[z]=q.getElementsByTagName(z);t[X]=q.getElementsByTagName(X);m.$LAB={setGlobalDefaults:function(f){y=oa(f)},setOptions:function(f){return H(k,oa(f))},script:function(){return H().script.apply(g,
arguments)},wait:function(){return H().wait.apply(g,arguments)}};m.$LAB.block=m.$LAB.wait;(function(f,d,h){if(q[w]==g&&q[f]){q[w]="loading";q[f](d,h=function(){q.removeEventListener(d,h,k);q[w]=$},k)}})("addEventListener","DOMContentLoaded")})(window);

// Remove LAB from the window
$LAB        = window.$LAB;
window.$LAB = old$LAB;

// Yepnope
window.yepnope = function(needs, currentLabChain){
  var i,
      need,
      nlen = needs.length,
      // start the chain as a plain instance
      labChain = currentLabChain || $LAB;
  
  function loadScriptOrStyle (inc, callback, labChain, testResult) {
    var incLen    = inc.length,
        forceCss  = (inc.substr(0,4) === 'css!');
    
    // If it's specifically css with the prefix, just inject it (useful for weird extensions and cachebusted urls, etc)
    // Also do this if it ends in a .css extension
    if (incLen > 4 && (forceCss || inc.substr(incLen-4) === '.css')) {
      var docHead   = doc.getElementsByTagName("head")[0] || doc.documentElement,
          styleElem = doc.createElement('link'),
          origInc   = inc;
      
      if (forceCss) {
        // remove the prefix if we found it
        inc = inc.substr(4);
      }
      
      // add our src to it
      styleElem.href = inc;
      styleElem.rel  = 'stylesheet';
      styleElem.type = 'text/css';
      
      // inject the file
      docHead.insertBefore(styleElem, docHead.firstChild);
      
      // call the callback
      if (callback) {
        callback(origInc, testResult);
      }
    }
    // Otherwise assume that it's a script
    else {
      // Don't do a callback if it didn't have one
      labChain = labChain.script(inc);
      
      // Call the callback if we have one (via the labjs wait)
      if (callback) {
        labChain = labChain.wait(function(){
          // pass the callback the unique loaded script
          callback(inc, testResult);
        });
      }
    }
    
    return labChain;
  }
  
  function loadFromTestObject(testObject, labChain) {
      var testResult = !!(testObject.test),
          needGroup = (testResult) ? testObject.yep : testObject.nope;
      
      // If it's a string
      if (test.isString(needGroup)) {
        // Just load the script of style
        labChain = loadScriptOrStyle(needGroup, testObject.callback, labChain, testResult);
      }
      // If it's an array
      else if (test.isArray(needGroup)) {
        // Grab each thing out of it
        for (var i = 0; i < needGroup.length; i++) {
          // Load each thing
          labChain = loadScriptOrStyle(needGroup[i], testObject.callback, labChain, testResult);
        }
      }
      
      // Alias 'both' as 'load' so it's more semantic sometimes
      if (testObject.both && !testObject.load) {
        testObject.load = testObject.both;
      }
      
      // get anything in the load object as well
      if (test.isString(testObject.load)) {
        // Just load the script of style
        labChain = loadScriptOrStyle(testObject.load, testObject.callback, labChain, testResult);
      }
      // If it's an array
      else if (test.isArray(testObject.load)) {
        // Grab each thing out of it
        for (var i = 0; i < testObject.load.length; i++) {
          // Load each thing
          labChain = loadScriptOrStyle(testObject.load[i], testObject.callback, labChain, testResult);
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
        labChain = window.yepnope(need, labChain);
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

})(this, this.document);