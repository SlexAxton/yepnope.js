/*
	A simple async test timer for QUnit
*/
(function(w){
	var current;
	
	function isNumber(n) {
	  return !isNaN(parseFloat(n)) && isFinite(n);
	}
	
	function _continue(obj){
		//ignore continues in the wrong context
		if(obj.done)
			return;
			
		obj.exp--;
		if (obj.exp <= 0 && obj.timer != null){
			clearTimeout(obj.timer);
			obj.done = true;
			current = null;
			//restart test runner since we're done
			start();
		}
	}
	
	function timedOut(obj){
		if(obj.done)
			return;
		
		obj.timer = null;
		if(obj.exp >= 0){
			ok(false, "test timed out");
			obj.done = true;
			current = null;
			start();
		}
	}
	
	function _abort(obj, message){
		//ignore aborts in the wrong context
		if(obj.done)
			return;
	
		if(!message) message = "async test aborted";
		if(obj.timer != null) clearTimeout(obj.timer);
		if(obj.exp >= 0){
			ok(false, message);
			obj.done = true;
			current = null;
			start();
		}
	}
	
	asyncTest.defaultTimeout = 2000;
	
	asyncTest.start = function(expect, timeout){
		
		if(current != null)
			current.abort("New async test started");
			
		//create the response currentect
		temp = {
			id: Math.random(),
			wait: timeout ? timeout : asyncTest.defaultTimeout,
			exp: expect ? expect : 1,
			continue: function(){ _continue(temp);},
			abort: function(msg){_abort(temp,msg);},
			done: false
		};
		current = temp;
		temp.timer = setTimeout(function() {timedOut(temp);}, temp.wait);
		
		return current;
	}

})(window);
