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

for(i=0;i<vCubos.length;i++) {
    vCubos[i] = new GeraCubo();
}	

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
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
   vCubos[0].init(gl,1,2.0,1.0,1.0);			 			 
   vCubos[1] .init(gl,2,0.0,1.0,1.0);			 			
   vCubos[2].init(gl,3,-2.0,1.0,1.0);
   vCubos[3].init(gl,4,2.0,-1.0,1.0);
   vCubos[4].init(gl,5,0.0,-1.0,1.0);
   vCubos[5].init(gl,6,-2.0,-1.0,1.0);
   vCubos[6].init(gl,7,2.0,-3.0,1.0);
   vCubos[7].init(gl,8,0.0,-3.0,1.0);
   vCubos[8].init(gl,9,-2.0,-3.0,1.0);   			     		
   //Middle
   vCubos[9].init(gl,10,2.0,1.0,-1.0);       				 
   vCubos[10].init(gl,11,0.0,1.0,-1.0);          
   vCubos[11].init(gl,12,-2.0,1.0,-1.0);		
   vCubos[12].init(gl,13,2.0,-1.0,-1.0);       						 	
   vCubos[13].init(gl,14,-2.0,-1.0,-1.0);
   vCubos[14].init(gl,15,2.0,-3.0,-1.0);	
   vCubos[15].init(gl,16,0.0,-3.0,-1.0);        				
   vCubos[16].init(gl,17,-2.0,-3.0,-1.0);
   //Back      
   vCubos[17].init(gl,18,2.0,1.0,-3.0);
   vCubos[18].init(gl,19,0.0,1.0,-3.0);
   vCubos[19].init(gl,20,-2.0,1.0,-3.0);
   vCubos[20].init(gl,21,2.0,-1.0,-3.0);
   vCubos[21].init(gl,22,0.0,-1.0,-3.0);
   vCubos[22].init(gl,23,-2.0,-1.0,-3.0);
   vCubos[23].init(gl,24,2.0,-3.0,-3.0);
   vCubos[24].init(gl,25,0.0,-3.0,-3.0);
   vCubos[25].init(gl,26,-2.0,-3.0,-3.0);    		
   
   for(i=0;i<vCubos.length;i++) {
	   vCubos[i].criaCubo();
   }
}

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [0.0, 0.0, -20.0]);
   
    //xRot+=0.5;
    //yRot+=0.5;        

    mat4.rotate(mvMatrix, degToRad(xRot), [1, 0, 0]);
    mat4.rotate(mvMatrix, degToRad(yRot), [0, 1, 0]);
    mat4.multiply(mvMatrix, rotationMatrix);
    
    for(i=0;i<vCubos.length;i++) {
    	vCubos[i].desenhaCubo();
    }
      
}

function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;
        xRot += (xSpeed * elapsed) / 1000.0;
        yRot += (ySpeed * elapsed) / 1000.0;
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

var currentlyPressedKeys = {};

function handleKeyDown(event) {
  currentlyPressedKeys[event.keyCode] = true;
  var currKey =  String.fromCharCode(event.keyCode);	
  if (currKey  == "R") {
    xRot = 0;
    yRot = 0;
    xSpeed = 0;
    ySpeed = 0;
  }
  //if (currKey == "") {
    
  //} 		
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

    var deltaX = newX - lastMouseX
    var newRotationMatrix = mat4.create();
    mat4.identity(newRotationMatrix);
    mat4.rotate(newRotationMatrix, degToRad(deltaX / 10), [0, 1, 0]);

    var deltaY = newY - lastMouseY;
    mat4.rotate(newRotationMatrix, degToRad(deltaY / 10), [1, 0, 0]);

    mat4.multiply(newRotationMatrix, rotationMatrix, rotationMatrix);

    lastMouseX = newX
    lastMouseY = newY;
}

function handleLoadedTexture(texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

function initTextures() {
    textureBlue = gl.createTexture();
    textureBlue.image = new Image();
    textureBlue.image.onload = function () {
        handleLoadedTexture(textureBlue)
    }
    textureBlue.image.src = "blue.png";

    textureRed = gl.createTexture();
    textureRed.image = new Image();
    textureRed.image.onload = function () {
        handleLoadedTexture(textureRed)
    }
    textureRed.image.src = "red.png";

    textureMagent = gl.createTexture();
    textureMagent.image = new Image();
    textureMagent.image.onload = function () {
        handleLoadedTexture(textureMagent)
    }
    textureMagent.image.src = "magent.png";

    textureGreen = gl.createTexture();
    textureGreen.image = new Image();
    textureGreen.image.onload = function () {
        handleLoadedTexture(textureGreen)
    }
    textureGreen.image.src = "green.png";

    textureYellow = gl.createTexture();
    textureYellow.image = new Image();
    textureYellow.image.onload = function () {
        handleLoadedTexture(textureYellow)
    }
    textureYellow.image.src = "yellow.png";

    textureWhite = gl.createTexture();
    textureWhite.image = new Image();
    textureWhite.image.onload = function () {
        handleLoadedTexture(textureWhite)
    }
    textureWhite.image.src = "white.png";

    textureNoColor = gl.createTexture();
    textureNoColor.image = new Image();
    textureNoColor.image.onload = function () {
        handleLoadedTexture(textureNoColor)
    }
    textureNoColor.image.src = "nocolor.png";
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
    initTextures();
    initBuffers();
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
	
    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    
    tick();
}		