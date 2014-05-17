function GeraCubo() {
	
	var id;
	var x,y,z;
	var centro;
	var v1 = [];
	var v2 = [];
	var v3 = [];
	var v4 = [];
	var v5 = [];
	var v6 = [];
	var v7 = [];
	var v8 = [];	
	var gl;
	
	var cubeVertexPositionBuffer;
	var cubeVertexTextureCoordBuffer;
	var cubeVertexIndexBuffer;
	
	this.init = function(gl,id,px,py,pz) {
		this.gl = gl;
		this.id = id;        	    	    	
		this.x = px;
		this.y = py;
		this.z = pz;		
		this.v1 = [0.0,0.0,0.0];
		this.v2 = [0.0,0.0,0.0];    		
		this.v3 = [0.0,0.0,0.0];
		this.v4 = [0.0,0.0,0.0];
		this.v5 = [0.0,0.0,0.0];
		this.v6 = [0.0,0.0,0.0];
		this.v7 = [0.0,0.0,0.0];
		this.v8 = [0.0,0.0,0.0];
		this.setaXYZ();
		
		this.cubeVertexPositionBuffer = this.gl.createBuffer();
		this.cubeVertexTextureCoordBuffer = this.gl.createBuffer();
		this.cubeVertexIndexBuffer = this.gl.createBuffer();
	}
	this.criaCubo = function() {		
	    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);           	
            var vertices = [
			this.v1[0],this.v1[1],this.v1[2], //Front
        		this.v2[0],this.v2[1],this.v2[2],
        		this.v3[0],this.v3[1],this.v3[2],
        		this.v4[0],this.v4[1],this.v4[2], 
			
			this.v5[0],this.v5[1],this.v5[2], 
			this.v6[0],this.v6[1],this.v6[2],
			this.v7[0],this.v7[1],this.v7[2],
			this.v8[0],this.v8[1],this.v8[2],
			
			this.v6[0],this.v6[1],this.v6[2],
			this.v4[0],this.v4[1],this.v4[2],
			this.v3[0],this.v3[1],this.v3[2],
			this.v7[0],this.v7[1],this.v7[2],
			
			this.v5[0],this.v5[1],this.v5[2],
			this.v8[0],this.v8[1],this.v8[2],
			this.v2[0],this.v2[1],this.v2[2],
			this.v1[0],this.v1[1],this.v1[2],
			
			this.v8[0],this.v8[1],this.v8[2],
			this.v7[0],this.v7[1],this.v7[2],
			this.v3[0],this.v3[1],this.v3[2],
			this.v2[0],this.v2[1],this.v2[2],
			
			this.v5[0],this.v5[1],this.v5[2],
			this.v1[0],this.v1[1],this.v1[2],
			this.v4[0],this.v4[1],this.v4[2],
			this.v6[0],this.v6[1],this.v6[2]
    	];
	    
    	this.centro = [
  		  	this.v1[0]+this.v2[0]+this.v3[0]+this.v4[0]+this.v5[0]+this.v6[0]+this.v7[0]+this.v8[0],
  		  	this.v1[1]+this.v2[1]+this.v3[1]+this.v4[1]+this.v5[1]+this.v6[1]+this.v7[1]+this.v8[1],
  		  	this.v1[2]+this.v2[2]+this.v3[2]+this.v4[2]+this.v5[2]+this.v6[2]+this.v7[2]+this.v8[2]
  		];
    	
	    this.gl.bufferData(this.gl.ARRAY_BUFFER, 
						   new Float32Array(vertices), 
						   this.gl.STATIC_DRAW);
	    this.cubeVertexPositionBuffer.itemSize = 3;
	    this.cubeVertexPositionBuffer.numItems = 24;
	    
	    this.cubeVertexTextureCoordBuffer = this.gl.createBuffer();
	    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer);
	    var textureCoords = [
		  // Front face
		  0.0, 0.0,
		  1.0, 0.0,
		  1.0, 1.0,
		  0.0, 1.0,

		  // Back face
		  1.0, 0.0,
		  1.0, 1.0,
		  0.0, 1.0,
		  0.0, 0.0,

		  // Top face
		  0.0, 1.0,
		  0.0, 0.0,
		  1.0, 0.0,
		  1.0, 1.0,

		  // Bottom face
		  1.0, 1.0,
		  0.0, 1.0,
		  0.0, 0.0,
		  1.0, 0.0,

		  // Right face
		  1.0, 0.0,
		  1.0, 1.0,
		  0.0, 1.0,
		  0.0, 0.0,

		  // Left face
		  0.0, 0.0,
		  1.0, 0.0,
		  1.0, 1.0,
		  0.0, 1.0,
	    ];
		
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textureCoords), this.gl.STATIC_DRAW);
		this.cubeVertexTextureCoordBuffer.itemSize = 2;
		this.cubeVertexTextureCoordBuffer.numItems = 24;
        
	    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
		    var cubeVertexIndices = [
		      0, 1, 2,      0, 2, 3,    // Front face
		      4, 5, 6,      4, 6, 7,    // Back face
		      8, 9, 10,     8, 10, 11,  // Top face
		      12, 13, 14,   12, 14, 15, // Bottom face
		      16, 17, 18,   16, 18, 19, // Right face
		      20, 21, 22,   20, 22, 23  // Left face
		    ]
	    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), this.gl.STATIC_DRAW);
		
	    mvPushMatrix();			 
		//mat4.translate(mvMatrix, [this.x,this.y,this.z]);				
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
		this.gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);		
		setMatrixUniforms();
					
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer);
		this.gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.cubeVertexTextureCoordBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
		
		if(this.id >= 10 && this.id <= 26) {
			this.gl.activeTexture(this.gl.TEXTURE6);
			this.gl.bindTexture(this.gl.TEXTURE_2D, textureNoColor);
			this.gl.uniform1i(shaderProgram.samplerUniform, 6);
			this.gl.drawElements(this.gl.TRIANGLE_STRIP, 6, this.gl.UNSIGNED_SHORT, 0);
		} else {
			this.gl.activeTexture(this.gl.TEXTURE0);
			this.gl.bindTexture(this.gl.TEXTURE_2D, textureBlue);
			this.gl.uniform1i(shaderProgram.samplerUniform, 0);
			this.gl.drawElements(this.gl.TRIANGLE_STRIP, 6, this.gl.UNSIGNED_SHORT, 0);			
		}
		
		if(this.id >= 1 && this.id <= 17) {
			this.gl.activeTexture(this.gl.TEXTURE6);
			this.gl.bindTexture(this.gl.TEXTURE_2D, textureNoColor);
			this.gl.uniform1i(shaderProgram.samplerUniform, 6);
			this.gl.drawElements(this.gl.TRIANGLE_STRIP, 6, this.gl.UNSIGNED_SHORT, 12);
		} else {
			this.gl.activeTexture(this.gl.TEXTURE1);
			this.gl.bindTexture(this.gl.TEXTURE_2D, textureYellow);
			this.gl.uniform1i(shaderProgram.samplerUniform, 1);
			this.gl.drawElements(this.gl.TRIANGLE_STRIP, 6, this.gl.UNSIGNED_SHORT, 12);			
		}
				
		this.gl.activeTexture(this.gl.TEXTURE2);
		this.gl.bindTexture(this.gl.TEXTURE_2D, textureWhite);
		this.gl.uniform1i(shaderProgram.samplerUniform, 2);
		this.gl.drawElements(this.gl.TRIANGLE_STRIP, 6, this.gl.UNSIGNED_SHORT, 24);
		
		this.gl.activeTexture(this.gl.TEXTURE3);
		this.gl.bindTexture(this.gl.TEXTURE_2D, textureMagent);
		this.gl.uniform1i(shaderProgram.samplerUniform, 3);
		this.gl.drawElements(this.gl.TRIANGLE_STRIP, 6, this.gl.UNSIGNED_SHORT, 36);
		
		this.gl.activeTexture(this.gl.TEXTURE4);
		this.gl.bindTexture(this.gl.TEXTURE_2D, textureGreen);
		this.gl.uniform1i(shaderProgram.samplerUniform, 4);
		this.gl.drawElements(this.gl.TRIANGLE_STRIP, 6, this.gl.UNSIGNED_SHORT, 48);
		
		this.gl.activeTexture(this.gl.TEXTURE5);
		this.gl.bindTexture(this.gl.TEXTURE_2D, textureRed);
		this.gl.uniform1i(shaderProgram.samplerUniform, 5);
		this.gl.drawElements(this.gl.TRIANGLE_STRIP, 6, this.gl.UNSIGNED_SHORT, 60);

		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);		
	    mvPopMatrix();	 		
	}

	this.rotateZ = function(v,a)
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
				[Math.cos(degToRad(a)),-Math.sin(degToRad(a)), 0.0],
				[Math.sin(degToRad(a)), Math.cos(degToRad(a)), 0.0],
				[                  0.0,                   0.0, 1.0],
				[                  0.0,                   0.0, 0.0]
		];				
		
		var nx = (matriz1[0][0]*x) + (matriz1[0][1]*y) + (matriz1[0][2]*z) + xref;
		var ny = (matriz1[1][0]*x) + (matriz1[1][1]*y) + (matriz1[1][2]*z) + yref;
		var nz = (matriz1[2][0]*x) + (matriz1[2][1]*y) + (matriz1[2][2]*z) + zref;				

		v[0] = nx;		
		v[1] = ny;
		v[2] = nz;
		
		return v;
	}	

	this.rotateX = function(v,a)
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
			 [0.0, Math.cos(degToRad(a)), Math.sin(degToRad(a))],
			 [0.0, -Math.sin(degToRad(a)), Math.cos(degToRad(a))]
		];

		var nx = (matriz2[0][0]*x) + (matriz2[0][1]*y) + (matriz2[0][2]*z) + xref;
		var ny = (matriz2[1][0]*x) + (matriz2[1][1]*y) + (matriz2[1][2]*z) + yref;
		var nz = (matriz2[2][0]*x) + (matriz2[2][1]*y) + (matriz2[2][2]*z) + zref;
		
		v[0] = nx;		
		v[1] = ny;
		v[2] = nz;	
		
		return v;
	}

	this.rotateY = function(v,a)
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
			[Math.cos(degToRad(a)), 0.0, Math.sin(degToRad(a))],
			[0.0, 1.0, 0.0],
			[-Math.sin(degToRad(a)), 0.0, Math.cos(degToRad(a))]
		];
			
		var nx = (matriz3[0][0]*x) + (matriz3[0][1]*y) + (matriz3[0][2]*z) + xref;
		var ny = (matriz3[1][0]*x) + (matriz3[1][1]*y) + (matriz3[1][2]*z) + yref;
		var nz = (matriz3[2][0]*x) + (matriz3[2][1]*y) + (matriz3[2][2]*z) + zref;
		
		v[0] = nx;		
		v[1] = ny;
		v[2] = nz;	
		
		return v;
	}

	//Recebe o cubo e rotaciona em Z no angulo "angulo" todos os vértices	
	this.rotateCubeZ = function(angulo) {	    	    
		this.v1 = this.rotateZ(this.v1,angulo);		
		this.v2 = this.rotateZ(this.v2,angulo);		
		this.v3 = this.rotateZ(this.v3,angulo);		
		this.v4 = this.rotateZ(this.v4,angulo);		
		this.v5 = this.rotateZ(this.v5,angulo);		
		this.v6 = this.rotateZ(this.v6,angulo);		
		this.v7 = this.rotateZ(this.v7,angulo);		
		this.v8 = this.rotateZ(this.v8,angulo);
	}

	//Recebe o cubo e rotaciona em X no angulo "angulo" todos os vértices	
	this.rotateCubeX = function(angulo) {	    
		this.v1 = this.rotateX(this.v1,angulo);		
		this.v2 = this.rotateX(this.v2,angulo);		
		this.v3 = this.rotateX(this.v3,angulo);		
		this.v4 = this.rotateX(this.v4,angulo);		
		this.v5 = this.rotateX(this.v5,angulo);		
		this.v6 = this.rotateX(this.v6,angulo);		
		this.v7 = this.rotateX(this.v7,angulo);		
		this.v8 = this.rotateX(this.v8,angulo);									
	}	

	//Recebe o cubo e rotaciona em Y no angulo "angulo" todos os vértices
	this.rotateCubeY = function(angulo) {
		this.v1 = this.rotateY(this.v1,angulo);
		this.v2 = this.rotateY(this.v2,angulo);		
		this.v3 = this.rotateY(this.v3,angulo);		
		this.v4 = this.rotateY(this.v4,angulo);		
		this.v5 = this.rotateY(this.v5,angulo);		
		this.v6 = this.rotateY(this.v6,angulo);		
		this.v7 = this.rotateY(this.v7,angulo);		
		this.v8 = this.rotateY(this.v8,angulo);									
	}		
	
	this.setaXYZ = function() {
    	this.v1[0] = -0.5 + this.x;
		this.v1[1] = -0.5 + this.y;
		this.v1[2] =  0.5 + this.z;		
    	
    	this.v2[0] =  0.5 + this.x;    		
    	this.v2[1] = -0.5 + this.y;
    	this.v2[2] =  0.5 + this.z;
    	
    	this.v3[0] =  0.5 + this.x;
    	this.v3[1] =  0.5 + this.y;
    	this.v3[2] =  0.5 + this.z;
    	
    	this.v4[0] = -0.5 + this.x;
    	this.v4[1] =  0.5 + this.y;
    	this.v4[2] =  0.5 + this.z;
    	
    	this.v5[0] = -0.5 + this.x;
    	this.v5[1] = -0.5 + this.y;
    	this.v5[2] = -0.5 + this.z;
    		
    	this.v6[0] = -0.5 + this.x;
    	this.v6[1] =  0.5 + this.y;
    	this.v6[2] = -0.5 + this.z;
    		
    	this.v7[0] =  0.5 + this.x;
    	this.v7[1] =  0.5 + this.y;
    	this.v7[2] = -0.5 + this.z;								
    	
    	this.v8[0] =  0.5 + this.x;
    	this.v8[1] =  -0.5 + this.y;
    	this.v8[2] = -0.5 + this.z;
    } 
}

