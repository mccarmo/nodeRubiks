/**
 * This port was made thanks to the great tutorials found at http://learningwebgl.com/
 */
var gl;
var theShaderFs = " precision mediump float; " +
		          " varying vec2 vTextureCoord; " +
                  " uniform sampler2D uSampler; " +
                  " void main(void) { " +
                  "   gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)); " +
                  " } ";
var theShaderVs = " attribute vec3 aVertexPosition; " +
				  " attribute vec2 aTextureCoord; " +
				  " uniform mat4 uMVMatrix; " +
				  " uniform mat4 uPMatrix; " +
				  " varying vec2 vTextureCoord; " +
				  " void main(void) { " +
				  "    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); " +
				  "    vTextureCoord = aTextureCoord; " +
				  " }";
var lastTime = 0;
var cubeArray = new Array(26);//store the references for the 26 cubes
var shaderProgram;
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var mvMatrixStack = [];
var xRot = 0;
var xSpeed = 0;
var yRot = 0;
var ySpeed = 0;
var rotationMatrix = mat4.create();
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;
var numTextures = 6;
var loadedTextures = 0;
var movesArray = [];
var currentlyPressedKeys = {};
var gameStarted = false;

mat4.identity(rotationMatrix);

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;

        for(i=0;i<cubeArray.length;i++) {
            cubeArray[i] = new Cube();
        }
        
    } catch (e) {
    }
    if (!gl) {
        alert("Oh man!...Could not initialise WebGL. This is so sad! :(");
    }
}

function getShader(gl, shaderSource, type) {
    var shader;
    if (type == "fs") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == "vs") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }
    
    gl.shaderSource(shader,shaderSource);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initShaders() {
    var fragmentShader = getShader(gl, theShaderFs, "fs");
    var vertexShader = getShader(gl, theShaderVs, "vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	
    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
    
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
}

function mvPushMatrix() {
    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

/**
 * Initializing the Cubes by passing a reference to the "gl", a cube "id" and the x,y,z of the cube
 * @author mccarmo
 */
function initCubes() {    		
   //Front      
   cubeArray[0].init(gl,1,-2.0,2.0,2.0);			 		
   cubeArray[1] .init(gl,2,0.0,2.0,2.0);			 		
   cubeArray[2].init(gl,3,2.0,2.0,2.0);
   cubeArray[3].init(gl,4,-2.0,0.0,2.0);
   cubeArray[4].init(gl,5,0.0,0.0,2.0);
   cubeArray[5].init(gl,6,2.0,0.0,2.0);
   cubeArray[6].init(gl,7,-2.0,-2.0,2.0);
   cubeArray[7].init(gl,8,0.0,-2.0,2.0);
   cubeArray[8].init(gl,9,2.0,-2.0,2.0);   			     		
   //Middle
   cubeArray[9].init(gl,10,-2.0,2.0,0.0);       				 
   cubeArray[10].init(gl,11,0.0,2.0,0.0);          
   cubeArray[11].init(gl,12,2.0,2.0,0.0);		
   cubeArray[12].init(gl,13,-2.0,0.0,0.0);       				 	
   cubeArray[13].init(gl,14,2.0,0.0,0.0);
   cubeArray[14].init(gl,15,-2.0,-2.0,0.0);	
   cubeArray[15].init(gl,16,0.0,-2.0,0.0);        				
   cubeArray[16].init(gl,17,2.0,-2.0,0.0);
   //Back      
   cubeArray[17].init(gl,18,-2.0,2.0,-2.0);
   cubeArray[18].init(gl,19,0.0,2.0,-2.0);
   cubeArray[19].init(gl,20,2.0,2.0,-2.0);
   cubeArray[20].init(gl,21,-2.0,0.0,-2.0);
   cubeArray[21].init(gl,22,0.0,0.0,-2.0);
   cubeArray[22].init(gl,23,2.0,0.0,-2.0);
   cubeArray[23].init(gl,24,-2.0,-2.0,-2.0);
   cubeArray[24].init(gl,25,0.0,-2.0,-2.0);
   cubeArray[25].init(gl,26,2.0,-2.0,-2.0);    		      
}

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [0.0, 0.0, -14.0]);     

    mat4.rotate(mvMatrix, degToRad(xRot), [1, 0, 0]);
    mat4.rotate(mvMatrix, degToRad(yRot), [0, 1, 0]);
    mat4.multiply(mvMatrix, rotationMatrix);
    
}

function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;
        xRot += (xSpeed * elapsed) / 1000.0;
        yRot += (ySpeed * elapsed) / 1000.0;
        
        //If game not started put some animation on the Cube...just for fun
        if(!gameStarted) {
        	xRot+=0.5;
            yRot+=0.5;
        }  
        
        cubeArray.map(function(c){
        	c.generateCubo();
        });
        
        //Here the scheduled moves are called...
        var move = movesArray.shift();
        if(typeof(move)=='function'){
        	move();
        };
        
        checkIfGameEnded();
        
    }
    lastTime = timeNow;
}

function handleKeys() {        
if (currentlyPressedKeys[37]) {
      // Left cursor key
      yRot -= 5;
    }
    if (currentlyPressedKeys[39]) {
      // Right cursor key
      yRot += 5;
    }
    if (currentlyPressedKeys[38]) {
      // Up cursor key
      xRot -= 5;
    }
    if (currentlyPressedKeys[40]) {
      // Down cursor key
      xRot += 5;
    }
}

/**
 * Schedule Movements 10 degrees each for animation smoothness 
 */
function scheduleMoveAnimationEvents(event) {
	for(i=1;i<10;i++) {
		movesArray.push(event);
	}
}

/**
 * Handle the Key Down event, in case of the player wants to control the cube with the keyboard
 * @author mccarmo
 */
function handleKeyDown(event) {
  
  if(!gameStarted) return;	
  
  currentlyPressedKeys[event.keyCode] = true;
  
  var currKey =  String.fromCharCode(event.keyCode);	
  
  if (currKey  == "C") {
    xRot = 0;
    yRot = 0;
    xSpeed = 0;
    ySpeed = 0;
  }
  
  switch(currKey) {
     case "Q": scheduleMoveAnimationEvents(new eventOnZaxis(16.0,10.0)); break;
     case "W": scheduleMoveAnimationEvents(new eventOnZaxis(0.0,10.0)); break;
     case "E": scheduleMoveAnimationEvents(new eventOnZaxis(-16.0,10.0)); break;
     case "A": scheduleMoveAnimationEvents(new eventOnZaxis(16.0,-10.0)); break;
     case "S": scheduleMoveAnimationEvents(new eventOnZaxis(0.0,-10.0)); break;
     case "D": scheduleMoveAnimationEvents(new eventOnZaxis(-16.0,-10.0));break;  
     case "R": scheduleMoveAnimationEvents(new eventOnXaxis(16.0,10.0)); break;
     case "T": scheduleMoveAnimationEvents(new eventOnXaxis(0.0,10.0));	break;  
     case "Y": scheduleMoveAnimationEvents(new eventOnXaxis(-16.0,10.0)); break;	 
     case "F": scheduleMoveAnimationEvents(new eventOnXaxis(16.0,-10.0)); break;	  
     case "G": scheduleMoveAnimationEvents(new eventOnXaxis(0.0,-10.0)); break;	 
     case "H": scheduleMoveAnimationEvents(new eventOnXaxis(-16.0,-10.0)); break;	  
     case "U": scheduleMoveAnimationEvents(new eventOnYaxis(16.0,10.0)); break;	 
     case "I": scheduleMoveAnimationEvents(new eventOnYaxis(0.0,10.0)); break;  
     case "O": scheduleMoveAnimationEvents(new eventOnYaxis(-16.0,10.0)); break;	 
     case "J": scheduleMoveAnimationEvents(new eventOnYaxis(16.0,-10.0)); break;	 
     case "K": scheduleMoveAnimationEvents(new eventOnYaxis(0.0,-10.0)); break;	  
     case "L": scheduleMoveAnimationEvents(new eventOnYaxis(-16.0,-10.0)); break;
  }
 
}

function handleKeyUp(event) {
  currentlyPressedKeys[event.keyCode] = false;
}

function handleMouseDown(event) {
    mouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
}


function handleMouseUp(event) {
    mouseDown = false;
}

/**
 * Controls the rotation of the Cube with the mouse.
 * @author mccarmo
 * @param event
 */
function handleMouseMove(event) {
    if (!mouseDown) {
        return;
    }
    var newX = event.clientX;
    var newY = event.clientY;
    
    handleCubeRotationByMove(newX,newY);
}

/**
 * Controls the rotation of the Cube with the touch.
 * @author mccarmo
 * @param event
 */
function handleTouchMove(event) {
	event.preventDefault();
	
	var newX = event.targetTouches[0].clientX;
    var newY = event.targetTouches[0].clientY;

    handleCubeRotationByMove(newX,newY);
}

/**
 * Handle the Rotation of Cube based on the mouse or touch moves.
 * @author mccarmo
 * @param newX
 * @param newY
 */
function handleCubeRotationByMove(newX,newY) {
	xRot = 0;
    yRot = 0;
	xSpeed = 0;
    ySpeed = 0;
    
    var deltaX = newX - lastMouseX
    
    var newRotationMatrix = mat4.create();
    
    mat4.identity(newRotationMatrix);
    mat4.rotate(newRotationMatrix, degToRad(deltaX / 7), [0, 1, 0]);

    var deltaY = newY - lastMouseY;
    mat4.rotate(newRotationMatrix, degToRad(deltaY / 7), [1, 0, 0]);

    mat4.multiply(newRotationMatrix, rotationMatrix, rotationMatrix);

    lastMouseX = newX
    lastMouseY = newY;
}

/**
 * Handle the loaded texture
 * @author mccarmo
 * @param texture
 */
function handleLoadedTexture(texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	gl.generateMipmap(gl.TEXTURE_2D);   
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); //My textures are power-of-2
    gl.bindTexture(gl.TEXTURE_2D, null);
	//Workaround...yes...it is...and yes i comment that here, sorry.
	if(loadedTextures==numTextures) {
		tick();//Loaded the last texture, so i call here the "tick" for avoid texture warnings.
	}
}

/**
 * Initializing the Cube textures
 * @author mccarmo
 */
function initTextures() {
	var realTextures = ["/resources/img/blue.png","/resources/img/yellow.png","/resources/img/white.png",
	                    "/resources/img/orange.png","/resources/img/green.png","/resources/img/red.png"];
			
    textureBlue = gl.createTexture();
    textureBlue.image = new Image();
    textureBlue.image.onload = function () {
    	loadedTextures++;
        handleLoadedTexture(textureBlue);
    }
    textureBlue.image.src = realTextures[0];
	
	textureYellow = gl.createTexture();
    textureYellow.image = new Image();
    textureYellow.image.onload = function () {
    	loadedTextures++;
        handleLoadedTexture(textureYellow);
    }
    textureYellow.image.src = realTextures[1];
	
	textureWhite = gl.createTexture();
    textureWhite.image = new Image();
    textureWhite.image.onload = function () {
    	loadedTextures++;
        handleLoadedTexture(textureWhite);		
    }
    textureWhite.image.src = realTextures[2];
	
	textureMagent = gl.createTexture();
    textureMagent.image = new Image();
    textureMagent.image.onload = function () {
    	loadedTextures++;
        handleLoadedTexture(textureMagent);
    }
    textureMagent.image.src = realTextures[3];
	
	textureGreen = gl.createTexture();
    textureGreen.image = new Image();
    textureGreen.image.onload = function () {
    	loadedTextures++;
        handleLoadedTexture(textureGreen);		
    }
    textureGreen.image.src = realTextures[4];
	
    textureRed = gl.createTexture();
    textureRed.image = new Image();
    textureRed.image.onload = function () {
    	loadedTextures++;
        handleLoadedTexture(textureRed);
    }
    textureRed.image.src = realTextures[5];	
}

/**
 * This function schedules an action of rotation
 * of the cube about the X axis.
 * @author mccarmo
 */
var eventOnXaxis = function (reference,angulo) {
	function evento() {
		cubeArray.map(function(c){
			if(Math.round(c.centro[0])==reference){
				c.rotateCubeX(angulo);
			}
		});
	}		
	return evento;
}	

/**
 * This function schedules an action of rotation
 * of the cube about the Y axis.
 * @author mccarmo
 */
var eventOnYaxis = function(reference,angulo) {
	function evento() {            			          			    	            		            
		cubeArray.map(function(c){
			if(Math.round(c.centro[1])==reference){
				c.rotateCubeY(angulo);
			}
		});			
	}		
	return evento;
}	

/**
 * This function schedules an action of rotation
 * of the cube about the Z axis.
 * @author mccarmo
 */
var eventOnZaxis = function (reference,angulo) {
	function evento() {             			          			    	            		            	
		cubeArray.map(function(c){
			if(Math.round(c.centro[2])==reference){
				c.rotateCubeZ(angulo);
			}
		});
	}		
	return evento;
}

/**
 * This function will randomizing the cube
 * @author mccarmo
 */
function cubeRandom() {
	var referencesArray = [16.0,-16.0,0.0];
	var signArray = [1.0,-1.0];
	var axisArray = [eventOnXaxis,eventOnYaxis,eventOnZaxis];
	
	for(i=0;i<Math.floor((Math.random() * 200) + 1);i++) {		
		var reference = referencesArray[Math.floor((Math.random() * 2) + 1)];
		var sign = signArray[Math.floor((Math.random() * 1) + 1)];
		var axis = axisArray[Math.floor((Math.random() * 2) + 1)](reference,sign * 10.0);						
		for(i=1;i<10;i++) {
			movesArray.push(axis);
		}		
	}
}

function tick() {
    requestAnimFrame(tick);
    handleKeys();
    drawScene();
    animate();	
}

/**
 * This function will check if the current Game Configuration match the "Winner!" State of the Cube!
 * @author mccarmo
 */
function checkIfGameEnded() {
	//Here we check if the Game has Ended (if the current state of the cube is equal the init state)!
    //This is a creep way to do that...but for now this will remain here. If you imagine a better way, 
    //please help! :)
    if(gameStarted && movesArray.length==0) {
    	var cubeState = [];
    	for(i=0;i<cubeArray.length;i++){    	
    		var verticesArray = JSON.parse(JSON.stringify(cubeArray[i].vertices)); 
    		for(z=0;z<verticesArray.length;z++) {
    			var vet = verticesArray[z];
    			for(w=0;w<vet.length;w++) {
    				vet[w] = Math.round(vet[w]);
    			}
    		}
    		cubeState.push(verticesArray);        		
    	}
    	if(JSON.stringify(cubeState)==localStorage["cubeArrayInitSate"]) {
    		alert("Good Job! :)");
    		gameStarted = false;
			//Remove saved game state from the localStorage
			localStorage.removeItem("cubeSavedState");
    	}
    }
}
/**
 * Handle the Page Events like button events.
 */
function initPageEvents() {
	//New Game
    document.getElementById("btNewGame").onclick = function() {
    	//Initializing the Cube
    	movesArray = [];
    	initCubes();
    	
    	//Store the Init State for Compare
    	var cubeArrayInitSate = [];
    	for(i=0;i<cubeArray.length;i++){    	
    		cubeArrayInitSate.push(JSON.parse(JSON.stringify(cubeArray[i].vertices)));
    	}
    	localStorage["cubeArrayInitSate"] = JSON.stringify(cubeArrayInitSate);
    	
    	
    	//Random the Cube
    	cubeRandom();
    	
    	//Game Started
    	gameStarted=true;
    };
    //Save Game
    document.getElementById("btSaveGame").onclick = function() {
    	//Only Save The Game when the Game is Started and there is no game movement in schedule
    	
    	if(gameStarted && movesArray.length==0){
    		var cubeArraySavedState  = [];
	    	for(i=0;i<cubeArray.length;i++){    	
	    		cubeArraySavedState.push(JSON.parse(JSON.stringify(cubeArray[i].vertices)));
	    	}
	    	localStorage["cubeSavedState"] = JSON.stringify(cubeArraySavedState);	    	
    	}
    };
    //Load Game
    document.getElementById("btLoadGame").onclick = function() {	
    	//Only Loads The Game when the Game is Started The Game when there is no game movement in schedule
	if(localStorage["cubeSavedState"]!=undefined) {
		var cubeArraySavedState = JSON.parse(localStorage["cubeSavedState"]);
		if(gameStarted && typeof(cubeArraySavedState)!='undefined' && cubeArraySavedState.length==26 && movesArray.length==0) {	    	    		
			for(i=0;i<cubeArray.length;i++){
				cubeArray[i].vertices = JSON.parse(JSON.stringify(cubeArraySavedState[i]));
			}	    	
		}
	}
    };
}

/**
 * Inializing everything needed then starts the Rubik's Cube Game!
 * @author mccarmo
 */
function webGLStart() {
    var canvas = document.getElementById("rubiks");
      
    initGL(canvas);
    initPageEvents();
    initShaders();	
    initTextures();
    initCubes();
	
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
	
    canvas.addEventListener("touchmove",handleTouchMove);
    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;	
    
}		
