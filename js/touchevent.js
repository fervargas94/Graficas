var touchEvent = new function(){
	var eventAlias = {
		touchstart: "mousedown",
		touchend: "mouseup",
		touchmove: "mousemove"
	};
	var profile = /MSIE/.test(navigator.userAgent) ? "ie" : /mobile/i.test(navigator.userAgent) || /Android/i.test(navigator.userAgent) ? "mobile" : "def";

	var onUn = function(element, eventName, eventHandlerFn, isUn){
		if ("string" == typeof(element)) {
			element = document.getElementById(element);
		}
		if (!isUn) {
			if (!element.touchEvents) {
				element.touchEvents = [];
			}
			var eventRecord = {
				name: eventName,
				handler: eventHandlerFn
			};
			element.touchEvents.push(eventRecord);
			if ("undefined" != typeof(element.attachEvent)) {
				return element.attachEvent(eventName, eventHandlerFn);
			}
			else {
				return element.addEventListener(eventName, eventHandlerFn, false);
			}
		}
		else {
			if (element.touchEvents && element.touchEvents.length) {
				for (var i = 0; i < element.touchEvents.length; i++) {
					if (element.touchEvents[i] && element.touchEvents[i].name == eventName && element.touchEvents[i].handler == eventHandlerFn) {
						element.touchEvents[i] = undefined;
					}
				}
			}
			if ("undefined" != typeof(element.detachEvent)) {
				return element.detachEvent(eventName, eventHandlerFn);
			}
			else {
				return element.removeEventListener(eventName, eventHandlerFn, false);
			}
		}
	}
	/**
	 * attach event handler
	 * @param 	{Object}	 element
	 * @param 	{String}	 eventName
	 * @param 	{Object}	 eventHandlerFn
	 */
	this.on = function(element, eventName, eventHandlerFn){
		console.log("this.on");
		if (element && "string" != typeof(element) && element.length) {
			for (var i = 0; i < element.length; i++) {
				if (eventName && "string" != typeof(eventName) && eventName.length) {
					for (var j = 0; j < eventName.length; j++) {
						onUn(element[i], eventName[j], eventHandlerFn);
					}
				}
				else {
					onUn(element[i], eventName, eventHandlerFn);
				}
			}
		}
		else {
			if (eventName && "string" != typeof(eventName) && eventName.length) {
				for (var j = 0; j < eventName.length; j++) {
					onUn(element, eventName[j], eventHandlerFn);
				}
			}
			else {
				onUn(element, eventName, eventHandlerFn);
			}
		}
	};
	/**
	 * remove event handler
	 * @param 	{Object}	 element
	 * @param 	{String}	 eventName
	 * @param 	{Object}	 eventHandlerFn
	 */
	this.un = function(element, eventName, eventHandlerFn){
		console.log("this.un");
		if (element && "string" != typeof(element) && element.length) {
			for (var i = 0; i < element.length; i++) {
				if (eventName && "string" != typeof(eventName) && eventName.length) {
					for (var j = 0; j < eventName.length; j++) {
						onUn(element[i], eventName[j], eventHandlerFn, true);
					}
				}
				else {
					onUn(element[i], eventName, eventHandlerFn, true);
				}
			}
		}
		else {
			if (eventName && "string" != typeof(eventName) && eventName.length) {
				for (var j = 0; j < eventName.length; j++) {
					onUn(element, eventName[j], eventHandlerFn, true);
				}
			}
			else {
				onUn(element, eventName, eventHandlerFn, true);
			}
		}
	};
}();
