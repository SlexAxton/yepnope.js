( function ( window, doc, undef ) {
	var keyMap                = [],
		finished              = [],
		readies               = [],
		isArray               = Array.isArray || function ( obj ) {
		  return toString.call( obj ) == "[object Array]";
		},
		isObject              = function ( obj ) {
		  return Object(obj) === obj;
		},
		isString              = function ( s ) {
		  return typeof s == "string";
		};
		// isFunc            = function ( fn ) {
		  // return toString.call( fn ) == "[object Function]";
		// };
	

	function execReady(ready, key){
        var urls, i, u, go;
        //allow multiple urls comma-delimited, execute when all specified are finished
        //or if reqs not specified, execute when special keyword 'null' is finished
        urls = ready.reqs ? ready.reqs : ['null']
        go = true;
        for(i = 0; i < urls.length; i++){
            u = urls[i];
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
	
	yepnope.addFilter(rdyFilter);
	
	yepnope.ready = function(func, reqs){
	  var ready = {
		h: func,
		reqs: reqs
	  };
	  
	  if(isString(ready.reqs)){
		ready.reqs = ready.reqs.split(",");
	  }
	  //else it's an array and ready to go
	  
      if(!execReady(ready)){
          readies.push(ready);
      }
  }
	
})( this, this.document );