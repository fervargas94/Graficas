// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();
var container = document.getElementById("container");

var t = THREE;

var stats;

// set the scene size
var WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight;

var loading = document.createElement("div");
loading.className = "loading-container";
loading.style.lineHeight = HEIGHT + 'px';
var loadingImg = document.createElement("img");
loadingImg.className = "loading-image";
loadingImg.src = "loading.gif";
loading.appendChild(loadingImg);
container.appendChild(loading);

var hideLoading = function(){
	loading.style.display = 'none';
};
  
// set some camera attributes
var VIEW_ANGLE = 45,
  ASPECT = WIDTH / HEIGHT,
  NEAR = 0.1,
  FAR = 10000;

// create a WebGL renderer, camera
// and a scene
var renderer = window.WebGLRenderingContext ? new t.WebGLRenderer() : new t.CanvasRenderer();
var camera = new t.PerspectiveCamera(VIEW_ANGLE,ASPECT,NEAR,FAR);

var scene = new t.Scene();

// add the camera to the scene
scene.add(camera);

// the camera starts at 0,0,0
// so pull it back
camera.position.z = 300;

// start the renderer
renderer.setSize(WIDTH, HEIGHT);

// attach the render-supplied DOM element
container.appendChild(renderer.domElement);

var walls = [];
var toLoad = 0;
var loaded = 0;
var onLoad = function(){
	loaded++;
	var percent = loaded / toLoad;
	if(percent == 1) {
		hideLoading();
	}
};

var createBox = function(x, y, z, w, h, d, r, url, rx, ry, matConf){
	var geo = new t.CubeGeometry(w, h, d);
	var mat = [];
	for(var i = 0; i < 6; i++) {
		toLoad ++;
		var texture = t.ImageUtils.loadTexture(url, null, onLoad, onLoad);
		rx = rx || 1;
		ry = ry || 1;
		texture.wrapS = texture.wrapT = t.RepeatWrapping;
		texture.repeat.set( rx, ry );
		matConf = matConf || {};
		matConf.map = matConf.map ? matConf.map : texture;
		mat.push(new t.MeshPhongMaterial(matConf));
	}
	/*var wallMaterial = new THREE.MeshPhongMaterial({
        matConf.map : loader.load(url)
    });

    repeatTexture(wallMaterial.map, 2);*/

	var face = new t.MeshFaceMaterial(mat);
	var mesh = new THREE.Mesh(geo, face);
	mesh.position.x = x;
	mesh.position.y = y;
	mesh.position.z = z;
	mesh.rotation.y = r;
	return mesh;
};

var createWall = function(x, z, r, w, h){
	var wall = createBox(x, 0, z, w, h, 10, r, "images/pastel.jpg", 2, 1, {
	   color: 0xAAAAAA,
	   specular:0x111111,
	   shininess: 10,
	   combine: THREE.MixOperation,
	   reflectivity: 0.005
	});
	scene.add(wall);
	walls.push(wall);
};

var createLamp = function(x, z){
	var lamp = createBox(x, 189, z, 100, 1, 100, 0, "lamp.png");
	scene.add(lamp);
	var light = new t.PointLight(0XFDFFDD, 0.6, 3000);
	light.position.x = x;
	light.position.y = 130;
	light.position.z = z;
	
	light.castShadow = true;

	light.shadowMapWidth = 1024;
	light.shadowMapHeight = 1024;

	light.shadowCameraNear = 500;
	light.shadowCameraFar = 4000;
	light.shadowCameraFov = 30;
	scene.add(light);
	lamp.light = light;
	return lamp;
};


var loader = new THREE.OBJMTLLoader();
loader.load( 'horse.obj', 'horse.mtl', function ( object ) {

	object.position.y = -71;
	object.position.z = -550;
	object.position.x = -800;
	object.scale.set(3, 3, 3);
	object.rotation.y = Math.PI / 2;
	scene.add( object );
} );

var loader = new THREE.OBJMTLLoader();
loader.load( 'male.obj', 'male.mtl', function ( object ) {

	object.position.y = -195;
	object.position.z = 950;
	object.position.x = -800;
	object.scale.set(1.4, 1.4, 1.4);
	object.rotation.y = Math.PI;
	scene.add( object );
} );


createWall(0, -1000, 0, 2000, 400);
createWall(0, 1000, 0, 2000, 400);
createWall(1000, 0, Math.PI / 2, 2000, 400);
createWall(-1000, 0, Math.PI / 2, 2000, 400);

var floor = createBox(0, -200, 0, 2000, 10, 2000, 0, "images/floor.png", 5, 5, {
   color: 0xffffff,
   specular:0xffffff,
   shininess: 10,
   combine: THREE.MixOperation,
   reflectivity: 0.5
});
scene.add(floor);

var ceiling = createBox(0, 200, 0, 2000, 10, 2000, 0, "images/pastel.jpg", 5, 5);
scene.add(ceiling);

//Imagenes principales
var remb = createBox(-500, 0, -989, 320, 240, 1, 0, "remb.png");
scene.add(remb);

var im2 = createBox(500, 0, -989, 320, 240, 1, 0, "images/birth.jpg");
scene.add(im2);

var mona = createBox(0, 0, -989, 220, 240, 1, 0, "images/mona.png");
scene.add(mona);
									//w   /h
//Imagenes del lado de la pared
var remb = createBox(-500, 0, 989, 320, 240, 1, 0, "images/last.png");
scene.add(remb);

var im2 = createBox(500, 0, 989, 320, 240, 1, 0, "images/night.png");
scene.add(im2);

var chica = createBox(0, 0, 989, 200, 240, 1, 0, "images/chica.jpg");
scene.add(chica);



var door = createBox(-840, -38, 989, 160, 320, 5, 0, "door.png");
scene.add(door);

createLamp(-500, -500);
createLamp(500, -500);
createLamp(0, 0);

var moveStep = 10;
var wallDistance = 400;
var getDeltaStep = function(step, rotation){
	var delta = {x: 0, z: 0}; // x is horisontal, z is depth
	delta.x = step * Math.sin(rotation);
	delta.z = step * Math.cos(rotation);
	return delta;
};

var theTime = new Date().getTime();
(function animloop(){
	  requestAnimFrame(animloop);
		var time = new Date().getTime();
		var deltaTime = (time - theTime) / (1000 / 60);
	    theTime = time;
	  
		var prevCamPos = {
			x: camera.position.x,
			z: camera.position.z
		};
		
	  if(controls.FORWARD) {
		var delta = getDeltaStep(moveStep, camera.rotation.y);
		camera.position.x -= delta.x * deltaTime;
		camera.position.z -= delta.z * deltaTime;
	  }
	  if(controls.BACKWARD) {
		var delta = getDeltaStep(moveStep, camera.rotation.y);
		camera.position.x += delta.x * deltaTime;
		camera.position.z += delta.z * deltaTime;
	  }
	  if(controls.LEFT) {
		var delta = getDeltaStep(moveStep, camera.rotation.y - Math.PI / 2);
		camera.position.x += delta.x * deltaTime;
		camera.position.z += delta.z * deltaTime;
	  }
	  if(controls.RIGHT) {
		var delta = getDeltaStep(moveStep, camera.rotation.y + Math.PI / 2);
		camera.position.x += delta.x * deltaTime;
		camera.position.z += delta.z * deltaTime;
	  }
	  if(controls.TURN_LEFT) {
		camera.rotation.y += 0.042 * deltaTime;
	  }
	  if(controls.TURN_RIGHT) {
		camera.rotation.y -= 0.042 * deltaTime;
	  }

	  //console.log(camera.position)

	  if(camera.position.x > 1000 - wallDistance || camera.position.x < -1000 + wallDistance) {
		camera.position.x = prevCamPos.x;
		if(camera.position.x >= -550 && camera.position.x <= -330){ //&& camera.position.z >= -598 && camera.position.z <= -560){
			if(camera.position.z <= -590){
				console.log("Original")
			}else if(camera.position.z >= 590){
	  			console.log("Cena")
	  		}
	  		
	  	}
	  	if(camera.position.x >= 380 && camera.position.x <= 580){ // && camera.position.z >= -598 && camera.position.z <= -560){
	  		if(camera.position.z <= -590){
	  			console.log("Birth")
	  		}else if(camera.position.z >= 590){
	  			console.log("Cielo")
	  		}
	  	}
	  	if(camera.position.x >= -125 && camera.position.x <= 120){ // && camera.position.z >= -598 && camera.position.z <= -560){
	  		if(camera.position.z <= -590){
	  			console.log("Mona")
	  		}else if(camera.position.z >= 590){
	  			console.log("Tipa")
	  		}
	  	}

	  }
	  if(camera.position.z > 1000 - wallDistance || camera.position.z < -1000 + wallDistance) {
		camera.position.z = prevCamPos.z;
		//function(x, y, z, w, h, d, r, url, rx, ry, matConf) -500 320
	  	if(camera.position.x >= -550 && camera.position.x <= -330){ // && camera.position.z >= -598 && camera.position.z <= -560){
	  		if(camera.position.z <= -590){
	  			console.log("Original")
	  		}else if(camera.position.z >= 590){
	  			console.log("Cena")
	  		}
	  	}
	  	if(camera.position.x >= 380 && camera.position.x <= 580){ // && camera.position.z >= -598 && camera.position.z <= -560){
	  		if(camera.position.z <= -590){
	  			console.log("Birth")
	  		}else if(camera.position.z >= 590){
	  			console.log("Cielo")
	  		}
	  	}
	  	if(camera.position.x >= -125 && camera.position.x <= 120){ // && camera.position.z >= -598 && camera.position.z <= -560){
	  		if(camera.position.z <= -590){
	  			console.log("Mona")
	  		}else if(camera.position.z >= 590){
	  			console.log("Tipa")
	  		}
	  	}

	  }

	  
	  
	  renderer.render(scene, camera);
		if(stats) {
			stats.update();
		}
})();


container.requestPointerLock = container.requestPointerLock ||
			     container.mozRequestPointerLock ||
			     container.webkitRequestPointerLock;
// Ask the browser to lock the pointer
container.onclick = function(){
	exited = false;
	if(!locked) {
		locked = false;
		container.requestPointerLock();
	}
	else {
		locked = true;
		document.exitPointerLock();
	}
}

// Ask the browser to release the pointer
document.exitPointerLock = document.exitPointerLock ||
			   document.mozExitPointerLock ||
			   document.webkitExitPointerLock;
//document.exitPointerLock();
var locked = false;
var changeCallback = function(e){
	locked = !locked;
};

// Hook pointer lock state change events
document.addEventListener('pointerlockchange', changeCallback, false);
document.addEventListener('mozpointerlockchange', changeCallback, false);
document.addEventListener('webkitpointerlockchange', changeCallback, false);

// Hook mouse move events
document.addEventListener("mousemove", function(e){
	if(locked){
		var movementX = e.movementX ||
			  e.mozMovementX          ||
			  e.webkitMovementX       ||
			  0,
		  movementY = e.movementY ||
			  e.mozMovementY      ||
			  e.webkitMovementY   ||
			  0;
			
			camera.rotation.y -= movementX / 1000; // horisontal
			//console.log(camera.rotation.y);
	}
}, false);
