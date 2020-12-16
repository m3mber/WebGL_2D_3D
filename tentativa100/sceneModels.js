//----------------------------------------------------------------------------
//
//  Constructors
//
function emptyModelFeatures() {

	// EMPTY MODEL

	this.vertices = [];

	this.normals = [];

	// Transformation parameters

	// Displacement vector
	
	this.tx = 0.0;
	
	this.ty = 0.0;
	
	this.tz = 0.0;	
	
	// Rotation angles	
	
	this.rotAngleXX = 0.0;
	
	this.rotAngleYY = 0.0;
	
	this.rotAngleZZ = 0.0;	

	// Scaling factors
	
	this.sx = 1.0;
	
	this.sy = 1.0;
	
	this.sz = 1.0;		
	
	// Animation controls
	
	this.rotXXOn = false;
	
	this.rotYYOn = false;
	
	this.rotZZOn = false;
	
	this.rotXXSpeed = 1.0;
	
	this.rotYYSpeed = 1.0;
	
	this.rotZZSpeed = 1.0;
	
	this.rotXXDir = 1;
	
	this.rotYYDir = 1;
	
	this.rotZZDir = 1;
	
	// Material features
	
	this.kAmbi = [ 0.2, 0.2, 0.2 ];
	
	this.kDiff = [ 0.7, 0.7, 0.7 ];

	this.kSpec = [ 0.7, 0.7, 0.7 ];

	this.nPhong = 10;
}


function orthoFrustumModel( left, right, buttom, top, near, far) {
	
	var frustum = new emptyModelFeatures();
	frustum.vertices = [

		left, buttom,  -near, 
		right,  top,  -near, 
		left,  top,  -near, 
		left, buttom,  -near,
		 right, buttom,  -near, 
		 right,  top,  -near, 
         right, buttom,  -near, 
		 right, buttom, -far, 
		 right,  top, -far, 
         right, buttom,  -near, 
         right,  top, -far, 
         right,  top,  -near, 
        left, buttom, -far, 
       	left,  top, -far,
         right,  top, -far, 
        left, buttom, -far, 
         right,  top, -far, 
         right, buttom, -far, 
        left, buttom, -far, 
		left, buttom,  -near, 
		left,  top, -far, 
		left, buttom,  -near, 
		left,  top,  -near, 
		left,  top, -far, 
		left,  top, -far, 
		left,  top,  -near, 
		 right,  top, -far, 
		left,  top,  -near, 
		 right,  top,  -near, 
		 right,  top, -far, 
		left, buttom,  -near, 
		left, buttom, -far,
		 right, buttom, -far, 
		left, buttom,  -near, 
		 right, buttom, -far, 
		 right, buttom,  -near, 	 
	];

	computeVertexNormals( frustum.vertices, frustum.normals );

	return frustum;
}
function perspectiveFrustumModel( fov, near, far_in ) {
	var far = far_in-2;

	var tan = getTanFromDegrees(fov/2)*(2+far);

	var x = tan;
	var z = x;
	var frustum = new emptyModelFeatures();
	frustum.vertices =[ 
    // Front face
    0.0,  1.0,  0.0,
    -x, -1-far,  z,
    x, -1-far,  z,
    // Right face
    0.0,  1.0,  0.0,
    x, -1-far,  z,
    x, -1-far, -z,
    // Back face
    0.0,  1.0,  0.0,
    x, -1-far, -z,
    -x, -1-far, -z,
    // Left face
    0.0,  1.0,  0.0,
    -x, -1-far, -z,
    -x, -1-far,  z,
    ];

	computeVertexNormals( frustum.vertices, frustum.normals );

	return frustum;
}

function perspectiveSquareModel( fov, near_in, far_in ) {
	var near = near_in;
	var tan = getTanFromDegrees(fov/2) * near_in;
	
	var x = tan;
	y = x;
 	z = near_in - 2;


	var frustumSquare = new emptyModelFeatures();
	frustumSquare.vertices =[ 

    x,  y,  -z,
    -x,  y,  -z,
    -x,  -y,  -z,
    x,  y,  -z,
    x,  -y,  -z,
    -x,  -y,  -z,

   
    ];

	computeVertexNormals( frustumSquare.vertices, frustumSquare.normals );

	return frustumSquare;
}



function singleTriangleModel( ) {
	
	var triangle = new emptyModelFeatures();
	
	// Default model has just ONE TRIANGLE

	triangle.vertices = [

		// FRONTAL TRIANGLE
		 
		-0.5, -0.5,  0.5,
		 
		 0.5, -0.5,  0.5,
		 
		 0.5,  0.5,  0.5,

	];

	triangle.normals = [

		// FRONTAL TRIANGLE
		 
		 0.0,  0.0,  1.0,
		 
		 0.0,  0.0,  1.0,
		 
		 1.0,  0.0,  1.0,
	];

	return triangle;
}


function simpleCubeModel( ) {
	
	var cube = new emptyModelFeatures();
	
	cube.vertices = [

		-1.000000, -1.000000,  1.000000, 
		 1.000000,  1.000000,  1.000000, 
		-1.000000,  1.000000,  1.000000, 
		-1.000000, -1.000000,  1.000000,
		 1.000000, -1.000000,  1.000000, 
		 1.000000,  1.000000,  1.000000, 
         1.000000, -1.000000,  1.000000, 
		 1.000000, -1.000000, -1.000000, 
		 1.000000,  1.000000, -1.000000, 
         1.000000, -1.000000,  1.000000, 
         1.000000,  1.000000, -1.000000, 
         1.000000,  1.000000,  1.000000, 
        -1.000000, -1.000000, -1.000000, 
        -1.000000,  1.000000, -1.000000,
         1.000000,  1.000000, -1.000000, 
        -1.000000, -1.000000, -1.000000, 
         1.000000,  1.000000, -1.000000, 
         1.000000, -1.000000, -1.000000, 
        -1.000000, -1.000000, -1.000000, 
		-1.000000, -1.000000,  1.000000, 
		-1.000000,  1.000000, -1.000000, 
		-1.000000, -1.000000,  1.000000, 
		-1.000000,  1.000000,  1.000000, 
		-1.000000,  1.000000, -1.000000, 
		-1.000000,  1.000000, -1.000000, 
		-1.000000,  1.000000,  1.000000, 
		 1.000000,  1.000000, -1.000000, 
		-1.000000,  1.000000,  1.000000, 
		 1.000000,  1.000000,  1.000000, 
		 1.000000,  1.000000, -1.000000, 
		-1.000000, -1.000000,  1.000000, 
		-1.000000, -1.000000, -1.000000,
		 1.000000, -1.000000, -1.000000, 
		-1.000000, -1.000000,  1.000000, 
		 1.000000, -1.000000, -1.000000, 
		 1.000000, -1.000000,  1.000000, 	 
	];

	computeVertexNormals( cube.vertices, cube.normals );

	return cube;
}


function cubeModel( subdivisionDepth = 0 ) {
	
	var cube = new simpleCubeModel();
	
	midPointRefinement( cube.vertices, subdivisionDepth );
	
	computeVertexNormals( cube.vertices, cube.normals );
	
	return cube;
}


function simpleTetrahedronModel( ) {
	
	var tetra = new emptyModelFeatures();
	
	tetra.vertices = [

		-1.000000,  0.000000, -0.707000, 
         0.000000,  1.000000,  0.707000, 
         1.000000,  0.000000, -0.707000, 
         1.000000,  0.000000, -0.707000, 
         0.000000,  1.000000,  0.707000, 
         0.000000, -1.000000,  0.707000, 
        -1.000000,  0.000000, -0.707000, 
         0.000000, -1.000000,  0.707000, 
         0.000000,  1.000000,  0.707000, 
        -1.000000,  0.000000, -0.707000, 
         1.000000,  0.000000, -0.707000, 
         0.000000, -1.000000,  0.707000,
	];

	computeVertexNormals( tetra.vertices, tetra.normals );

	return tetra;
}


function tetrahedronModel( subdivisionDepth = 0 ) {
	
	var tetra = new simpleTetrahedronModel();
	
	midPointRefinement( tetra.vertices, subdivisionDepth );
	
	computeVertexNormals( tetra.vertices, tetra.normals );
	
	return tetra;
}


function sphereModel( subdivisionDepth = 2 ) {
	
	var sphere = new simpleCubeModel();
	
	midPointRefinement( sphere.vertices, subdivisionDepth );
	
	moveToSphericalSurface( sphere.vertices )
	
	computeVertexNormals( sphere.vertices, sphere.normals );
	
	return sphere;
}





//----------------------------------------------------------------------------
//
//  Instantiating scene models
//

var sceneModels = [];


//Cubo
sceneModels.push( new simpleCubeModel() );

sceneModels[0].tx = -0.6;
sceneModels[0].ty = -0.64;
sceneModels[0].tz = -1.0;

sceneModels[0].sx = 0.25;
sceneModels[0].sy = 0.25;
sceneModels[0].sz = 0.25;


// tetraedro 
sceneModels.push( new simpleTetrahedronModel() );

sceneModels[1].tx = 0.7;
sceneModels[1].ty = -0.3;
sceneModels[1].tz = -1;

sceneModels[1].sx = sceneModels[1].sy = sceneModels[1].sz = 0.4;


// Esfera 
sceneModels.push( new sphereModel( 5 ) );

sceneModels[2].tx = 0;
sceneModels[2].ty = 0;
sceneModels[2].tz = -1.5;

sceneModels[2].sx = sceneModels[2].sy = sceneModels[2].sz = 0.4;


sceneModels.push( new simpleCubeModel( 5 ) );

sceneModels[3].tx = 0;
sceneModels[3].ty = -1;
sceneModels[3].tz = -0.5;

sceneModels[3].sx = 0.9;
sceneModels[3].sy = 0.1
sceneModels[3].sz = 0.9;

sceneModels.push( new sphereModel( 5 ) );

sceneModels[4].tx = 0;
sceneModels[4].ty = 0;
sceneModels[4].tz = 2.0;

sceneModels[4].sx = sceneModels[4].sy = sceneModels[4].sz = 0.05;

