var controls = new function(){
	var _controls = this;
	
	this.FORWARD = false;
	this.BACKWARD = false;
	this.LEFT = false;
	this.RIGHT = false;
	this.TURN_LEFT = false;
	this.TURN_RIGHT = false;
	
	var processControls = function(keyCode, isKeyDown){
		switch (keyCode) {
			case 38: 
				_controls.FORWARD = isKeyDown ? true  :false;
			case 87: 
				_controls.FORWARD = isKeyDown ? true  :false;
				break;
			case 40: 
				_controls.BACKWARD = isKeyDown ? true  :false;
			case 83: 
				_controls.BACKWARD = isKeyDown ? true  :false;
				break;
			case 65: 
				_controls.LEFT = isKeyDown ? true  :false;
				break;
			case 68: 
				_controls.RIGHT = isKeyDown ? true  :false;
				break;
			case 37: 
				_controls.TURN_LEFT = isKeyDown ? true  :false;
				break;
			case 39: 
				_controls.TURN_RIGHT = isKeyDown ? true  :false;
				break;
		}
	};
	
	this.resetControls = function(){
		_controls.FORWARD = false;
		_controls.BACKWARD = false;
		_controls.LEFT = false;
		_controls.RIGHT = false;
		_controls.TURN_LEFT = false;
		_controls.TURN_RIGHT = false;
	};
	
	touchEvent.on(document, "keydown", function(e){
		processControls(e.keyCode, true);
	});
	
	touchEvent.on(document, "keyup", function(e){
		processControls(e.keyCode);
	});
	
}();