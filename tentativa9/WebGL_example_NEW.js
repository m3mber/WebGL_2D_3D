//------------------------------------------------------------------------
//Variáveis Globais

var gl = null;
var gl_1 = null;

var ort_left = null;
var ort_right = null;
var ort_buttom = null;
var ort_top = null;
var ort_near = null;
var ort_far = null;

var persp_aspect = null;
var persp_near = null; 
var persp_far=null;

var cameraMatrix = mat4();
var cameraMatrix2=mat4();

var shaderProgram = null;
var shaderProgram_1 = null;

var triangleVertexPositionBuffer = null;
var triangleVertexNormalBuffer = null;	

var triangleVertexPositionBuffer_1 = null;
var triangleVertexNormalBuffer_1 = null;	

// The GLOBAL transformation parameters

var globalAngleYY = 0.0;

var globalTz = 0.0;

var	rotateX = 20;
var	rotateY = -30;
var	rotateZ = 0;

// GLOBAL Animation controls

var globalRotationYY_ON = 0;

var globalRotationYY_DIR = 1;

var globalRotationYY_SPEED = 1;

// To allow choosing the way of drawing the model triangles

var primitiveType = null;
var primitiveType_1 = null;
 
// To allow choosing the projection type

var projectionType = 0;

var fieldOfView = 62;

// NEW --- The viewer position

// It has to be updated according to the projection type

var pos_Viewer = [ 0.0, 0.0, 0.0, 1.0 ];


//----------------------------------------------------------------------------
//
// NEW - To count the number of frames per second (fps)
//

var elapsedTime = 0;

var frameCount = 0;

var lastfpsTime = new Date().getTime();;

//----------------------------------------------------------------------------
function countFrames() 
{
	
   var now = new Date().getTime();

   frameCount++;
   
   elapsedTime += (now - lastfpsTime);

   lastfpsTime = now;

   if(elapsedTime >= 1000) {
	   
       fps = frameCount;
       
       frameCount = 0;
       
       elapsedTime -= 1000;
	   
	   document.getElementById('fps').innerHTML = 'fps:' + fps;
   }
}


//----------------------------------------------------------------------------
// The WebGL code
//----------------------------------------------------------------------------
//  Rendering
//  Handling the Vertex Coordinates and the Vertex Normal Vectors
//----------------------------------------------------------------------------


function initBuffers( model ) 
{	
	
	// Vertex Coordinates
		
	triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
	triangleVertexPositionBuffer.itemSize = 3;
	triangleVertexPositionBuffer.numItems =  model.vertices.length / 3;			

	// Associating to the vertex shader
	
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
			triangleVertexPositionBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);
	
	// Vertex Normal Vectors
		
	triangleVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( model.normals), gl.STATIC_DRAW);
	triangleVertexNormalBuffer.itemSize = 3;
	triangleVertexNormalBuffer.numItems = model.normals.length / 3;			

	// Associating to the vertex shader
	
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 
			triangleVertexNormalBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);	
}

function initBuffers_1( model ) 
{
	// Vertex Coordinates	
	triangleVertexPositionBuffer_1 = gl_1.createBuffer();
	gl_1.bindBuffer(gl_1.ARRAY_BUFFER, triangleVertexPositionBuffer_1);
	gl_1.bufferData(gl_1.ARRAY_BUFFER, new Float32Array(model.vertices), gl_1.STATIC_DRAW);
	triangleVertexPositionBuffer_1.itemSize = 3;
	triangleVertexPositionBuffer_1.numItems =  model.vertices.length / 3;			

	// Associating to the vertex shader
	
	gl_1.vertexAttribPointer(shaderProgram_1.vertexPositionAttribute, 
			triangleVertexPositionBuffer_1.itemSize, 
			gl_1.FLOAT, false, 0, 0);
	
	// Vertex Normal Vectors
		
	triangleVertexNormalBuffer_1 = gl_1.createBuffer();
	gl_1.bindBuffer(gl_1.ARRAY_BUFFER, triangleVertexNormalBuffer_1);
	gl_1.bufferData(gl_1.ARRAY_BUFFER, new Float32Array( model.normals), gl_1.STATIC_DRAW);
	triangleVertexNormalBuffer_1.itemSize = 3;
	triangleVertexNormalBuffer_1.numItems = model.normals.length / 3;			

	// Associating to the vertex shader
	
	gl_1.vertexAttribPointer(shaderProgram_1.vertexNormalAttribute, 
			triangleVertexNormalBuffer_1.itemSize, 
			gl_1.FLOAT, false, 0, 0);	
}
//----------------------------------------------------------------------------

//  Drawing the model

function drawModel( model, mvMatrix, primitiveType ) 
{

	// The the global model transformation is an input
	
	// Concatenate with the particular model transformations
	
    // Pay attention to transformation order !!
    
	mvMatrix = mult( mvMatrix, translationMatrix( model.tx, model.ty, model.tz ) );
						 
	mvMatrix = mult( mvMatrix, rotationZZMatrix( model.rotAngleZZ ) );
	
	mvMatrix = mult( mvMatrix, rotationYYMatrix( model.rotAngleYY ) );
	
	mvMatrix = mult( mvMatrix, rotationXXMatrix( model.rotAngleXX ) );
	
	mvMatrix = mult( mvMatrix, scalingMatrix( model.sx, model.sy, model.sz ) );
						 
	// Passing the Model View Matrix to apply the current transformation
	
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));
    
	// Associating the data to the vertex shader
	
	// This can be done in a better way !!

	// Vertex Coordinates and Vertex Normal Vectors
	
	initBuffers(model);
	
	// Material properties
	
	gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_ambient"), 
		flatten(model.kAmbi) );
    
    gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_diffuse"),
        flatten(model.kDiff) );
    
    gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_specular"),
        flatten(model.kSpec) );

	gl.uniform1f( gl.getUniformLocation(shaderProgram, "shininess"), 
		model.nPhong );

    // Light Sources
	
	var numLights = lightSources.length;
	
	gl.uniform1i( gl.getUniformLocation(shaderProgram, "numLights"), 
		numLights );

	//Light Sources
	
	for(var i = 0; i < lightSources.length; i++ )
	{
		gl.uniform1i( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].isOn"),
			lightSources[i].isOn );
    
		gl.uniform4fv( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].position"),
			flatten(lightSources[i].getPosition()) );
    
		gl.uniform3fv( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].intensities"),
			flatten(lightSources[i].getIntensity()) );
    }
        
	// Drawing 
	
	// primitiveType allows drawing as filled triangles / wireframe / vertices
	
	if( primitiveType == gl.LINE_LOOP ) {
		
		// To simulate wireframe drawing!
		
		// No faces are defined! There are no hidden lines!
		
		// Taking the vertices 3 by 3 and drawing a LINE_LOOP
		
		var i;
		
		for( i = 0; i < triangleVertexPositionBuffer.numItems / 3; i++ ) {
		
			gl.drawArrays( primitiveType, 3 * i, 3 ); 
		}
	}	
	else {
				
		gl.drawArrays(primitiveType, 0, triangleVertexPositionBuffer.numItems); 
		
	}	
}

function drawModel_1( model, mvMatrix, primType ) 
{

	// The the global model transformation is an input
	
	// Concatenate with the particular model transformations
	
    // Pay attention to transformation order !!
    
	mvMatrix = mult( mvMatrix, translationMatrix( model.tx, model.ty, model.tz ) );
						 
	mvMatrix = mult( mvMatrix, rotationZZMatrix( model.rotAngleZZ ) );
	
	mvMatrix = mult( mvMatrix, rotationYYMatrix( model.rotAngleYY ) );
	
	mvMatrix = mult( mvMatrix, rotationXXMatrix( model.rotAngleXX) );
	
	mvMatrix = mult( mvMatrix, scalingMatrix( model.sx, model.sy, model.sz ) );
						 
	// Passing the Model View Matrix to apply the current transformation
	
	var mvUniform_1 = gl_1.getUniformLocation(shaderProgram_1, "uMVMatrix");
	
	gl_1.uniformMatrix4fv(mvUniform_1, false, new Float32Array(flatten(mvMatrix)));
    
	// Associating the data to the vertex shader
	
	// This can be done in a better way !!

	// Vertex Coordinates and Vertex Normal Vectors
	
	initBuffers_1(model);
	
	// Material properties
	
	gl_1.uniform3fv( gl_1.getUniformLocation(shaderProgram_1, "k_ambient"), 
		flatten(model.kAmbi) );
    
    gl_1.uniform3fv( gl_1.getUniformLocation(shaderProgram_1, "k_diffuse"),
        flatten(model.kDiff) );
    
    gl_1.uniform3fv( gl_1.getUniformLocation(shaderProgram_1, "k_specular"),
        flatten(model.kSpec) );

	gl_1.uniform1f( gl_1.getUniformLocation(shaderProgram_1, "shininess"), 
		model.nPhong );

    // Light Sources
	
	var numLights_1 = lightSources.length;
	
	gl_1.uniform1i( gl_1.getUniformLocation(shaderProgram_1, "numLights"), 
		numLights_1 );

	//Light Sources
	
	for(var i = 0; i < lightSources.length; i++ )
	{
		gl_1.uniform1i( gl_1.getUniformLocation(shaderProgram_1, "allLights[" + String(i) + "].isOn"),
			lightSources[i].isOn );
    
		gl_1.uniform4fv( gl_1.getUniformLocation(shaderProgram_1, "allLights[" + String(i) + "].position"),
			flatten(lightSources[i].getPosition()) );
    
		gl_1.uniform3fv( gl_1.getUniformLocation(shaderProgram_1, "allLights[" + String(i) + "].intensities"),
			flatten(lightSources[i].getIntensity()) );
    }
        
	
	if( primType == gl_1.LINE_LOOP ) {
		
		var i;
		
		for( i = 0; i < triangleVertexPositionBuffer_1.numItems / 3; i++ ) {
		
			gl_1.drawArrays( primType, 3 * i, 3 ); 
		}
	}	
	else {
				
		gl_1.drawArrays(primType, 0, triangleVertexPositionBuffer_1.numItems); 
		
	}	
}


//----------------------------------------------------------------------------
//  Drawing the 3D scene
//----------------------------------------------------------------------------
function drawScene() 
{
	
	
	// Clearing the frame-buffer and the depth-buffer
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	
	var pMatrix;
	
	var mvMatrix = mat4();
	
	// Clearing the frame-buffer and the depth-buffer
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	// Computing the Projection Matrix
	
	if( projectionType == 0 ) {
		
		// For now, the default orthogonal view volume
		 ort_left = -1.0;
		 ort_right = 1.0;
		 ort_buttom = -1.0;
		 ort_top = 1.0;
		 ort_near = -0.8;
		 ort_far = 1.6;
		pMatrix = ortho( ort_left, ort_right, ort_buttom, ort_top, ort_near, ort_far );
		
		// Global transformation !!
		
		globalTz = -0.0;
		
		// NEW --- The viewer is on the ZZ axis at an indefinite distance
		
		pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[3] = 0.0;
		
		pos_Viewer[2] = 0.0;  
		
		// TO BE DONE !
		;

		// Allow the user to control the size of the view volume
	}
	else {	

		// A standard view volume.
		
		// Viewer is at (0,0,0)
		
		// Ensure that the model is "inside" the view volume
		
		
		persp_near = 0.1;
		persp_far = 5;
		pMatrix = perspective(fieldOfView, 1, persp_near, persp_far );
		
		// Global transformation !!
		
		globalTz = -2.0;

		// NEW --- The viewer is on (0,0,0)
		
		pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[2] = 0.0;
		
		pos_Viewer[3] = 0.0;  
		
		// TO BE DONE !
		
		// Allow the user to control the size of the view volume
	}
	


	// Passing the Projection Matrix to apply the current projection	
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));
	
	// NEW --- Passing the viewer position to the vertex shader
	
	gl.uniform4fv( gl.getUniformLocation(shaderProgram, "viewerPosition"),
        flatten(pos_Viewer));
	
	// GLOBAL TRANSFORMATION FOR THE WHOLE SCENE
	
	mvMatrix = translationMatrix( 0, 0, globalTz );
	cameraMatrix = mvMatrix;
	// NEW - Updating the position of the light sources, if required
	
	// FOR EACH LIGHT SOURCE
	    
	for(var i = 0; i < lightSources.length; i++ )
	{
		// Animating the light source, if defined
		    
		var lightSourceMatrix = mat4();

		if( !lightSources[i].isOff() ) {
				
			// COMPLETE THE CODE FOR THE OTHER ROTATION AXES

			if( lightSources[i].isRotYYOn() ) 
			{
				lightSourceMatrix = mult( 
						lightSourceMatrix, 
						rotationYYMatrix( lightSources[i].getRotAngleYY() ) );
			}
		}
		
		// NEW Passing the Light Souree Matrix to apply
	
		var lsmUniform = gl.getUniformLocation(shaderProgram, "allLights["+ String(i) + "].lightSourceMatrix");
	
		gl.uniformMatrix4fv(lsmUniform, false, new Float32Array(flatten(lightSourceMatrix)));
	}
			
	// Instantianting all scene models
	
	for(var i = 0; i < sceneModels.length; i++ )
	{ 
		drawModel( sceneModels[i],
			   mvMatrix,
	           primitiveType );
	}
	           
	// NEW - Counting the frames
	
	countFrames();

}

function drawScene_1() 
{
	
	var pMatrix;
	
	var mvMatrix = mat4();
	
	// Clearing the frame-buffer and the depth-buffer
	
	gl_1.clear(gl_1.COLOR_BUFFER_BIT | gl_1.DEPTH_BUFFER_BIT);
	
	// Computing the Projection Matrix
	if( projectionType == 0 ) {

		var frustum = new orthoFrustumModel(ort_left, ort_right, ort_buttom, ort_top, ort_near, ort_far );	
		
	}
	else {	

		var frustum = new perspectiveFrustumModel( persp_near, persp_far );
	
	frustum.rotAngleXX = 90;
	frustum.tx = 0.0;
	frustum.ty = 0.0;
	frustum.tz = 1.0; 

	frustum.sx = 1.0; // abertura da lente horizontal
	frustum.sy = 1.0; // comprimento á frente
	frustum.sz = 1.0; // abertura da lente vertical

	//frustum.rotAngleXX = 90;
		
	}


	// A standard view volume.
		
	// Viewer is at (0,0,0)
		
	// Ensure that the model is "inside" the view volume
		
	pMatrix = perspective(fieldOfView, 1, 0.01, 150 );

	// Global transformation !!
		
	globalTz = -5.5;

	// NEW --- The viewer is on (0,0,0)
		
	pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[2] = 0.0;
		
	pos_Viewer[3] = 1.0;  
		
	// TO BE DONE !
		
	// Allow the user to control the size of the view volume

	// Passing the Projection Matrix to apply the current projection	
	var pUniform_1 = gl_1.getUniformLocation(shaderProgram_1, "uPMatrix");
	
	gl_1.uniformMatrix4fv(pUniform_1, false, new Float32Array(flatten(pMatrix)));
	
	// NEW --- Passing the viewer position to the vertex shader
	
	gl_1.uniform4fv( gl_1.getUniformLocation(shaderProgram_1, "viewerPosition"),
        flatten(pos_Viewer));
	
	// GLOBAL TRANSFORMATION FOR THE WHOLE SCENE
	


	
	matrixT = translationMatrix(0, 0, -5.5);
	matrixRotateX = rotationXXMatrix(rotateX);
	matrixRotateY = rotationYYMatrix(rotateY);
	matrixRotateZ = rotationZZMatrix(rotateZ);



	matrix_11 = mult(matrixT, matrixRotateX);
	matrix_12 = mult(matrix_11, matrixRotateY);
	mvMatrix = mult(matrix_12, matrixRotateZ);
	
	cameraMatrix2 = mvMatrix;


	// NEW - Updating the position of the light surces, if required
	
	// FOR EACH LIGHT SOURCE
	    
	for(var i = 0; i < lightSources.length; i++ )
	{
		// Animating the light source, if defined
		    
		var lightSourceMatrix = mat4();

		if( !lightSources[i].isOff() ) {
				
			// COMPLETE THE CODE FOR THE OTHER ROTATION AXES

			if( lightSources[i].isRotYYOn() ) 
			{
				lightSourceMatrix = mult( 
						lightSourceMatrix, 
						rotationYYMatrix( lightSources[i].getRotAngleYY() ) );
			}
		}
		
		// NEW Passing the Light Souree Matrix to apply
	
		var lsmUniform = gl_1.getUniformLocation(shaderProgram_1, "allLights["+ String(i) + "].lightSourceMatrix");
	
		gl_1.uniformMatrix4fv(lsmUniform, false, new Float32Array(flatten(lightSourceMatrix)));
	}
			
	// Instantianting all scene models
	
	for(var i = 0; i < sceneModels.length; i++ )
	{ 
		drawModel_1( sceneModels[i],
			   mvMatrix,
	           primitiveType );
	}

		
	/*var viewMatrix = matrix_invert(cameraMatrix2);
 
    let matx = mult( pMatrix, mvMatrix);
    	matx = mult( matx, cameraMatrix);
*/


	

	var prim_t = gl_1.LINE_LOOP;

	drawModel_1( 	frustum,
			   		mvMatrix,
	           		prim_t );

	// NEW - Counting the frames
	
	countFrames();

}

//----------------------------------------------------------------------------
// Animation --- Updating transformation parameters
//----------------------------------------------------------------------------
var lastTime = 0;

function animate() 
{
	
	var timeNow = new Date().getTime();
	
	if( lastTime != 0 ) {
		
		var elapsed = timeNow - lastTime;
		
		// Global rotation
		
		if( globalRotationYY_ON ) {

			globalAngleYY += globalRotationYY_DIR * globalRotationYY_SPEED * (90 * elapsed) / 1000.0;
	    }

		// For every model --- Local rotations
		
		for(var i = 0; i < sceneModels.length - 2; i++ )
	    {
			if( sceneModels[i].rotXXOn ) {

				sceneModels[i].rotAngleXX += sceneModels[i].rotXXDir * sceneModels[i].rotXXSpeed * (90 * elapsed) / 1000.0;
			}

			if( sceneModels[i].rotYYOn ) {

				sceneModels[i].rotAngleYY += sceneModels[i].rotYYDir * sceneModels[i].rotYYSpeed * (90 * elapsed) / 1000.0;
			}

			if( sceneModels[i].rotZZOn ) {

				sceneModels[i].rotAngleZZ += sceneModels[i].rotZZDir * sceneModels[i].rotZZSpeed * (90 * elapsed) / 1000.0;
			}
		}
		
		// Rotating the light sources
	/*
		for(var i = 0; i < lightSources.length; i++ )
	    {
			if( lightSources[i].isRotYYOn() ) {
				var angle = lightSources[i].getRotAngleYY() + lightSources[i].getRotationSpeed() * (90 * elapsed) / 1000.0;
		
				lightSources[i].setRotAngleYY( angle );
			}
		}*/
}
	
	lastTime = timeNow;
}

//----------------------------------------------------------------------------
// Timer
//----------------------------------------------------------------------------
function tick()
{
	
	requestAnimFrame(tick);
	
	drawScene();

	drawScene_1();
	
	animate();
}


//----------------------------------------------------------------------------
//  User Interaction
//----------------------------------------------------------------------------

function setEventListeners()
{
	
    // Dropdown list
	
	var projection = document.getElementById("projection-selection");
	
	projection.addEventListener("click", function(){
				
		// Getting the selection
		
		var p = projection.selectedIndex;
				
		switch(p){
			
			case 0 : projectionType = 0;
				break;
			
			case 1 : projectionType = 1;
				break;
		}  	
	});  


	// Buttons move right scene   
	document.getElementById("rotate_cc_scene_right_x").onclick = function(){
		rotateX += 5;

	}
	document.getElementById("rotate_c_scene_right_x").onclick = function(){
		rotateX -= 5;

	}
	document.getElementById("rotate_cc_scene_right_y").onclick = function(){
		rotateY += 5;

	}
	document.getElementById("rotate_c_scene_right_y").onclick = function(){
		rotateY -= 5;

	}
	document.getElementById("rotate_cc_scene_right_z").onclick = function(){
		rotateZ += 5;

	}
	document.getElementById("rotate_c_scene_right_z").onclick = function(){
		rotateZ -= 5;

	}	 

	// Buttons move all scenes
	document.getElementById("move_scene_left").onclick = function(){
		sceneModels[0].tx -= .05;
		sceneModels[1].tx -= .05;
		sceneModels[2].tx -= .05;

	}

	document.getElementById("move_scene_right").onclick = function(){
		sceneModels[0].tx += .05;
		sceneModels[1].tx += .05;
		sceneModels[2].tx += .05;

	}

	document.getElementById("move_scene_up").onclick = function(){
		sceneModels[0].ty -= .05;
		sceneModels[1].ty -= .05;
		sceneModels[2].ty -= .05;

	}

	document.getElementById("move_scene_down").onclick = function(){
		sceneModels[0].ty += .05;
		sceneModels[1].ty += .05;
		sceneModels[2].ty += .05;

	}

	
	// Buttons move cube
	document.getElementById("move_cube_left").onclick = function(){
		sceneModels[0].tx -= .05;

	}
	document.getElementById("move_cube_right").onclick = function(){
		sceneModels[0].tx += .05;

	}

	document.getElementById("move_cube_up").onclick = function(){
		sceneModels[0].ty += .05;

	}
	document.getElementById("move_cube_down").onclick = function(){
		sceneModels[0].ty -= .05;

	}

	// Buttons move sphere n1
	document.getElementById("move_sphere1_left").onclick = function(){
		sceneModels[1].tx -= .05;

	}
	document.getElementById("move_sphere1_right").onclick = function(){
		sceneModels[1].tx += .05;

	}

	document.getElementById("move_sphere1_up").onclick = function(){
		sceneModels[1].ty += .05;

	}
	document.getElementById("move_sphere1_down").onclick = function(){
		sceneModels[1].ty -= .05;

	}

	// Buttons move sphere n2
	document.getElementById("move_sphere2_left").onclick = function(){
		sceneModels[2].tx -= .05;

	}
	document.getElementById("move_sphere2_right").onclick = function(){
		sceneModels[2].tx += .05;

	}

	document.getElementById("move_sphere2_up").onclick = function(){
		sceneModels[2].ty += .05;

	}
	document.getElementById("move_sphere2_down").onclick = function(){
		sceneModels[2].ty -= .05;

	}
  
	// Button events
	document.getElementById("field-of-view-near").onclick = function(){
		if (fieldOfView > 15) {
			fieldOfView = fieldOfView - 5;			
		}

	}

	document.getElementById("field-of-view-far").onclick = function(){
		if (fieldOfView < 150) {
			fieldOfView = fieldOfView + 5;			
		}
	}


	document.getElementById("XX-on-off-button").onclick = function(){
		
		// Switching on / off
		
		// For every model
		
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			if( sceneModels[i].rotXXOn ) {

				sceneModels[i].rotXXOn = false;
			}
			else {
				sceneModels[i].rotXXOn = true;
			}	
		}
	};

	document.getElementById("XX-direction-button").onclick = function(){
		
		// Switching the direction
		
		// For every model
		
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			if( sceneModels[i].rotXXDir == 1 ) {

				sceneModels[i].rotXXDir = -1;
			}
			else {
				sceneModels[i].rotXXDir = 1;
			}	
		}
	};      

	document.getElementById("XX-slower-button").onclick = function(){
		
		// For every model
		
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			sceneModels[i].rotXXSpeed *= 0.75; 
		}
	};      

	document.getElementById("XX-faster-button").onclick = function(){
		
		// For every model
		
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			sceneModels[i].rotXXSpeed *= 1.25; 
		}
	};      

	document.getElementById("YY-on-off-button").onclick = function(){
		
		// Switching on / off
		
		// For every model
		
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			if( sceneModels[i].rotYYOn ) {

				sceneModels[i].rotYYOn = false;
			}
			else {
				sceneModels[i].rotYYOn = true;
			}	
		}
	};

	document.getElementById("YY-direction-button").onclick = function(){
		
		// Switching the direction
		
		// For every model
		
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			if( sceneModels[i].rotYYDir == 1 ) {

				sceneModels[i].rotYYDir = -1;
			}
			else {
				sceneModels[i].rotYYDir = 1;
			}	
		}
	};      

	document.getElementById("YY-slower-button").onclick = function(){

		// For every model
		
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			sceneModels[i].rotYYSpeed *= 0.75; 
		}
	};      

	document.getElementById("YY-faster-button").onclick = function(){
		
		// For every model
		
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			sceneModels[i].rotYYSpeed *= 1.25; 
		}
	};      

	document.getElementById("ZZ-on-off-button").onclick = function(){
		
		// Switching on / off
		
		// For every model
		
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			if( sceneModels[i].rotZZOn ) {

				sceneModels[i].rotZZOn = false;
			}
			else {
				sceneModels[i].rotZZOn = true;
			}	
		}
	};

	document.getElementById("ZZ-direction-button").onclick = function(){
		
		// Switching the direction
		
		// For every model
		
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			if( sceneModels[i].rotZZDir == 1 ) {

				sceneModels[i].rotZZDir = -1;
			}
			else {
				sceneModels[i].rotZZDir = 1;
			}	
		}
	};      

	document.getElementById("ZZ-slower-button").onclick = function(){
		
		// For every model
		
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			sceneModels[i].rotZZSpeed *= 0.75; 
		}
	};      

	document.getElementById("ZZ-faster-button").onclick = function(){
		
		// For every model
		
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			sceneModels[i].rotZZSpeed *= 1.25; 
		}
	};      
}


//----------------------------------------------------------------------------
// WebGL Initialization
//----------------------------------------------------------------------------

function initWebGL( canvas ) 
{
	try {
		
		// Create the WebGL context
		
		// Some browsers still need "experimental-webgl"
		
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		
		// DEFAULT: The viewport occupies the whole canvas 
		
		// DEFAULT: The viewport background color is WHITE
		
		// NEW - Drawing the triangles defining the model
		
		primitiveType = gl.TRIANGLES;
		
		// DEFAULT: Face culling is DISABLED
		
		// Enable FACE CULLING
		
		gl.enable( gl.CULL_FACE );

		gl.clearColor(0.0, 0.5, 0.7, 1.0);
		
		// DEFAULT: The BACK FACE is culled!!
		
		// The next instruction is not needed...
		
		gl.cullFace( gl.BACK );
		
		// Enable DEPTH-TEST
		
		gl.enable( gl.DEPTH_TEST );
        
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry! :-(");
	}        
}

function initWebGL_1( canvas ) 
{
	try {
		
		// Create the WebGL context
		
		// Some browsers still need "experimental-webgl"
		
		gl_1 = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		
		// DEFAULT: The viewport occupies the whole canvas 
		
		// DEFAULT: The viewport background color is WHITE
		
		// NEW - Drawing the triangles defining the model
		
		primitiveType_1 = gl_1.TRIANGLES;
		
		// DEFAULT: Face culling is DISABLED
		
		// Enable FACE CULLING
		
		gl_1.enable( gl_1.CULL_FACE );

		gl_1.clearColor(0.5, 0.5, 0.7, 1.0);
		
		// DEFAULT: The BACK FACE is culled!!
		
		// The next instruction is not needed...
		
		gl_1.cullFace( gl_1.BACK );
		
		// Enable DEPTH-TEST
		
		gl_1.enable( gl_1.DEPTH_TEST );
        
	} catch (e) {
	}
	if (!gl_1) {
		alert("Could not initialise WebGL, sorry! :-(");
	}        
}

//----------------------------------------------------------------------------

function runWebGL() {
	
	var canvas = document.getElementById("canvas_left");
	initWebGL( canvas );
	shaderProgram = initShaders( gl );

	var canvas_1 = document.getElementById("canvas_right");
	initWebGL_1 (canvas_1);
	shaderProgram_1 = initShaders( gl_1 );

	
	setEventListeners();
	
	tick();		// A timer controls the rendering / animation    

}
