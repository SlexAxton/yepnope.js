( function ( window, doc, undef ) {
	var keyMap                = [],
		finished              = [],
		readies               = [],
	

	function execReady(ready){
        var urls, i, u, go;
        //allow multiple urls comma-delimited, execute when all specified are finished
        //or if reqs not specified, execute when special keyword 'null' is finished
        urls = ready.reqs ? ready.reqs.split(',') : ['null']
        go = true;
        for(i = 0; i < urls.length; i++){
            u = urls[i];
            //could be a callback key
            if(keyMap[u]) u = keyMap[u];
            if(!finished[u]){
                go = false;
                break;
            }
        }
        if(go){
            //execute callback
            ready.h(ready.reqs);
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
			//see if a new url has been placed under this key
			if(obj == keyMap[key]){
				//no additional loading for this key, otherwise a different object would be in the keymap
				finished[key] = true;
				
				//check if all finished
				for(k in keyMap)
					if(!finished[k]){
						i = false; break;
					}
				if(i){
					finished['null'] = true;
				}
				
				//execute all readies
				for(i = 0; i < readies.length; i++){
					if(readies[i].h){
						if(execReady(readies[i])){
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
	
	}
	
	yepnope.addFilter(rdyFilter);
	
	yepnope.ready = function(func, reqs){
      var ready = {
          h: func,
          reqs: reqs
      }
      if(!execReady(ready)){
          readies.push(ready);
      }
  }
	
})( this, this.document );