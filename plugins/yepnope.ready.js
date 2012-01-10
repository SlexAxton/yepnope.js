/*yepnope1.1.0|WTFPL*/
// yepnope.ready.js
// Version - 1.1.0
//
// by
// Gordon Burgett - @gburgett - Gordon.Burgett[at]gmail.com
//
// http://yepnopejs.com/
// https://github.com/SlexAxton/yepnope.js/
//
// Tri-license - WTFPL | MIT | BSD
//
// Please minify before use.
( function ( window, doc, undef ) {
	var keyMap                = [],
		finished              = [],
		readies               = [],
		isArray               = Array.isArray || function ( obj ) {
		  return toString.call( obj ) == "[object Array]";
		},
		// isObject              = function ( obj ) {
		  // return Object(obj) === obj;
		// },
		isString              = function ( s ) {
		  return typeof s == "string";
		};
		// isFunc            = function ( fn ) {
		  // return toString.call( fn ) === "[object Function]";
		// };
	
	/* executes a ready handler if its corresponding requirements are finished loading */
	function execReady(ready, key){
        var i, u, go;
		go = true;
        for(i = 0; i < ready.reqs.length; i++){
            u = ready.reqs[i];
            //could be a callback key
            if(keyMap[u]) u = keyMap[u].r.origUrl;
            if(!finished[u]){
                go = false;
                break;
            }
        }
        if(go){
            //execute callback
            ready.h(key);
        }
        return go;
    }
	
	/* the filter which serves as the entry point into yepnope for our plugin */
	function rdyFilter (res, index){
		//add the resource to our map and preserve old autoCallback behavior if exists
		var obj = {},
			key = (index === 0 ? res.origUrl : index),
			i = true, k;
			
		/* Checks if a resource is done loading and marks it as finished if so */
		function check(origUrl, result, index){
			var key = (index === 0 ? origUrl : index),
				go = true;
			
			//execute old autoCallback behavior if exists
			if(obj.old) obj.old(origUrl, result, index);
			//see if a new url has been placed under this key, and make sure it didnt finish in error
			if(obj == keyMap[key]){
				//no additional loading for this key, otherwise a different object would be in the keymap
				finished[origUrl] = true;
				
				//check if all finished
				for(k in keyMap)
					if(!finished[keyMap[k].r.origUrl]){
						i = false; break;
					}
				if(i){
					finished['null'] = true;
				}
				
				//execute all readies
				for(i = 0; i < readies.length; i++){
					if(readies[i].h){
						if(execReady(readies[i], key) == true){
							//fired it, so remove it to ensure one-off
							readies.splice(i, 1);
							i--;
						}
					}
				}
			}			
		}
			
		obj.r = res;
		if(res.autoCallback) obj.old = res.autoCallback;
		keyMap[key] = obj;
		
		res.autoCallback = check;
	
		return res;
	}
	
	//important for callback behavior
	yepnope.addFilter(rdyFilter);
	
	/**
		Attaches a callback to a set of requirements.  The callback will be executed once all the
		requirements have been loaded.
		Requirements can be an array of strings or a comma-separated single string listing the required
		resources.  If multiple resources are specified the callback will not be fired until all have been
		loaded.  If no resources are specified, the callback will be executed once every resource has been loaded.
		Resources can either be specified by their original URL (as given to yepnope) or by their
		associated key when passed to yepnope.  Specifying by key allows a yepnope callback to specify
		another resource to load under that key should the initial load fail.  The ready callback will
		not be executed until the key is fully loaded.
		
		ex. 1:
		yepnope('js/foo.js');
		yepnope.ready('js/foo.js', myCallback);	//will be called once 'js/foo.js' has been loaded and executed

		ex. 2:
		yepnope({
			load: {
				'jQuery': 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js'
			},
			callback: {
				'jQuery' : function(url, result, key){
					if(!jQuery)
						yepnope({
							load: { 'jQuery': 'js/jquery.min.js'}
						});
				}
			}
		});
		yepnope.ready('jQuery', myCallback);
		//will be called once the jQuery load has finished, from either source
	*/
	yepnope.ready = function(reqs, func){
	  var ready = {
		h: func,
		reqs: reqs
	  };
	  
	  if(isString(reqs)){
		ready.reqs = ready.reqs.split(",");
		ready.h = func;
	  }
	  else if(isArray(reqs)){
		ready.reqs = reqs;
		ready.h = func;
	  }
	  else{
		ready.h = reqs;
		ready.reqs = ['null'];
	  }
		
	  //else it's an array and ready to go
	  	  
      if(!execReady(ready)){
          readies.push(ready);
      }
	}
	
})( this, this.document );