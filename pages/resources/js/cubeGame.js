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
var vCubos = new Array(26);//store the references for the 26 cubes
var shaderProgram;
var textureBlue,textureRed,textureMagent,
	textureGreen,textureYellow,textureWhite,textureNoColor;
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var mvMatrixStack = [];
var xRot = 0;
var xSpeed = 0;
var yRot = 0;
var ySpeed = 0;
var rotationMatrix = mat4.create();
	mat4.identity(rotationMatrix);
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;
var numTextures = 6;
var loadedTextures = 0;
var movesArray = [];
var currentlyPressedKeys = {};


function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        
        for(i=0;i<vCubos.length;i++) {
            vCubos[i] = new GeraCubo();
        }
        
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL.");
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
    
function initBuffers() {    		
   //Front      
   vCubos[0].init(gl,1,-1.0,1.0,1.0,0,0,0);			 			 
   vCubos[1] .init(gl,2,0.0,1.0,1.0,0,0,0);			 			
   vCubos[2].init(gl,3,1.0,1.0,1.0,0,0,0);
   vCubos[3].init(gl,4,-1.0,0.0,1.0,0,0,0);
   vCubos[4].init(gl,5,0.0,0.0,1.0,0,0,0);
   vCubos[5].init(gl,6,1.0,0.0,1.0,0,0,0);
   vCubos[6].init(gl,7,-1.0,-1.0,1.0,0,0,0);
   vCubos[7].init(gl,8,0.0,-1.0,1.0,0,0,0);
   vCubos[8].init(gl,9,1.0,-1.0,1.0,0,0,0);   			     		
   //Middle
   vCubos[9].init(gl,10,-1.0,1.0,0.0,0,0,1);       				 
   vCubos[10].init(gl,11,0.0,1.0,0.0,0,0,1);          
   vCubos[11].init(gl,12,1.0,1.0,0.0,0,0,1);		
   vCubos[12].init(gl,13,-1.0,0.0,0.0,0,0,1);       						 	
   vCubos[13].init(gl,14,1.0,0.0,0.0,0,0,1);
   vCubos[14].init(gl,15,-1.0,-1.0,0.0,0,0,1);	
   vCubos[15].init(gl,16,0.0,-1.0,0.0,0,0,1);        				
   vCubos[16].init(gl,17,1.0,-1.0,0.0,0,0,1);
   //Back      
   vCubos[17].init(gl,18,-1.0,1.0,-1.0,0,0,2);
   vCubos[18].init(gl,19,0.0,1.0,-1.0,0,0,2);
   vCubos[19].init(gl,20,1.0,1.0,-1.0,0,0,2);
   vCubos[20].init(gl,21,-1.0,0.0,-1.0,0,0,2);
   vCubos[21].init(gl,22,0.0,0.0,-1.0,0,0,2);
   vCubos[22].init(gl,23,1.0,0.0,-1.0,0,0,2);
   vCubos[23].init(gl,24,-1.0,-1.0,-1.0,0,0,2);
   vCubos[24].init(gl,25,0.0,-1.0,-1.0,0,0,2);
   vCubos[25].init(gl,26,1.0,-1.0,-1.0,0,0,2);    		      
}

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [0.0, 0.0, -10.0]);
   
    //xRot+=0.5;
    //yRot+=0.5;        

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
        
        vCubos.map(function(c){
        	c.criaCubo();
        });
                
        var move = movesArray.shift();
        if(typeof(move)=='function'){
        	move();
        };
        
    }
    lastTime = timeNow;
}

function handleKeys() {        
if (currentlyPressedKeys[37]) {
      // Left cursor key
      ySpeed -= 1;
    }
    if (currentlyPressedKeys[39]) {
      // Right cursor key
      ySpeed += 1;
    }
    if (currentlyPressedKeys[38]) {
      // Up cursor key
      xSpeed -= 1;
    }
    if (currentlyPressedKeys[40]) {
      // Down cursor key
      xSpeed += 1;
    }
}

function handleKeyDown(event) {
  currentlyPressedKeys[event.keyCode] = true;
  var currKey =  String.fromCharCode(event.keyCode);	
  if (currKey  == "R") {
    xRot = 0;
    yRot = 0;
    xSpeed = 0;
    ySpeed = 0;
  }
  if (currKey == "Q") {
	  for(i=1;i<10;i++) {
		  movesArray.push(new eventOnZaxis("Lista1 ->",8.0,10.0));
	  }
  } 
  if (currKey == "W") {
	  for(i=1;i<10;i++) {
		  movesArray.push(new eventOnZaxis("Lista2 ->",0.0,10.0));
	  }
  } 	
  if (currKey == "E") {
	  for(i=1;i<10;i++) {
		  movesArray.push(new eventOnZaxis("Lista3 ->",-8.0,10.0));
	  }
  }   
  if (currKey == "A") {
	  for(i=1;i<10;i++) {
		  movesArray.push(new eventOnZaxis("Lista1 <-",8.0,-10.0));
	  }
  } 
  if (currKey == "S") {
	  for(i=1;i<10;i++) {
		  movesArray.push(new eventOnZaxis("Lista2 <-",0.0,-10.0));
	  }
  } 
  if (currKey == "D") {
	  for(i=1;i<10;i++) {
		  movesArray.push(new eventOnZaxis("Lista3 <-",-8.0,-10.0));
	  }
  } 
  if (currKey == "R") {
	  for(i=1;i<10;i++) {
		  movesArray.push(new eventOnXaxis("Lista4 ->",8.0,10.0));
	  }
  } 
  if (currKey == "T") {
	  for(i=1;i<10;i++) {
		  movesArray.push(new eventOnXaxis("Lista5 ->",0.0,10.0));
	  }
  } 
  if (currKey == "Y") {
	  for(i=1;i<10;i++) {
		  movesArray.push(new eventOnXaxis("Lista6 ->",-8.0,10.0));
	  }
  }   
  if (currKey == "F") {
	  for(i=1;i<10;i++) {
		  movesArray.push(new eventOnXaxis("Lista4 <-",8.0,-10.0));
	  }
  } 
  if (currKey == "G") {
	  for(i=1;i<10;i++) {
		  movesArray.push(new eventOnXaxis("Lista5 <-",0.0,-10.0));
	  }
  } 
  if (currKey == "H") {
	  for(i=1;i<10;i++) {
		  movesArray.push(new eventOnXaxis("Lista6 <-",-8.0,-10.0));
	  }
  } 
  if (currKey == "U") {
	  for(i=1;i<10;i++) {
		  movesArray.push(new eventOnYaxis("Lista7 ->",8.0,10.0));
	  }
  } 
  if (currKey == "I") {
	  for(i=1;i<10;i++) {
		  movesArray.push(new eventOnYaxis("Lista8 ->",0.0,10.0));
	  }
  } 
  if (currKey == "O") {
	  for(i=1;i<10;i++) {
		  movesArray.push(new eventOnYaxis("Lista9 ->",-8.0,10.0));
	  }
  }   
  if (currKey == "J") {
	  for(i=1;i<10;i++) {
		  movesArray.push(new eventOnYaxis("Lista7 <-",8.0,-10.0));
	  }
  }   
  if (currKey == "K") {
	  for(i=1;i<10;i++) {
		  movesArray.push(new eventOnYaxis("Lista8 <-",0.0,-10.0));
	  }
  } 
  if (currKey == "L") {
	  for(i=1;i<10;i++) {
		  movesArray.push(new eventOnYaxis("Lista9 <-",-8.0,-10.0));
	  }	  
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

function handleMouseMove(event) {
    if (!mouseDown) {
        return;
    }
    var newX = event.clientX;
    var newY = event.clientY;
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

function handleLoadedTexture(texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	gl.generateMipmap(gl.TEXTURE_2D);   
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); //My textures are power-of-2
    gl.bindTexture(gl.TEXTURE_2D, null);
	//Workaround...yes...it is...and yes i comment that here, sorry.
	if(loadedTextures>=numTextures) {
		tick();//Loaded the last texture, so i call here the "tick" for avoid texture warnings.
	}
}

function initTextures() {
    textureBlue = gl.createTexture();
    textureBlue.image = new Image();
    textureBlue.image.onload = function () {
        handleLoadedTexture(textureBlue);
		loadedTextures++;
    }
    textureBlue.image.src = "/resources/img/blue.png";
	
	textureYellow = gl.createTexture();
    textureYellow.image = new Image();
    textureYellow.image.onload = function () {
        handleLoadedTexture(textureYellow);
		loadedTextures++;
    }
    textureYellow.image.src = "/resources/img/yellow.png";
	
	textureWhite = gl.createTexture();
    textureWhite.image = new Image();
    textureWhite.image.onload = function () {
        handleLoadedTexture(textureWhite);
		loadedTextures++;
    }
    textureWhite.image.src = "/resources/img/white.png";
	
	textureMagent = gl.createTexture();
    textureMagent.image = new Image();
    textureMagent.image.onload = function () {
        handleLoadedTexture(textureMagent);
		loadedTextures++;
    }
    textureMagent.image.src = "/resources/img/magent.png";
	
	textureGreen = gl.createTexture();
    textureGreen.image = new Image();
    textureGreen.image.onload = function () {
        handleLoadedTexture(textureGreen);
		loadedTextures++;
    }
    textureGreen.image.src = "/resources/img/green.png";
	
    textureRed = gl.createTexture();
    textureRed.image = new Image();
    textureRed.image.onload = function () {
        handleLoadedTexture(textureRed);
		loadedTextures++;
    }
    textureRed.image.src = "/resources/img/red.png";

    textureNoColor = gl.createTexture();
    textureNoColor.image = new Image();
    textureNoColor.image.onload = function () {
        handleLoadedTexture(textureNoColor);
		loadedTextures++;	    
    }
    textureNoColor.image.src = "/resources/img/nocolor.png";	
}

var eventOnXaxis = function (lista,comparacao,angulo) {
	function evento() {
		//console.log(lista);
		vCubos.map(function(c){
			if(Math.round(c.centro[0])==comparacao){
				c.rotateCubeX(angulo);
			}
		});
	}		
	return evento;
}	

var eventOnYaxis = function(lista,comparacao,angulo) {
	function evento() {
		//console.log(lista);              			          			    	            		            
		vCubos.map(function(c){
			if(Math.round(c.centro[1])==comparacao){
				c.rotateCubeY(angulo);
			}
		});			
	}		
	return evento;
}	

var eventOnZaxis = function (lista,comparacao,angulo) {
	function evento() {
		//console.log(lista);              			          			    	            		            	
		vCubos.map(function(c){
			if(Math.round(c.centro[2])==comparacao){
				c.rotateCubeZ(angulo);
			}
		});
	}		
	return evento;
}

function tick() {
    requestAnimFrame(tick);
    handleKeys();
    drawScene();
    animate();	
}

function webGLStart() {
    var canvas = document.getElementById("rubiks");
  
    initGL(canvas);
    initShaders();	
    initBuffers();
	initTextures();
	
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
	
    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;	
}		

