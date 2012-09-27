/**
 * Yepnope IE detection prefix
 * 
 * Use a combination of any of these, and they should work
 * Usage: ['ie6!ie6styles.css', 'ie7!ie7styles.css', 'ie6!ie7!ie6and7styles.css']
 * Usage: ['ielt7!ieLessThan7.css', 'ielt8!ieLessThan8.css', 'ielt9!ieLessThan9.css', 'oldie!ieLessThan10.css']
 * 
 * A logical OR will be applied to any combination of the supported prefixes.
 *
 * Official Yepnope Plugin
 *
 * WTFPL License
 *
 * by Alex Sexton | AlexSexton@gmail.com
 */
(function(yepnope){

  // hasOwnProperty shim by kangax needed for Safari 2.0 support
  var _hasOwnProperty = ({}).hasOwnProperty, hasOwnProperty;
  if (typeof _hasOwnProperty !== 'undefined' && typeof _hasOwnProperty.call !== 'undefined') {
    hasOwnProperty = function (object, property) {
      return _hasOwnProperty.call(object, property);
    };
  }
  else {
    hasOwnProperty = function (object, property) { /* yes, this can give false positives/negatives, but most of the time we don't care about those */
      return ((property in object) && typeof object.constructor.prototype[property] === 'undefined');
    };
  }


  // ----------------------------------------------------------
  // A short snippet for detecting versions of IE prior to IE10
  // in JavaScript without resorting to user-agent sniffing.
  // ----------------------------------------------------------
  // If you're not in IE (or if your IE version is less than 5
  // or greater than 9) then:
  //     oldie === undefined // IE < 5 || IE > 9 || !IE
  // If you're in IE (>=5 and <= 9) then you can determine
  // which version you are using:
  //     oldie === 5 // IE5
  //     oldie === 6 // IE6
  //     oldie === 7 // IE7
  //     oldie === 8 // IE8
  //     oldie === 9 // IE9
  // Thus, to detect IE5-9:
  //     if (oldie) {}
  // And to detect the version or an upper bound on it:
  //     oldie === 6 // IE6
  //     oldie < 10  // Anything less than IE10
  // ----------------------------------------------------------

  // UPDATE: Now using Live NodeList idea from @jdalton

  var oldie = (function(){

    var undef,
        v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');
    
    while (
      div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
      all[0]
    );
    
    return v > 4 ? v : undef;
    
  }()),

  iePrefixes = {
    other:  !oldie,
    oldie:  !!oldie,
    ie5:    (oldie === 5),
    ie6:    (oldie === 6),
    ie7:    (oldie === 7),
    ie8:    (oldie === 8),
    ie9:    (oldie === 9),
    ielt6:  (oldie < 6),
    ielt7:  (oldie < 7),
    ielt8:  (oldie < 8),
    ielt9:  (oldie < 9),
    ielt10: (oldie < 10)
  },
  checkAllIEPrefixes = function(resource) {
    var prefixes = resource.prefixes,
        pfx, k;
    
    // go through all other prefixes
    for (k = 0; k < prefixes.length; k++) {
      pfx = prefixes[k];
      // find other ie related prefixes that aren't this one
      if (hasOwnProperty(iePrefixes, pfx)) {
        // If any of the tests pass, we return true. Logical OR
        if (iePrefixes[pfx]) {
          return true;
        }
      }
    }
    return false;
  },
  i;
  
  // Add each test as a prefix
  for (i in iePrefixes) {
    if (hasOwnProperty(iePrefixes, i)) {
      // add each prefix
      yepnope.addPrefix(i, function(resource){
        // if they all all fail, set a bypass flag
        if (!checkAllIEPrefixes(resource)) {
          resource.bypass = true;
        }
        // otherwise, carry on
        return resource;
      });
    }
  }
})(this.yepnope);
