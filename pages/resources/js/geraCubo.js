function GeraCubo() {
	
	var id;
	var x,y,z;
	var v1 = new Array();
	var v2 = new Array();
	var v3 = new Array();
	var v4 = new Array();
	var v5 = new Array();
	var v6 = new Array();
	var v7 = new Array();
	var v8 = new Array();
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
		
		this.cubeVertexPositionBuffer = this.gl.createBuffer();
		this.cubeVertexTextureCoordBuffer = this.gl.createBuffer();
		this.cubeVertexIndexBuffer = this.gl.createBuffer();
	}
	this.criaCubo = function() {	
	    this.geraVertices();
	    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);           	
    	    var vertices = [
			this.v1[0],this.v1[1],this.v1[2], //Frente
        	this.v2[0],this.v2[1],this.v2[2],
        	this.v3[0],this.v3[1],this.v3[2],
        	this.v4[0],this.v4[1],this.v4[2],    
        
        	this.v5[0],this.v5[1],this.v5[2], //Traz
    		this.v6[0],this.v6[1],this.v6[2],
    		this.v7[0],this.v7[1],this.v7[2],
    		this.v8[0],this.v8[1],this.v8[2],
            
    		this.v6[0],this.v6[1],this.v6[2],
    		this.v4[0],this.v4[1],this.v4[2], //Cima
		this.v3[0],this.v3[1],this.v3[2],      	
		this.v7[0],this.v7[1],this.v7[2],

		this.v5[0],this.v5[1],this.v5[2],
		this.v8[0],this.v8[1],this.v8[2],
		this.v2[0],this.v2[1],this.v2[2],
		this.v1[0],this.v1[1],this.v1[2], //Baixo
		            
		this.v8[0],this.v8[1],this.v8[2], //Direita
        	this.v7[0],this.v7[1],this.v7[2],
        	this.v3[0],this.v3[1],this.v3[2],
        	this.v2[0],this.v2[1],this.v2[2],   

		this.v5[0],this.v5[1],this.v5[2], //Esquerda
       		this.v1[0],this.v1[1],this.v1[2],
    		this.v4[0],this.v4[1],this.v4[2],
    		this.v6[0],this.v6[1],this.v6[2]
    	    ];
	    
	    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
		
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
		    
	}
	this.desenhaCubo = function() {
		    mvPushMatrix();
			mat4.translate(mvMatrix, [this.x,this.y,this.z]);
	        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
	        this.gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);
		        
	        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer);
	        this.gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.cubeVertexTextureCoordBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
	        
	        this.gl.activeTexture(this.gl.TEXTURE0);
			this.gl.bindTexture(this.gl.TEXTURE_2D, textureBlue);
			this.gl.uniform1i(shaderProgram.samplerUniform, 0);
			this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
			setMatrixUniforms();
	        
			this.gl.activeTexture(this.gl.TEXTURE1);
			this.gl.bindTexture(this.gl.TEXTURE_2D, textureYellow);
			this.gl.uniform1i(shaderProgram.samplerUniform, 1);
			this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 12);
			setMatrixUniforms();
			
			this.gl.activeTexture(this.gl.TEXTURE2);
			this.gl.bindTexture(this.gl.TEXTURE_2D, textureWhite);
			this.gl.uniform1i(shaderProgram.samplerUniform, 2);
			this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 24);
			setMatrixUniforms();
			
			this.gl.activeTexture(this.gl.TEXTURE3);
			this.gl.bindTexture(this.gl.TEXTURE_2D, textureMagent);
			this.gl.uniform1i(shaderProgram.samplerUniform, 3);
	        this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 36);
			setMatrixUniforms();
			
			this.gl.activeTexture(this.gl.TEXTURE4);
			this.gl.bindTexture(this.gl.TEXTURE_2D, textureGreen);
			this.gl.uniform1i(shaderProgram.samplerUniform, 4);
			this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 48);
			setMatrixUniforms();
			
			this.gl.activeTexture(this.gl.TEXTURE5);
			this.gl.bindTexture(this.gl.TEXTURE_2D, textureRed);
			this.gl.uniform1i(shaderProgram.samplerUniform, 5);
			this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 60);
			setMatrixUniforms();
	        
			this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
	        setMatrixUniforms();		
	    mvPopMatrix();	   
	}
	this.geraVertices = function() {
		this.v1 = [-1.0,-1.0,1.0];
    		this.v2 = [1.0,-1.0,1.0];    		
    		this.v3 = [1.0,1.0,1.0];
    		this.v4 = [-1.0,1.0,1.0];
    		this.v5 = [-1.0,-1.0,-1.0];
    		this.v6 = [-1.0,1.0,-1.0];
    		this.v7 = [1.0,1.0,-1.0];
    		this.v8 = [1.0,-1.0,-1.0];
	}
}


