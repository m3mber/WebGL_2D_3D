//------------------------------------------------------------------------
//Variáveis Globais

var gl = null;
var gl_1 = null;

var ort_left = null;
var ort_right = null;
var ort_buttom = null;
var ort_top = null;
var ort_near = -0.7;
var ort_far = 1.6;

var persp_aspect = null;
var persp_near = 1.0; 
var persp_far = 4;

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
var	rotateY = 30;
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

var fieldOfView = 60;
var fieldOfView_right = 60;
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
    
	mvMatrix = mult( mvMatrix, translationMatrix( model.tx, model.ty, model.tz ) );
						 
	mvMatrix = mult( mvMatrix, rotationZZMatrix( model.rotAngleZZ ) );
	
	mvMatrix = mult( mvMatrix, rotationYYMatrix( model.rotAngleYY ) );
	
	mvMatrix = mult( mvMatrix, rotationXXMatrix( model.rotAngleXX ) );
	
	mvMatrix = mult( mvMatrix, scalingMatrix( model.sx, model.sy, model.sz ) );
						 	
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));
    	
	initBuffers(model);
		
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
		
	if( primitiveType == gl.LINE_LOOP ) {
		

		
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
    
	mvMatrix = mult( mvMatrix, translationMatrix( model.tx, model.ty, model.tz ) );
						 
	mvMatrix = mult( mvMatrix, rotationZZMatrix( model.rotAngleZZ ) );
	
	mvMatrix = mult( mvMatrix, rotationYYMatrix( model.rotAngleYY ) );
	
	mvMatrix = mult( mvMatrix, rotationXXMatrix( model.rotAngleXX) );
	
	mvMatrix = mult( mvMatrix, scalingMatrix( model.sx, model.sy, model.sz ) );
						 	
	var mvUniform_1 = gl_1.getUniformLocation(shaderProgram_1, "uMVMatrix");
	
	gl_1.uniformMatrix4fv(mvUniform_1, false, new Float32Array(flatten(mvMatrix)));
    
	
	initBuffers_1(model);
	
	
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
		 ort_left = -1.0;
		 ort_right = 1.0;
		 ort_buttom = -1.0;
		 ort_top = 1.0;
		 
		pMatrix = ortho( ort_left, ort_right, ort_buttom, ort_top, ort_near, ort_far );
		
		globalTz = -0.0;
			
		pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[3] = 0.0;
		
		pos_Viewer[2] = 0.0;  
		
	}
	else {	

		pMatrix = perspective(fieldOfView, 1, persp_near, persp_far );

		
		globalTz = -2.0;

		
		pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[2] = 0.0;
		
		pos_Viewer[3] = 0.0;  

	}
	
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));
		
	gl.uniform4fv( gl.getUniformLocation(shaderProgram, "viewerPosition"),
        flatten(pos_Viewer));	
	
	mvMatrix = translationMatrix( 0, 0, globalTz );

	cameraMatrix = mvMatrix;
	    
	for(var i = 0; i < lightSources.length; i++ )
	{
		    
		var lightSourceMatrix = mat4();

		if( !lightSources[i].isOff() ) {
				
			if( lightSources[i].isRotYYOn() ) 
			{
				lightSourceMatrix = mult( 
						lightSourceMatrix, 
						rotationYYMatrix( lightSources[i].getRotAngleYY() ) );
			}
			if( lightSources[i].isRotXXOn() ) 
			{
				lightSourceMatrix = mult( 
						lightSourceMatrix, 
						rotationXXMatrix( lightSources[i].getRotAngleXX() ) );
			}
			if( lightSources[i].isRotZZOn() ) 
			{
				lightSourceMatrix = mult( 
						lightSourceMatrix, 
						rotationZZMatrix( lightSources[i].getRotAngleZZ() ) );
			}
		}
			
		var lsmUniform = gl.getUniformLocation(shaderProgram, "allLights["+ String(i) + "].lightSourceMatrix");
	
		gl.uniformMatrix4fv(lsmUniform, false, new Float32Array(flatten(lightSourceMatrix)));
	}
				
	for(var i = 0; i < sceneModels.length; i++ )
	{ 
		drawModel( sceneModels[i],
			   mvMatrix,
	           primitiveType );
	}
	           	
	countFrames();

}

function drawScene_1() 
{
	
	var pMatrix;
	
	var mvMatrix = mat4();
	
	
	gl_1.clear(gl_1.COLOR_BUFFER_BIT | gl_1.DEPTH_BUFFER_BIT);
	
	if( projectionType == 0 ) {

		var frustum = new orthoFrustumModel(ort_left, ort_right, ort_buttom, ort_top, ort_near, ort_far );	
		
	}
	else {	

		var frustum = new perspectiveFrustumModel( fieldOfView, persp_near, persp_far);
		
		frustum.rotAngleXX = 90;
		frustum.tx = 0.0;
		frustum.ty = 0.0;
		frustum.tz = 1.0; 

		frustum.sx = 1.0; 
		frustum.sy = 1.0; 
		frustum.sz = 1.0; 

		//frustum.rotAngleXX = 90;

		var frustumSquare = new perspectiveSquareModel( fieldOfView, persp_near, persp_far );
		frustumSquare.tx = 0.0;
		frustumSquare.ty = 0.0;
		frustumSquare.tz = 0.0; 

		frustumSquare.sx = 1.0; 
		frustumSquare.sy = 1.0; 
		frustumSquare.sz = 1.0; 	
	}

	
	
	pMatrix = perspective(fieldOfView_right, 1, 0.01, 150 );
		
	globalTz = -5.5;

		
	pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[2] = 0.0;
		
	pos_Viewer[3] = 1.0;  
			
	var pUniform_1 = gl_1.getUniformLocation(shaderProgram_1, "uPMatrix");
	
	gl_1.uniformMatrix4fv(pUniform_1, false, new Float32Array(flatten(pMatrix)));
	
	
	gl_1.uniform4fv( gl_1.getUniformLocation(shaderProgram_1, "viewerPosition"),
        flatten(pos_Viewer));
	
	
	matrixT = translationMatrix(0, 0, -5.5);
	matrixRotateX = rotationXXMatrix(rotateX);
	matrixRotateY = rotationYYMatrix(rotateY);
	matrixRotateZ = rotationZZMatrix(rotateZ);



	matrix_11 = mult(matrixT, matrixRotateX);
	matrix_12 = mult(matrix_11, matrixRotateY);
	mvMatrix = mult(matrix_12, matrixRotateZ);
	
	cameraMatrix2 = mvMatrix;

	    
	for(var i = 0; i < lightSources.length; i++ )
	{
		    
		var lightSourceMatrix = mat4();

		if( !lightSources[i].isOff() ) {
				
			if( lightSources[i].isRotYYOn() ) 
			{
				lightSourceMatrix = mult( 
						mvMatrix, 
						rotationYYMatrix( lightSources[i].getRotAngleYY() ) );
			}
			if( lightSources[i].isRotXXOn() ) 
			{
				lightSourceMatrix = mult( 
						lightSourceMatrix, 
						rotationXXMatrix( lightSources[i].getRotAngleXX() ) );
			}
			if( lightSources[i].isRotZZOn() ) 
			{
				lightSourceMatrix = mult( 
						lightSourceMatrix, 
						rotationZZMatrix( lightSources[i].getRotAngleZZ() ) );
			}
		}
			
		var lsmUniform = gl_1.getUniformLocation(shaderProgram_1, "allLights["+ String(i) + "].lightSourceMatrix");
	
		gl_1.uniformMatrix4fv(lsmUniform, false, new Float32Array(flatten(lightSourceMatrix)));
	}
				
	for(var i = 0; i < sceneModels.length; i++ )
	{ 
		drawModel_1( sceneModels[i],
			   mvMatrix,
	           primitiveType );
	}


	var prim_t = gl_1.LINE_LOOP;

	drawModel_1( 	frustum,
			   		mvMatrix,
	           		prim_t );

	if (projectionType != 0)
	{
		drawModel_1( 	frustumSquare,
				   		mvMatrix,
		           		prim_t );		
	}

	
	countFrames();

}

//----------------------------------------------------------------------------
// Animation --- Updating transformation parameters
//----------------------------------------------------------------------------
var lastTime = 0;

function animate() 
{
	
	var timeNow = new Date().getTime();
	
	if( lastTime != 0 ) 
	{
		
		var elapsed = timeNow - lastTime;
				
		if( globalRotationYY_ON ) {

			globalAngleYY += globalRotationYY_DIR * globalRotationYY_SPEED * (90 * elapsed) / 1000.0;
	    }
		
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
						
		var p = projection.selectedIndex;
				
		switch(p){
			
			case 0 : projectionType = 0;
				break;
			
			case 1 : projectionType = 1;
				break;
		}  	
	});  

	var slider_x = document.getElementById("rotate_scene_right_x");
		rotateX = slider_x.value;
		slider_x.oninput = function() {
			rotateX = slider_x.value;
		}

	var slider_y = document.getElementById("rotate_scene_right_y");
		rotateY = slider_y.value;
		slider_y.oninput = function() {
			rotateY = slider_y.value;
		}

	var slider_z = document.getElementById("rotate_scene_right_z");
		rotateZ = slider_z.value;
		slider_z.oninput = function() {
			rotateZ = slider_z.value;
		}

	var slider_zoom_right = document.getElementById("scene_right_zoom");
		slider_zoom_right.oninput = function() {
			fieldOfView_right = slider_zoom_right.value;
		}

	
	document.getElementById("far_further").onclick = function(){
		persp_far += 0.25;
		ort_far += 0.25;
	}
	document.getElementById("far_closer").onclick = function(){
		if (persp_far > 1.0){
			persp_far -= 0.25;
			ort_far -= 0.25;
		}
	}

	document.getElementById("front_plane_far").onclick = function(){		
		persp_near += 0.15;
		ort_near += 0.10;

	}
	document.getElementById("front_plane_closer").onclick = function(){
		if (persp_near > 1.0) {
			persp_near -= 0.15;
			ort_near -= 0.10;
		}
	}	

	var slider_scene_lr = document.getElementById("move_scene_left_right");
		slider_scene_lr.oninput = function() {
			sceneModels[0].tx = slider_scene_lr.value / 100 + 0.0;
			sceneModels[1].tx = slider_scene_lr.value / 100 + 1.5;
			sceneModels[2].tx = slider_scene_lr.value / 100 + 0.5;
		}

	var slider_scene_ud = document.getElementById("move_scene_up_down");
		slider_scene_ud.oninput = function() {
			sceneModels[0].ty = slider_scene_ud.value / 100 - 0.3;
			sceneModels[1].ty = slider_scene_ud.value / 100 + 0.5;
			sceneModels[2].ty = slider_scene_ud.value / 100 + 0.0;
		}


	var slider_cube_lr = document.getElementById("cube_left_right");
		slider_cube_lr.oninput = function() {
			
			sceneModels[0].tx = slider_cube_lr.value / 100;
		}

	var slider_cube_ud = document.getElementById("cube_up_down");
		slider_cube_ud.oninput = function() {
			
			sceneModels[0].ty = slider_cube_ud.value / 100 - 0.3;
		}

	var slider_cube_io = document.getElementById("cube_in_out");
		slider_cube_io.oninput = function() {
			
			sceneModels[0].tz = slider_cube_io.value / 100 - 3.0;
		}


	var slider_sphere1_lr = document.getElementById("sphere1_left_right");
		slider_sphere1_lr.oninput = function() {
			
			sceneModels[1].tx = slider_sphere1_lr.value / 100 + 1.5;
		}

	var slider_sphere1_ud = document.getElementById("sphere1_up_down");
		slider_sphere1_ud.oninput = function() {
			
			sceneModels[1].ty = slider_sphere1_ud.value / 100 + 0.5;
		}

	var slider_sphere1_io = document.getElementById("sphere1_in_out");
		slider_sphere1_io.oninput = function() {
			
			sceneModels[1].tz = slider_sphere1_io.value / 100 -1.9;
		}

	var slider_sphere2_lr = document.getElementById("sphere2_left_right");
		slider_sphere2_lr.oninput = function() {
			
			sceneModels[2].tx = slider_sphere2_lr.value / 100 + 0.5;
		}

	var slider_sphere2_ud = document.getElementById("sphere2_up_down");
		slider_sphere2_ud.oninput = function() {
			
			sceneModels[2].ty = slider_sphere2_ud.value / 100 + 0.0;
		}

	var slider_sphere2_io = document.getElementById("sphere2_in_out");
		slider_sphere2_io.oninput = function() {
			
			sceneModels[2].tz = slider_sphere2_io.value / 100 -1.0;
		}

	  

	var slider_fov = document.getElementById("scene_fov");
		slider_fov.oninput = function() {
			fieldOfView = slider_fov.value;
		}



	document.getElementById("XX-on-off-button").onclick = function(){		
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
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			sceneModels[i].rotXXSpeed *= 0.75; 
		}
	};      

	document.getElementById("XX-faster-button").onclick = function(){		
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			sceneModels[i].rotXXSpeed *= 1.25; 
		}
	};      

	document.getElementById("YY-on-off-button").onclick = function(){		
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
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			sceneModels[i].rotYYSpeed *= 0.75; 
		}
	};      

	document.getElementById("YY-faster-button").onclick = function(){
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			sceneModels[i].rotYYSpeed *= 1.25; 
		}
	};      

	document.getElementById("ZZ-on-off-button").onclick = function(){
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
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			sceneModels[i].rotZZSpeed *= 0.75; 
		}
	};      

	document.getElementById("ZZ-faster-button").onclick = function(){		
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			sceneModels[i].rotZZSpeed *= 1.25; 
		}
	};
	document.getElementById("light_left").onclick = function(){		
		var pos = lightSources[0].getPosition();
		if( pos[0] > -15 ){
			lightSources[0].setPosition(pos[0]-1,pos[1],pos[2],pos[3]);
		}
	};
	document.getElementById("light_right").onclick = function(){		
		var pos = lightSources[0].getPosition();
		if( pos[0] < 15 ){
			lightSources[0].setPosition(pos[0]+1,pos[1],pos[2],pos[3]);
		}
	};
	document.getElementById("light_up").onclick = function(){		
		var pos = lightSources[0].getPosition();
		if( pos[1] > -15 ){
			lightSources[0].setPosition(pos[0],pos[1]+1,pos[2],pos[3]);
		}
	};
	document.getElementById("light_down").onclick = function(){		
		var pos = lightSources[0].getPosition();
		if( pos[1] < 15 ){
			lightSources[0].setPosition(pos[0],pos[1]-1,pos[2],pos[3]);
		}
	};
	document.getElementById("light_closer").onclick = function(){		
		var pos = lightSources[0].getPosition();
		if( pos[2] < 10 ){
			lightSources[0].setPosition(pos[0],pos[1],pos[2]+0.3,pos[3]);
		}
	};
	document.getElementById("light_further").onclick = function(){		
		var pos = lightSources[0].getPosition();
		if( pos[1] > -7 ){
			lightSources[0].setPosition(pos[0],pos[1],pos[2]-0.3,pos[3]);
		}
	};
	document.getElementById("light_mred").onclick = function(){
		var i = lightSources[0].getIntensity();
		if( i[0] < 1 ){			lightSources[0].setIntensity(i[0]+0.1,i[1],i[2]);		}
	};
	document.getElementById("light_lred").onclick = function(){
		var i = lightSources[0].getIntensity();
		if( i[0] > 0 ){			lightSources[0].setIntensity(i[0]-0.1,i[1],i[2]);		}
	};
	document.getElementById("light_mgreen").onclick = function(){
		var i = lightSources[0].getIntensity();
		if( i[1] < 1 ){			lightSources[0].setIntensity(i[0],i[1]+0.1,i[2]);		}
	};
	document.getElementById("light_lgreen").onclick = function(){
		var i = lightSources[0].getIntensity();
		if( i[1] > 0 ){			lightSources[0].setIntensity(i[0],i[1]-0.1,i[2]);		}
	};
	document.getElementById("light_mblue").onclick = function(){
		var i = lightSources[0].getIntensity();
		if( i[2] < 1 ){			lightSources[0].setIntensity(i[0],i[1],i[2]+0.1);		}
	};
	document.getElementById("light_lblue").onclick = function(){
		var i = lightSources[0].getIntensity();
		if( i[2] > 0 ){			lightSources[0].setIntensity(i[0],i[1],i[2]-0.1);		}
	};
      
}


//----------------------------------------------------------------------------
// WebGL Initialization
//----------------------------------------------------------------------------

function initWebGL( canvas ) 
{
	try {

		
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

		
		primitiveType = gl.TRIANGLES;		
		
		gl.enable( gl.CULL_FACE );

		gl.clearColor(0.0, 0.5, 0.7, 1.0);		
		
		gl.cullFace( gl.BACK );
				
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
		
		gl_1 = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
				
		primitiveType_1 = gl_1.TRIANGLES;
				
		gl_1.enable( gl_1.CULL_FACE );

		gl_1.clearColor(0.5, 0.5, 0.7, 1.0);
				
		gl_1.cullFace( gl_1.BACK );

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
	
	tick();	

}
