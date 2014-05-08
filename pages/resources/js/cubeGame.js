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
 	   vCubos[i].criaCubo();
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
  if (currKey == "Q") {
	  eventOnZaxis("Lista1 ->",0,45.0); 
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

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

function rotateZ(v,a)
{		
	var xref = 0.0; //Não há necessidade de usar o ponto de referência
	var yref = 0.0; //de rotação, por isso vamos usar (0,0,0)
	var zref = 0.0;		
	var x = v[0] - xref;
	var y = v[1] - yref;
	var z = v[2] - zref;
	
	/*|x|   |cos@ -sen@ 0|
	 *|y| * |sen@ cos@  0|
	 *|z|   | 0    0    1|		 
	 */
	
	//Rotação eixo Z			
	var matriz1 = [
			[Math.cos(a.toRad()),-Math.sin(a.toRad()),0.0],
			[Math.sin(a.toRad()),Math.cos(a.toRad()),0.0],
			[0.0, 0.0, 1.0]
	];				
			
	var nx = matriz1[0][0]*x + matriz1[0][1]*y + matriz1[0][2]*z + xref;
	var ny = matriz1[1][0]*x + matriz1[1][1]*y + matriz1[1][2]*z + yref;
	var nz = matriz1[2][0]*x + matriz1[2][1]*y + matriz1[2][2]*z + zref;
	
	v[0] = nx;		
	v[1] = ny;
	v[2] = nz;	
}	

function rotateX(v,a)
{
	
	var xref = 0.0; //Não há necessidade de usar o ponto de referência
	var yref = 0.0; //de rotação, por isso vamos usar (0,0,0)
	var zref = 0.0;		
	var x = v[0] - xref;
	var y = v[1] - yref;
	var z = v[2] - zref;
	
	/*|x|   |1    0     0 |
	 *|y| * |0   cos@ sen@|
	 *|z|   |0  -sen@ cos@|		 
	 */
		
	//Rotation on X axis					
	var matriz2 = [
		 [1.0, 0.0, 0.0],
		 [0.0, Math.cos(a.toRad()), Math.sin(a.toRad())],
		 [0.0, -Math.sin(a.toRad()), Math.cos(a.toRad())]
	];

	var nx = matriz2[0][0]*x + matriz2[0][1]*y + matriz2[0][2]*z + xref;
	var ny = matriz2[1][0]*x + matriz2[1][1]*y + matriz2[1][2]*z + yref;
	var nz = matriz2[2][0]*x + matriz2[2][1]*y + matriz2[2][2]*z + zref;
	
	v[0] = nx;		
	v[1] = ny;
	v[2] = nz;	
}

function rotateY(v,a)
{		
	var xref = 0.0; //Não há necessidade de usar o ponto de referência
	var yref = 0.0; //de rotação, por isso vamos usar (0,0,0)
	var zref = 0.0;		
	var x = v[0] - xref;
	var y = v[1] - yref;
	var z = v[2] - zref;
	
	/* |x|   | cos@   0   sin@|
	 * |y| * |  0     1    0  |
	 * |z|   |-sin@   0   cos@|		 
	 */
						
	//Rotação eixo Y		
	var matriz3 = [
		[Math.cos(a.toRad()), 0.0, Math.sin(a.toRad())],
		[0.0, 1.0, 0.0],
		[-Math.sin(a.toRad()), 0.0, Math.cos(a.toRad())]
	];
		
	var nx = matriz3[0][0]*x + matriz3[0][1]*y + matriz3[0][2]*z + xref;
	var ny = matriz3[1][0]*x + matriz3[1][1]*y + matriz3[1][2]*z + yref;
	var nz = matriz3[2][0]*x + matriz3[2][1]*y + matriz3[2][2]*z + zref;
	
	v[0] = nx;		
	v[1] = ny;
	v[2] = nz;	
}

//Recebe o cubo e rotaciona em Z no angulo "angulo" todos os vértices	
function rotateCubeZ(cubo,angulo) {
	rotateZ(cubo.v1,angulo);		
	rotateZ(cubo.v2,angulo);		
	rotateZ(cubo.v3,angulo);		
	rotateZ(cubo.v4,angulo);		
	rotateZ(cubo.v5,angulo);		
	rotateZ(cubo.v6,angulo);		
	rotateZ(cubo.v7,angulo);		
	rotateZ(cubo.v8,angulo);									
}

//Recebe o cubo e rotaciona em X no angulo "angulo" todos os vértices	
function rotateCubeX(cubo,angulo) {
	rotateX(cubo.v1,angulo);		
	rotateX(cubo.v2,angulo);		
	rotateX(cubo.v3,angulo);		
	rotateX(cubo.v4,angulo);		
	rotateX(cubo.v5,angulo);		
	rotateX(cubo.v6,angulo);		
	rotateX(cubo.v7,angulo);		
	rotateX(cubo.v8,angulo);									
}	

//Recebe o cubo e rotaciona em Y no angulo "angulo" todos os vértices
function rotateCubeY(cubo,angulo) {
	rotateY(cubo.v1,angulo);
	rotateY(cubo.v2,angulo);		
	rotateY(cubo.v3,angulo);		
	rotateY(cubo.v4,angulo);		
	rotateY(cubo.v5,angulo);		
	rotateY(cubo.v6,angulo);		
	rotateY(cubo.v7,angulo);		
	rotateY(cubo.v8,angulo);									
}		

function eventOnZaxis(lista,comparacao,angulo) {
	console.log(lista);              			          			    	            		            
	valrotlista = angulo;					
	var temp = new GeraCubo();
	for(i=0;i<vCubos.length;i++) {
		temp = vCubos[i];
		//Aqui geramos um vertice "virtual" do centro do cubo para calcular onde o cubo está"
		var centro = [
			temp.v1[0]+temp.v2[0]+temp.v3[0]+temp.v4[0]+temp.v5[0]+temp.v6[0]+temp.v7[0]+temp.v8[0],
		    temp.v1[1]+temp.v2[1]+temp.v3[1]+temp.v4[1]+temp.v5[1]+temp.v6[1]+temp.v7[1]+temp.v8[1],
		    temp.v1[2]+temp.v2[2]+temp.v3[2]+temp.v4[2]+temp.v5[2]+temp.v6[2]+temp.v7[2]+temp.v8[2]
		];
		if(Math.round(centro[2])==comparacao) {
			rotateCubeZ(vCubos[i],valrotlista);
		}						
	}								
}

function eventOnXaxis(lista,comparacao,angulo) {
	console.log(lista);              			          			    	            		            
	valrotlista = angulo;					
	var temp = new GeraCubo();
	for(i=0;i<vCubos.length;i++) {
		temp = vCubos[i];
		//Aqui geramos um vertice "virtual" do centro do cubo para calcular onde o cubo está"
		var centro = [
			temp.v1[0]+temp.v2[0]+temp.v3[0]+temp.v4[0]+temp.v5[0]+temp.v6[0]+temp.v7[0]+temp.v8[0],
		    temp.v1[1]+temp.v2[1]+temp.v3[1]+temp.v4[1]+temp.v5[1]+temp.v6[1]+temp.v7[1]+temp.v8[1],
		    temp.v1[2]+temp.v2[2]+temp.v3[2]+temp.v4[2]+temp.v5[2]+temp.v6[2]+temp.v7[2]+temp.v8[2]
		];
		if(Math.round(centro[0])==comparacao) {
			rotateCubeX(temp,valrotlista);	
		}						
	}					
}	

function eventOnYaxis(lista,comparacao,angulo) {
	console.log(lista);              			          			    	            		            
	valrotlista = angulo;					
	var temp = new GeraCubo();
	for(i=0;i<vCubos.length;i++) {
		//Aqui geramos um vertice "virtual" do centro do cubo para calcular onde o cubo está"
		temp = vCubos[i];
		var centro = [
			temp.v1[0]+temp.v2[0]+temp.v3[0]+temp.v4[0]+temp.v5[0]+temp.v6[0]+temp.v7[0]+temp.v8[0],
		    temp.v1[1]+temp.v2[1]+temp.v3[1]+temp.v4[1]+temp.v5[1]+temp.v6[1]+temp.v7[1]+temp.v8[1],
		    temp.v1[2]+temp.v2[2]+temp.v3[2]+temp.v4[2]+temp.v5[2]+temp.v6[2]+temp.v7[2]+temp.v8[2]
		];
		if(Math.round(centro[1])==comparacao) {
			rotateCubeY(temp,valrotlista);	
		}						
	}					
}	