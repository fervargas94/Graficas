var handleWebGLCheck = function(){
	if(window.WebGLRenderingContext) {
		var canvas = document.createElement('canvas'), gl;
		try {
			gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		}
		catch(e) {}
		if(!gl) {
			handleNoWebGL(true);
		}
	}
	else {
		handleNoWebGL();
	}
};
var handleNoWebGL = function(limited) {
	var message = limited ? "WebGL support may be disabled in your browser settings" : "Your browser may not support WebGL";
	document.write('<style>BODY {background: gray;}</style><center><h1>' + message + '.</h1><img width="50%" src="gfx/sample.png" border="0" /><p>Please visit <a href="http://get.webgl.org/" target="_blank">get.webgl.org</a> to find best options for you.</p></center>');
};
if ("undefined" != typeof(window.attachEvent)) {
	window.attachEvent('onload', handleWebGLCheck);
}
else {
	window.addEventListener('load', handleWebGLCheck, false);
}