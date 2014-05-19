function Cube() {
	
	var id;
	var x,y,z;
	var centro;
	var vertices = [];	
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
		this.vertices = [[0.0,0.0,0.0],
						 [0.0,0.0,0.0],   		
						 [0.0,0.0,0.0],
						 [0.0,0.0,0.0],
						 [0.0,0.0,0.0],
						 [0.0,0.0,0.0],
						 [0.0,0.0,0.0],
						 [0.0,0.0,0.0]];
		this.setXYZ();
		
		this.cubeVertexPositionBuffer = this.gl.createBuffer();
		this.cubeVertexTextureCoordBuffer = this.gl.createBuffer();
		this.cubeVertexIndexBuffer = this.gl.createBuffer();
	}
	this.criaCubo = function() {	
	    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);           	
            var facesVertices = [
			this.vertices[0][0],this.vertices[0][1],this.vertices[0][2], //Front
        	this.vertices[1][0],this.vertices[1][1],this.vertices[1][2],
        	this.vertices[2][0],this.vertices[2][1],this.vertices[2][2],
        	this.vertices[3][0],this.vertices[3][1],this.vertices[3][2], 
			
			this.vertices[4][0],this.vertices[4][1],this.vertices[4][2], 
			this.vertices[5][0],this.vertices[5][1],this.vertices[5][2],
			this.vertices[6][0],this.vertices[6][1],this.vertices[6][2],
			this.vertices[7][0],this.vertices[7][1],this.vertices[7][2],
			
			this.vertices[5][0],this.vertices[5][1],this.vertices[5][2],
			this.vertices[3][0],this.vertices[3][1],this.vertices[3][2],
			this.vertices[2][0],this.vertices[2][1],this.vertices[2][2],
			this.vertices[6][0],this.vertices[6][1],this.vertices[6][2],
			
			this.vertices[4][0],this.vertices[4][1],this.vertices[4][2],
			this.vertices[7][0],this.vertices[7][1],this.vertices[7][2],
			this.vertices[1][0],this.vertices[1][1],this.vertices[1][2],
			this.vertices[0][0],this.vertices[0][1],this.vertices[0][2],
			
			this.vertices[7][0],this.vertices[7][1],this.vertices[7][2],
			this.vertices[6][0],this.vertices[6][1],this.vertices[6][2],
			this.vertices[2][0],this.vertices[2][1],this.vertices[2][2],
			this.vertices[1][0],this.vertices[1][1],this.vertices[1][2],
			
			this.vertices[4][0],this.vertices[4][1],this.vertices[4][2],
			this.vertices[0][0],this.vertices[0][1],this.vertices[0][2],
			this.vertices[3][0],this.vertices[3][1],this.vertices[3][2],
			this.vertices[5][0],this.vertices[5][1],this.vertices[5][2]
    	];
	    
    	this.centro = [
  		  	this.vertices[0][0]+this.vertices[1][0]+this.vertices[2][0]+this.vertices[3][0]+this.vertices[4][0]+this.vertices[5][0]+this.vertices[6][0]+this.vertices[7][0],
  		  	this.vertices[0][1]+this.vertices[1][1]+this.vertices[2][1]+this.vertices[3][1]+this.vertices[4][1]+this.vertices[5][1]+this.vertices[6][1]+this.vertices[7][1],
  		  	this.vertices[0][2]+this.vertices[1][2]+this.vertices[2][2]+this.vertices[3][2]+this.vertices[4][2]+this.vertices[5][2]+this.vertices[6][2]+this.vertices[7][2]
  		];
    	
	    this.gl.bufferData(this.gl.ARRAY_BUFFER, 
						   new Float32Array(facesVertices), 
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
		
		
		this.gl.activeTexture(this.gl.TEXTURE0);
		this.gl.bindTexture(this.gl.TEXTURE_2D, textureBlue);
		this.gl.uniform1i(shaderProgram.samplerUniform, 0);
		this.gl.drawElements(this.gl.TRIANGLE_STRIP, 6, this.gl.UNSIGNED_SHORT, 0);			
	
		this.gl.activeTexture(this.gl.TEXTURE1);
		this.gl.bindTexture(this.gl.TEXTURE_2D, textureYellow);
		this.gl.uniform1i(shaderProgram.samplerUniform, 1);
		this.gl.drawElements(this.gl.TRIANGLE_STRIP, 6, this.gl.UNSIGNED_SHORT, 12);			
						
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

	/**
	 * This function will me responsable to calculate the new vertice position after 
	 * the aplication of the rotation matrix on X axis.
	 * @author mccarmo
	 * @param v - vertice, a - angle
	 */
	this.rotateX = function(v,a)
	{
		
		var xref = 0.0; //No need of a reference point for the rotation so we'll be using (0,0,0)
		var yref = 0.0; 
		var zref = 0.0;		
		var x = v[0] - xref;
		var y = v[1] - yref;
		var z = v[2] - zref;
		
		/*|x|   |1    0     0 |
		 *|y| * |0   cos@ sen@|
		 *|z|   |0  -sen@ cos@|		 
		 */
			
		//Rotation Matrix X					
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

	/**
	 * This function will me responsable to calculate the new vertice position after 
	 * the aplication of the rotation matrix on Y axis.
	 * @author mccarmo
	 * @param v - vertice, a - angle
	 */
	this.rotateY = function(v,a)
	{		
		var xref = 0.0; //No need of a reference point for the rotation so we'll be using (0,0,0)
		var yref = 0.0; 
		var zref = 0.0;		
		var x = v[0] - xref;
		var y = v[1] - yref;
		var z = v[2] - zref;
		
		/* |x|   | cos@   0   sin@|
		 * |y| * |  0     1    0  |
		 * |z|   |-sin@   0   cos@|		 
		 */
							
		//Rotation Matrix Y		
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

	/**
	 * This function will me responsable to calculate the new vertice position after 
	 * the aplication of the rotation matrix on Z axis.
	 * @author mccarmo
	 * @param v - vertice, a - angle
	 */
	this.rotateZ = function(v,a)
	{				
		var xref = 0.0; //No need of a reference point for the rotation so we'll be using (0,0,0)
		var yref = 0.0; 
		var zref = 0.0;	
			
		var x = v[0] - xref;
		var y = v[1] - yref;
		var z = v[2] - zref;
		
		/*|x|   |cos@ -sen@ 0|
		 *|y| * |sen@ cos@  0|
		 *|z|   | 0    0    1|		 
		 */
		
		//Rotation Matrix Z			
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

	/**
	 * Rotates the cube on X axis on the passed angle. 
	 * @author mccarmo
	 * @param angle
	 */	
	this.rotateCubeX = function(angulo) {	
		var thisCube = this;
		thisCube.vertices.map(function(currentValue,index){
			thisCube.vertices[index] = thisCube.rotateX(currentValue,angulo)
		});							
	}	

	/**
	 * Rotates the cube on Y axis on the passed angle. 
	 * @author mccarmo
	 * @param angle
	 */
	this.rotateCubeY = function(angle) {
		var thisCube = this;
		thisCube.vertices.map(function(currentValue,index){
			thisCube.vertices[index] = thisCube.rotateY(currentValue,angle)
		});									
	}		
	
	/**
	 * Rotates the cube on Z axis on the passed angle. 
	 * @author mccarmo
	 * @param angle
	 */	
	this.rotateCubeZ = function(angulo) {
		var thisCube = this;
		thisCube.vertices.map(function(currentValue,index){
			thisCube.vertices[index] = thisCube.rotateZ(currentValue,angulo)
		});
	}

	/**
	 * Initializing the cube vertices based on the given 'x,y,z' position.
	 * The Cube will have a size of "0.5" for each face.   
	 * @author mccarmo
	 */
	this.setXYZ = function() {
    	this.vertices[0][0] = -0.5 + this.x;
		this.vertices[0][1] = -0.5 + this.y;
		this.vertices[0][2] =  0.5 + this.z;		
    	
    	this.vertices[1][0] =  0.5 + this.x;    		
    	this.vertices[1][1] = -0.5 + this.y;
    	this.vertices[1][2] =  0.5 + this.z;
    	
    	this.vertices[2][0] =  0.5 + this.x;
    	this.vertices[2][1] =  0.5 + this.y;
    	this.vertices[2][2] =  0.5 + this.z;
    	
    	this.vertices[3][0] = -0.5 + this.x;
    	this.vertices[3][1] =  0.5 + this.y;
    	this.vertices[3][2] =  0.5 + this.z;
    	
    	this.vertices[4][0] = -0.5 + this.x;
    	this.vertices[4][1] = -0.5 + this.y;
    	this.vertices[4][2] = -0.5 + this.z;
    			
    	this.vertices[5][0] = -0.5 + this.x;
    	this.vertices[5][1] =  0.5 + this.y;
    	this.vertices[5][2] = -0.5 + this.z;
    		
    	this.vertices[6][0] =  0.5 + this.x;
    	this.vertices[6][1] =  0.5 + this.y;
    	this.vertices[6][2] = -0.5 + this.z;								
    	
    	this.vertices[7][0] =  0.5 + this.x;
    	this.vertices[7][1] = -0.5 + this.y;
    	this.vertices[7][2] = -0.5 + this.z;
    } 
}

