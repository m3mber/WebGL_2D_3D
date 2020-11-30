
var gl = null;
var gl_2 = null;

var shaderProgram = null;
var triangleVertexPositionBuffer = null;
var triangleVertexColorBuffer = null;


// Vetor de transformação
var tx = 0.0;
var ty = 0.0;
var tz = 0.0;

//Rotação
var angleXX = 0.0;
var angleYY = 0.0;
var angleZZ = 0.0;

//Escala
var sx = 1.0;
var sy = 1.0;
var sz = 1.0;

var primitiveType = null;

var vertices = [

		// FRONT FACE
		 
		-0.25, -0.25,  0.25,		 
		 0.25, -0.25,  0.25,		 
		 0.25,  0.25,  0.25,

		 
		 0.25,  0.25,  0.25,		 
		-0.25,  0.25,  0.25,		 
		-0.25, -0.25,  0.25,
		
		// TOP FACE
		
		-0.25,  0.25,  0.25,		 
		 0.25,  0.25,  0.25,		 
		 0.25,  0.25, -0.25,

		 
		 0.25,  0.25, -0.25,		 
		-0.25,  0.25, -0.25,		 
		-0.25,  0.25,  0.25,
		
		// BOTTOM FACE 
		
		-0.25, -0.25, -0.25,		 
		 0.25, -0.25, -0.25,		 
		 0.25, -0.25,  0.25,

		 
		 0.25, -0.25,  0.25,		 
		-0.25, -0.25,  0.25,		 
		-0.25, -0.25, -0.25,
		
		// LEFT FACE 
		
		-0.25,  0.25,  0.25,		 
		-0.25, -0.25, -0.25,
		-0.25, -0.25,  0.25,
		 
		 
		-0.25,  0.25,  0.25,		 
		-0.25,  0.25, -0.25,		 
		-0.25, -0.25, -0.25,
		
		// RIGHT FACE 
		
		 0.25,  0.25, -0.25,		 
		 0.25, -0.25,  0.25,
		 0.25, -0.25, -0.25,
		 
		 
		 0.25,  0.25, -0.25,		 
		 0.25,  0.25,  0.25,		 
		 0.25, -0.25,  0.25,
		
		// BACK FACE 
		
		-0.25,  0.25, -0.25,		 
		 0.25, -0.25, -0.25,
		-0.25, -0.25, -0.25,
		 
		 
		-0.25,  0.25, -0.25,		 
		 0.25,  0.25, -0.25,		 
		 0.25, -0.25, -0.25,			 
];

var colors = [

		 // FRONT FACE		 	
		 0.80,  0.00,  0.00,		 
		 0.80,  0.00,  0.00,		 
		 0.80,  0.00,  0.00,

		 	
		 0.80,  0.00,  0.00,		 
		 0.80,  0.00,  0.00,		 
		 0.80,  0.00,  0.00,
		 			 
		 // TOP FACE		 	
		 0.10,  0.80,  0.50,		 
		 0.10,  0.80,  0.50,		 
		 0.10,  0.80,  0.50,

		 	
		 0.10,  0.80,  0.50,		 
		 0.10,  0.80,  0.50,		 
		 0.10,  0.80,  0.50,
		 			 
		 // BOTTOM FACE		 	
		 0.00,  0.80,  0.00,		 
		 0.00,  0.80,  0.00,		 
		 0.00,  0.80,  0.00,

		 	
		 0.00,  0.80,  0.00,		 
		 0.00,  0.80,  0.00,		 
		 0.00,  0.80,  0.00,
		 			 
		 // LEFT FACE		 	
		 0.00,  0.00,  0.80,		 
		 0.00,  0.00,  0.80,		 
		 0.00,  0.00,  0.80,
		 	
		 0.00,  0.00,  0.80,		 
		 0.00,  0.00,  0.80,		 
		 0.00,  0.00,  0.80,
		 			 
		 // RIGHT FACE		 	
		 0.25,  0.30,  0.90,		 
		 0.25,  0.30,  0.90,		 
		 0.25,  0.30,  0.90,
		 	
		 0.25,  0.30,  0.90,		 
		 0.25,  0.30,  0.90,		 
		 0.25,  0.30,  0.90,
		 			 
		 			 
		 // BACK FACE		 	
		 0.25,  0.00,  0.25,		 
		 0.25,  0.00,  0.25,		 
		 0.25,  0.00,  0.25,
		 	
		 0.25,  0.00,  0.25,		 
		 0.25,  0.00,  0.25,		 
		 0.25,  0.00,  0.25,			 			 
];



function initBuffers()
{

	// Coordinates
		
	triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	triangleVertexPositionBuffer.itemSize = 3;
	triangleVertexPositionBuffer.numItems = vertices.length / 3;			

	// Associating to the vertex shader
	
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
			triangleVertexPositionBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);
	
	// Colors
		
	triangleVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	triangleVertexColorBuffer.itemSize = 3;
	triangleVertexColorBuffer.numItems = colors.length / 3;			

	// Associating to the vertex shader
	
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
			triangleVertexColorBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);
}


function drawScene() {
		
	
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl_2.clear(gl.COLOR_BUFFER_BIT);

	// Computing the Model-View Matrix	
	var mvMatrix = mult( rotationZZMatrix( angleZZ ), 	
						 scalingMatrix( sx, sy, sz ) );
						 
	
	mvMatrix = mult( rotationYYMatrix( angleYY ), mvMatrix );						 
	mvMatrix = mult( rotationXXMatrix( angleXX ), mvMatrix );
	mvMatrix = mult( translationMatrix( tx, ty, tz ), mvMatrix );
						 

	// Passing the Model View Matrix to apply the current transformation	
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));
	

	// Drawing the contents of the vertex buffer
	if( primitiveType == gl.LINE_LOOP ) { 
		
		// For each triangle (number of triangles is triangleVertexPositionBuffer.numItems / 3)
		for (var i = 0; i < triangleVertexPositionBuffer.numItems / 3; i++) {
			// Taking the vertices 3 by 3 and drawing a LINE_LOOP
			// "Sliding window"
			gl.drawArrays(primitiveType, 3 * i, triangleVertexPositionBuffer.numItems);
		}
	
	}	
	else {
		gl.drawArrays(primitiveType, 0, triangleVertexPositionBuffer.numItems); 
	}       
}


function setEventListeners(){
	
	
	document.getElementById("move_left").onclick = function(){
		
		// Updating
		tx -= 0.25;
		
		// Render the viewport
		
		drawScene();  
	};

	document.getElementById("move_right").onclick = function(){
		
		// Updating
		
		tx += 0.25;
						
		// Render the viewport
		
		drawScene();  
	};      

	document.getElementById("move_up").onclick = function(){
		
		// Updating
		
		ty += 0.25;
						
		// Render the viewport
		
		drawScene();  
	};      

	document.getElementById("move_down").onclick = function(){
		
		// Updating
		
		ty -= 0.25;
		
		// Render the viewport
		
		drawScene();  
	};      

	document.getElementById("scale_up").onclick = function(){
		
		// Updating
		
		sx *= 1.1;
		
		sy *= 1.1;
		
		sz *= 1.1;
		
		// Render the viewport
		
		drawScene();  
	};      

	document.getElementById("scale_down").onclick = function(){
		
		// Updating
		
		sx *= 0.9;
		
		sy *= 0.9;
		
		sz *= 0.9;
		
		// Render the viewport
		
		drawScene();  
	};      

	document.getElementById("XX_rotate_CW").onclick = function(){
		
		// Updating
		
		angleXX -= 15.0;
		
		// Render the viewport
		
		drawScene();  
	};      

	document.getElementById("XX_rotate_CCW").onclick = function(){
		
		// Updating
		
		angleXX += 15.0;
		
		// Render the viewport
		
		drawScene();  
	};      

	document.getElementById("YY_rotate_CW").onclick = function(){
		
		// Updating
		
		angleYY -= 15.0;
		
		// Render the viewport
		
		drawScene();  
	};      

	document.getElementById("YY_rotate_CCW").onclick = function(){
		
		// Updating
		
		angleYY += 15.0;
		
		// Render the viewport
		
		drawScene();  
	};      

	document.getElementById("ZZ_rotate_CW").onclick = function(){
		
		// Updating
		
		angleZZ -= 15.0;
		
		// Render the viewport
		
		drawScene();  
	};      

	document.getElementById("ZZ_rotate_CCW").onclick = function(){
		
		// Updating
		
		angleZZ += 15.0;
		
		// Render the viewport
		
		drawScene();  
	};      

	document.getElementById("default").onclick = function(){
		
		// The initial values

		tx = 0.0;

		ty = 0.0;

		tz = 0.0;

		angleXX = 0.0;

		angleYY = 0.0;

		angleZZ = 0.0;

		sx = 1.0;

		sy = 1.0;

		sz = 1.0;
		
		// Render the viewport
		
		drawScene();  
	};      

	document.getElementById("face_culling").onclick = function(){
		
		if( gl.isEnabled( gl.CULL_FACE ) )
		{
			gl.disable( gl.CULL_FACE );
		}
		else
		{
			gl.enable( gl.CULL_FACE );
		}
		
		// Render the viewport
		
		drawScene();  
	};      
}


function initWebGL( canvas ) {
	try {
		
		// Create the WebGL context		
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		
		primitiveType = gl.TRIANGLES;

		
		// Enable FACE CULLING		
		gl.enable( gl.CULL_FACE );
		
		// DEFAULT: The BACK FACE is culled!!
		
		// The next instruction is not needed...		
		gl.cullFace( gl.BACK );

		gl.clearColor(0.0, 0.5, 0.7, 1.0);
		
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry! :-(");
	}        
}
function initWebGL_2( canvas ) {
	try {
		
		// Create the WebGL context		
		gl_2 = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		
		primitiveType = gl_2.TRIANGLES;

		
		// Enable FACE CULLING		
		gl_2.enable( gl_2.CULL_FACE );
		
		// DEFAULT: The BACK FACE is culled!!
		
		// The next instruction is not needed...		
		gl_2.cullFace( gl_2.BACK );

		gl_2.clearColor(0.0, 0.5, 0.7, 1.0);
		
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry! :-(");
	}        
}

function runWebGL() {
	
	var canvas_1 = document.getElementById("viewport_1");
	var canvas_2 = document.getElementById("viewport_2");
	
	initWebGL( canvas_1 );
	initWebGL_2( canvas_2 );

	shaderProgram = initShaders( gl );
	
	setEventListeners();
	
	initBuffers();
	
	drawScene();    
}