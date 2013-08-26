function GeraCubo() {
	
	var id;
	var x,y,z;
	var corFrente = new Array();
	var corTraz = new Array();
	var corEsq = new Array();
	var corDir = new Array();
	var corCima = new Array();
	var corBaixo = new Array();
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
	var cubeVertexColorBuffer;
	var cubeVertexIndexBuffer;
	
	this.init = function(gl,id,corFrente,corTraz,corEsq,corDir,corCima,corBaixo,px,py,pz) {
		this.gl = gl;
		this.id = id;        	    	    	
    	this.corFrente = corFrente;
		this.corTraz = corTraz;
		this.corEsq = corEsq;
		this.corDir = corDir;
		this.corCima = corCima;
		this.corBaixo = corBaixo;
		this.x = px;
		this.y = py;
		this.z = pz;
		
		this.cubeVertexPositionBuffer = this.gl.createBuffer();
		this.cubeVertexColorBuffer = this.gl.createBuffer();
		this.cubeVertexIndexBuffer = this.gl.createBuffer();
	}
	this.criaCubo = function() {	
		this.geraVertices();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);           	
	    	var vertices = [this.v1[0],this.v1[1],this.v1[2], //Frente
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
				            this.v6[0],this.v6[1],this.v6[2]];
	    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
	    
	    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
	    	var colors = [
		      [this.corFrente[0],this.corFrente[1],this.corFrente[2], 1.0],     // Frente
		      [this.corTraz[0],this.corTraz[1],this.corTraz[2], 1.0],     // Traz
		      [this.corCima[0],this.corCima[1],this.corCima[2], 1.0],     // Cima
		      [this.corBaixo[0],this.corBaixo[1],this.corBaixo[2], 1.0],     // Baixo
		      [this.corDir[0],this.corDir[1],this.corDir[2], 1.0],     //Direita
		      [this.corEsq[0],this.corEsq[1],this.corEsq[2], 1.0],     //Esquerda
		    ];
		    var unpackedColors = [];
		    for (var i in colors) {
		      var color = colors[i];
		      for (var j=0; j < 4; j++) {
		        unpackedColors = unpackedColors.concat(color);
		      }
		    }
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(unpackedColors), this.gl.STATIC_DRAW);
		
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
	        
	        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
	        this.gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 4, this.gl.FLOAT, false, 0, 0);
	        
	        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
	        setMatrixUniforms();
	        this.gl.drawElements(this.gl.TRIANGLES, 36, this.gl.UNSIGNED_SHORT, 0);
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