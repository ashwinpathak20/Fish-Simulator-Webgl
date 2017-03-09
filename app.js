var gl;
var salmon,goldfish;


function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}
var fruits = ["_________________________________________________________________________________________________________________________________________________________________________________"];
document.getElementById("demo").innerHTML = fruits;

function myFunction() {
    fruits.sort();
    document.getElementById("demo").innerHTML = fruits;
}
var InitDemo = function () {
	loadTextResource('./shader.vs.glsl', function (vsErr, vsText) {
		if (vsErr) {
			alert('Fatal error getting vertex shader (see console)');
			console.error(vsErr);
		} else {
			loadTextResource('./shader.fs.glsl', function (fsErr, fsText) {
				if (fsErr) {
					alert('Fatal error getting fragment shader (see console)');
					console.error(fsErr);
				} else {
					loadJSONResource('./Susan.json', function (modelErr, modelObj) {
						if (modelErr) {
							alert('Fatal error getting Susan model (see console)');
							console.error(fsErr);
						} else {
							loadJSONResource('./TUNA.json', function (modelError, modelObject) {
								if (modelError) {
									alert('Fatal error getting Susan model (see console)');
									console.error(fsErr);
								} else {
								loadImage('./goldfish.png', function (imgErr, img) {
								if (imgErr) {
									alert('Fatal error getting Susan texture (see console)');
									console.error(imgErr);
								} else {

									RunDemo(vsText, fsText, img, modelObj,modelObject);
								}
							});

						}

					});
				}
			});
		}
	});

}
	});
};
 function drawScene() {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        if (teapotVertexPositionBuffer == null || teapotVertexNormalBuffer == null || teapotVertexTextureCoordBuffer == null || teapotVertexIndexBuffer == null) {
            return;
        }

        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
        mat4.identity(mvMatrix);
        var specularHighlights = document.getElementById("specular").checked;
        gl.uniform1i(shaderProgram.showSpecularHighlightsUniform, specularHighlights);

        var lighting = document.getElementById("lighting").checked;
        gl.uniform1i(shaderProgram.useLightingUniform, lighting);
        if (lighting) {
            gl.uniform3f(
                shaderProgram.ambientColorUniform,
                parseFloat(document.getElementById("ambientR").value),
                parseFloat(document.getElementById("ambientG").value),
                parseFloat(document.getElementById("ambientB").value)
            );

            gl.uniform3f(
                shaderProgram.pointLightingLocationUniform,
                parseFloat(document.getElementById("lightPositionX").value),
                parseFloat(document.getElementById("lightPositionY").value),
                parseFloat(document.getElementById("lightPositionZ").value)
            );

            gl.uniform3f(
                shaderProgram.pointLightingSpecularColorUniform,
                parseFloat(document.getElementById("specularR").value),
                parseFloat(document.getElementById("specularG").value),
                parseFloat(document.getElementById("specularB").value)
            );

            gl.uniform3f(
                shaderProgram.pointLightingDiffuseColorUniform,
                parseFloat(document.getElementById("diffuseR").value),
                parseFloat(document.getElementById("diffuseG").value),
                parseFloat(document.getElementById("diffuseB").value)
            );
        }

        var texture = document.getElementById("texture").value;
        gl.uniform1i(shaderProgram.useTexturesUniform, texture != "none");

        mat4.identity(mvMatrix);
        mat4.translate(mvMatrix, [0, 0 , -10]);
        mvPushMatrix();

        mat4.rotate(mvMatrix, degToRad(0), [1, 0, 0]);
        mat4.rotate(mvMatrix, degToRad(0), [0, 1, 0]);

        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, glassTexture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);

        var blending = document.getElementById("blending").checked;
        if (blending) {
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
            gl.enable(gl.BLEND);
            gl.disable(gl.DEPTH_TEST);
            gl.uniform1f(shaderProgram.alphaUniform, parseFloat(document.getElementById("alpha").value));
        } else {
            gl.disable(gl.BLEND);
            gl.enable(gl.DEPTH_TEST);
        }

        var lighting = document.getElementById("lighting").checked;
        gl.uniform1i(shaderProgram.useLightingUniform, lighting);
        if (lighting) {
            gl.uniform3f(
                shaderProgram.ambientColorUniform,
                parseFloat(document.getElementById("ambientR").value),
                parseFloat(document.getElementById("ambientG").value),
                parseFloat(document.getElementById("ambientB").value)
            );

            var lightingDirection = [
                parseFloat(document.getElementById("lightDirectionX").value),
                parseFloat(document.getElementById("lightDirectionY").value),
                parseFloat(document.getElementById("lightDirectionZ").value)
            ];
            var adjustedLD = vec3.create();
            vec3.normalize(lightingDirection, adjustedLD);
            vec3.scale(adjustedLD, -1);
            gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);

            gl.uniform3f(
                shaderProgram.directionalColorUniform,
                parseFloat(document.getElementById("directionalR").value),
                parseFloat(document.getElementById("directionalG").value),
                parseFloat(document.getElementById("directionalB").value)
            );
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
        setMatrixUniforms();
        gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        mvPopMatrix();
        mat4.translate(mvMatrix, [fishx, fishy, -10]);
        mat4.rotate(mvMatrix, degToRad(23.4), [1, 0, -1]);
        mat4.rotate(mvMatrix, degToRad(teapotAngle), [0, 1, 0]);

        gl.activeTexture(gl.TEXTURE0);
        if (texture == "earth") {
            gl.bindTexture(gl.TEXTURE_2D, earthTexture);
        } else if (texture == "galvanized") {
            gl.bindTexture(gl.TEXTURE_2D, galvanizedTexture);
        }
        gl.uniform1i(shaderProgram.samplerUniform, 0);

        gl.uniform1f(shaderProgram.materialShininessUniform, parseFloat(document.getElementById("shininess").value));

        gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, teapotVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexTextureCoordBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, teapotVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexNormalBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, teapotVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotVertexIndexBuffer);
        setMatrixUniforms();
        gl.drawElements(gl.TRIANGLES, teapotVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    }

var RunDemo = function (vertexShaderText, fragmentShaderText, SusanImage, SusanModel, tunaModel) {

	var canvas = document.getElementById('game-surface');
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
	gl = canvas.getContext('webgl');


	var AMORTIZATION=0.95;
  	var drag=false;
    var theta=Math.PI/2;

  	var old_x, old_y;

  	var dX=0, dY=0;
  	var mouseDown=function(e) {
	    drag=true;
	    old_x=e.pageX, old_y=e.pageY;
	    e.preventDefault();
	    return false;
	  };

    var mouseUp=function(e){
	    drag=false;
    };

    var mouseMove=function(e) {
	    if (!drag) return false;
	    dX=(e.pageX-old_x)*2*Math.PI/canvas.width,
	      dY=(e.pageY-old_y)*2*Math.PI/canvas.height;
	    theta+=dX;
	   // PHI+=dY;
	    old_x=e.pageX, old_y=e.pageY;
	    e.preventDefault();
	  };

  canvas.addEventListener("mousedown", mouseDown, false);
  canvas.addEventListener("mouseup", mouseUp, false);
  canvas.addEventListener("mouseout", mouseUp, false);
  canvas.addEventListener("mousemove", mouseMove, false);


	if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Your browser does not support WebGL');
	}

	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

	//
	// Create shaders
	//
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}

	//
	// Create buffer
	//
	//console.log(SusanModel.meshes[0]);*
	var audio= new Audio();
	audio.src="./Fishtank.wav";
	if(audio)
	{
		audio.play();
	}
	var susanVertices = SusanModel.meshes[0].vertices;
	var susanIndices = [].concat.apply([], SusanModel.meshes[0].faces);
	var susanTexCoords = SusanModel.meshes[0].texturecoords[0];
	console.log(SusanModel);

	var susanPosVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, susanPosVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(susanVertices), gl.STATIC_DRAW);

	var susanTexCoordVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, susanTexCoordVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(susanTexCoords), gl.STATIC_DRAW);

	var susanIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, susanIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(susanIndices), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, susanPosVertexBufferObject);
	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	gl.enableVertexAttribArray(positionAttribLocation);

	gl.bindBuffer(gl.ARRAY_BUFFER, susanTexCoordVertexBufferObject);
	var texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
	gl.vertexAttribPointer(
		texCoordAttribLocation, // Attribute location
		2, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0
	);
	console.log(susanTexCoords);
	gl.enableVertexAttribArray(texCoordAttribLocation);

	//
	// Create texture
	//
	var susanTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, susanTexture);

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texImage2D(
		gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
		gl.UNSIGNED_BYTE,
		SusanImage
	);


	//var tunaModel;

	var tunaVertices = tunaModel.meshes[0].vertices;
	var tunaIndices = [].concat.apply([], tunaModel.meshes[0].faces);
	var tunaTexCoords = tunaModel.meshes[0].texturecoords[0];
	console.log(tunaModel);

	var tunaPosVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, tunaPosVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tunaVertices), gl.STATIC_DRAW);

	var tunaTexCoordVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, tunaTexCoordVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tunaTexCoords), gl.STATIC_DRAW);

	var tunaIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tunaIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tunaIndices), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, tunaPosVertexBufferObject);
	var position1AttribLocation = gl.getAttribLocation(program, 'vertPosition');
	gl.vertexAttribPointer(
		position1AttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	gl.enableVertexAttribArray(position1AttribLocation);

	gl.bindBuffer(gl.ARRAY_BUFFER, tunaTexCoordVertexBufferObject);
	var tex1CoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
	gl.vertexAttribPointer(
		tex1CoordAttribLocation, // Attribute location
		2, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0
	);
	console.log(tunaTexCoords);
	gl.enableVertexAttribArray(tex1CoordAttribLocation);

	//
	// Create texture
	//
	var tunaImage=loadTextureImage("TUNA.png");
	var tunaTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, tunaTexture);

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texImage2D(
		gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
		gl.UNSIGNED_BYTE,
		tunaImage
	);

	gl.bindTexture(gl.TEXTURE_2D, tunaTexture);



	gl.bindTexture(gl.TEXTURE_2D, null);
//	console.log()

	// Tell OpenGL state machine which program should be active.
	gl.useProgram(program);

	var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
	var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

	var worldMatrix = new Float32Array(16);
	var viewMatrix = new Float32Array(16);
	var projMatrix = new Float32Array(16);
	mat4.identity(worldMatrix);
	mat4.lookAt(viewMatrix, [0 ,0, -8], [0, 0, 0], [0, 1, 0]);
	mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);

	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

	var xRotationMatrix = new Float32Array(16);
	var yRotationMatrix = new Float32Array(16);
  var g1 = 1;
	var g2 = 1;
	var g3 = 1;
	var e1 = 0.5;
	var e2 = 0.5;
	var e3 = 0.5;
//	var temp={worldmatrix: worldmatrix, type: "tuna"};
	//
	// Main render loop
	//
	mat4.identity(worldMatrix);
	worldMatrix[0]=1.0;
	worldMatrix[5]=1.0;
	worldMatrix[10]=1.0;
	var identityMatrix = new Float32Array(16);
	mat4.identity(identityMatrix);
	var x=0,y=0,z=0,k;
	var angle = 0;
	var moving=false;
	var flag=0;
	var count=30
	var count2=25;
	var t1=1,t2=0,t3=0;
	var e1=1,e2=0,e3=0;
	var i1=-2,i2=0,i3=0;
	var angle2=0;
	var loop = function () {
		if (!drag) {
     		 dX*=AMORTIZATION, dY*=AMORTIZATION;
     	 	  theta+=dX;
    	}
    //	console.log(theta);
		angle = performance.now() / 1000 / 6 * 2 * Math.PI;
		var r1=100000*Math.random();
		if(count==0){
			count=30;
		var r=Math.floor(Math.random() * 4) + 1;
		if(r==1){
				t1=1;
		}
		else if(r==2) {
				t2=1;
		}
		else if(r==3){
			t1=-1;
		}
		else {
			t2=-1;
		}
	}
	if(g2<-3 || g2>3) {
			t2*=-1;
		}
		count2-=1;
		if(t1==-1)
		{
			angle4=-Math.PI;
		}
		if(t2==1){
			angle4=Math.PI/2;
		}
		else if(t2==-1){
			angle4=-Math.PI/2;
		}

		e1+=t1*0.03
		e3+=t2*0.03;
		if(count==0){
			count=30;
		var r=Math.floor(Math.random() * 4) + 1;
		if(r==1){
				t1=1;
		}
		else if(r==2) {
				t2=1;
		}
		else if(r==3){
			t1=-1;
		}
		else {
			t2=-1;
		}
	}
	if(g2<-3 || g2>3) {
			t2*=-1;
		}
		count-=1;
		if(t1==-1)
		{
			angle2=-Math.PI;
		}
		if(t2==1){
			angle2=Math.PI/2;
		}
		else if(t2==-1){
			angle2=-Math.PI/2;
		}
		g1+=t1*0.03
		g3+=t2*0.03;
		if(count2==0){
			count2=25;
		r=Math.floor(Math.random() * 4) + 1;
		if(r==1){
				t1=1;
		}
		else if(r==2) {
				t2=1;
		}
		else if(r==3){
			t1=-1;
		}
		else {
			t2=-1;
		}
	}
	if(g1<-3 || g1>3)
		{
			t1*=-1;
		}
	if(g1<-3 || g1>3)
		{
			t1*=-1;
		}
	if(g1<-3 || g1>3)
		{
			t1*=-1;
		}
	
	if(g1<-3 || g1>3)
		{
			t1*=-1;
		}
	if(g2<-3 || g2>3) {
			t2*=-1;
		}
		if(t1==-1)
		{
			angle4=-Math.PI;
		}
		if(t2==1){
			angle4=Math.PI/2;
		}
		else if(t2==-1){
			angle4=-Math.PI/2;
		}
	if(g2<-3 || g2>3) {
			t2*=-1;
		}
		count-=1;
		if(t1==-1)
		{
			angle2=-Math.PI;
		}
		if(t2==1){
			angle2=Math.PI/2;
		}
		else if(t2==-1){
			angle2=-Math.PI/2;
		}
		g1+=t1*0.005
		g3+=t2*0.005;
		if(count2==0){
			count2=25;
		r=Math.floor(Math.random() * 4) + 1;
		if(r==1){
				t1=1;
		}
		else if(r==2) {
				t2=1;
		}
		else if(r==3){
			t1=-1;
		}
		else {
			t2=-1;
		}
	}
		i1+=t1*0.01
		i3+=t2*0.01;
		mat4.lookAt(viewMatrix,[8*Math.cos(theta),0,8*Math.sin(theta)], [0,0,0] , [0,1,0]);
		gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);

		tunaPosVertexBufferObject = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, tunaPosVertexBufferObject);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tunaVertices), gl.STATIC_DRAW);

		 tunaTexCoordVertexBufferObject = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, tunaTexCoordVertexBufferObject);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tunaTexCoords), gl.STATIC_DRAW);

		 tunaIndexBufferObject = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tunaIndexBufferObject);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tunaIndices), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, tunaPosVertexBufferObject);
		 position1AttribLocation = gl.getAttribLocation(program, 'vertPosition');
		gl.vertexAttribPointer(
			position1AttribLocation, // Attribute location
			3, // Number of elements per attribute
			gl.FLOAT, // Type of elements
			gl.FALSE,
			3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
			0 // Offset from the beginning of a single vertex to this attribute
		);
		gl.enableVertexAttribArray(position1AttribLocation);

		  gl.bindBuffer(gl.ARRAY_BUFFER, tunaTexCoordVertexBufferObject);
		  tex1CoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
		  gl.vertexAttribPointer(
			tex1CoordAttribLocation, // Attribute location
			2, // Number of elements per attribute
			gl.FLOAT, // Type of elements
			gl.FALSE,
			2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
			0
		);

		gl.enableVertexAttribArray(tex1CoordAttribLocation);

		//
		// Create texture
		//

		 tunaTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, tunaTexture);

		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texImage2D(
			gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
			gl.UNSIGNED_BYTE,
			tunaImage
		);

		gl.bindTexture(gl.TEXTURE_2D, tunaTexture);
		mat4.identity(worldMatrix);
		mat4.scalar.translate(worldMatrix,worldMatrix,[e1,e2,e3]);
		mat4.scalar.scale(worldMatrix,worldMatrix,[3,3,3]);


		mat4.rotate(worldMatrix,worldMatrix,-Math.PI/2,[1,0,0]);
		mat4.rotate(worldMatrix,worldMatrix,-Math.PI/2+angle,[0,0,1]);
		mat4.rotate(worldMatrix,worldMatrix,Math.PI/2,[1,0,0]);

	//	mat4.scalar.translate(worldmatrix,worldmatrix,[]);


		gl.clearColor(0.75, 0.85, 0.8, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.activeTexture(gl.TEXTURE0);

		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
			gl.drawElements(gl.TRIANGLES, tunaIndices.length, gl.UNSIGNED_SHORT, 0);


		 susanPosVertexBufferObject = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, susanPosVertexBufferObject);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(susanVertices), gl.STATIC_DRAW);

	    susanTexCoordVertexBufferObject = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, susanTexCoordVertexBufferObject);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(susanTexCoords), gl.STATIC_DRAW);

		susanIndexBufferObject = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, susanIndexBufferObject);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(susanIndices), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, susanPosVertexBufferObject);
	    positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
		gl.vertexAttribPointer(
			positionAttribLocation, // Attribute location
			3, // Number of elements per attribute
			gl.FLOAT, // Type of elements
			gl.FALSE,
			3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
			0 // Offset from the beginning of a single vertex to this attribute
		);
		gl.enableVertexAttribArray(positionAttribLocation);

		gl.bindBuffer(gl.ARRAY_BUFFER, susanTexCoordVertexBufferObject);
		exCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
		gl.vertexAttribPointer(
			texCoordAttribLocation, // Attribute location
			2, // Number of elements per attribute
			gl.FLOAT, // Type of elements
			gl.FALSE,
			2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
			0
		);
	//	console.log(susanTexCoords);
		gl.enableVertexAttribArray(texCoordAttribLocation);

		gl.bindTexture(gl.TEXTURE_2D, susanTexture);
		gl.activeTexture(gl.TEXTURE0);



		var worldMatrix2 = new Float32Array(16);

		mat4.identity(worldMatrix2);
		mat4.scalar.translate(worldMatrix2,worldMatrix2,[g1,g2,g3]);
		mat4.scalar.scale(worldMatrix2,worldMatrix2,[0.15,0.15,0.30]);
		mat4.rotate(worldMatrix2,worldMatrix2,angle2,[0,1,0]);


		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix2);

		gl.drawElements(gl.TRIANGLES, susanIndices.length, gl.UNSIGNED_SHORT, 0);
		susanPosVertexBufferObject = gl.createBuffer();
	 gl.bindBuffer(gl.ARRAY_BUFFER, susanPosVertexBufferObject);
	 gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(susanVertices), gl.STATIC_DRAW);

		 susanTexCoordVertexBufferObject = gl.createBuffer();
	 gl.bindBuffer(gl.ARRAY_BUFFER, susanTexCoordVertexBufferObject);
	 gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(susanTexCoords), gl.STATIC_DRAW);

	 susanIndexBufferObject = gl.createBuffer();
	 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, susanIndexBufferObject);
	 gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(susanIndices), gl.STATIC_DRAW);

	 gl.bindBuffer(gl.ARRAY_BUFFER, susanPosVertexBufferObject);
		 positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	 gl.vertexAttribPointer(
		 positionAttribLocation, // Attribute location
		 3, // Number of elements per attribute
		 gl.FLOAT, // Type of elements
		 gl.FALSE,
		 3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		 0 // Offset from the beginning of a single vertex to this attribute
	 );
	 gl.enableVertexAttribArray(positionAttribLocation);

	 gl.bindBuffer(gl.ARRAY_BUFFER, susanTexCoordVertexBufferObject);
	 exCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
	 gl.vertexAttribPointer(
		 texCoordAttribLocation, // Attribute location
		 2, // Number of elements per attribute
		 gl.FLOAT, // Type of elements
		 gl.FALSE,
		 2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		 0
	 );
 //	console.log(susanTexCoords);
	 gl.enableVertexAttribArray(texCoordAttribLocation);

	 gl.bindTexture(gl.TEXTURE_2D, susanTexture);
	 gl.activeTexture(gl.TEXTURE0);



	 var worldMatrix2 = new Float32Array(16);

	 mat4.identity(worldMatrix2);
	 mat4.scalar.translate(worldMatrix2,worldMatrix2,[i1,i2,i3]);
	 mat4.scalar.scale(worldMatrix2,worldMatrix2,[0.55,0.55,0.20]);
	 mat4.rotate(worldMatrix2,worldMatrix2,angle2,[0,1,0]);


	 gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix2);

	 gl.drawElements(gl.TRIANGLES, susanIndices.length, gl.UNSIGNED_SHORT, 0);

 		gl.flush();


		requestAnimationFrame(loop);
		};
	requestAnimationFrame(loop);



};

var loadTextureImage= function( url )
{
	var image=new Image();
	image.src=url;
	return image;
};
var fruits1 = ["______________________________________________________________________________________________________________________________________________________________________________"];
document.getElementById("demo1").innerHTML = fruits1;

function myFunction1() {
    fruits1.sort();
    document.getElementById("demo1").innerHTML = fruits1;
}
/*
var loadJson=function (url)
{
	loadJSONResource(url, function (modelErr, modelObj) {
	if (modelErr) {
			alert('Fatal error getting Susan model (see console)');
			console.error(fsErr);
		}
		else {
			console.log(modelObj);
			return modelObj;
		}
	});
};*/
var lastTime = 0;

    function animate() {
        var timeNow = new Date().getTime();
        if (lastTime != 0) {
            var elapsed = timeNow - lastTime;

            if(oppose<15){
              teapotAngle += 0.05 * elapsed;
              oppose+=1
            }
            else if(oppose<30) {
              teapotAngle -= 0.05 * elapsed;
              oppose+=1;
            }
            else {
              oppose=0;
            }
            fishx = (fishx+0.02)%2;
            fishy =(fishy +0.02)%2;
        }
        lastTime = timeNow;
    }
    var currentlyPressedKeys = {};

    function handleKeyDown(event) {
        currentlyPressedKeys[event.keyCode] = true;
    }


    function handleKeyUp(event) {
        currentlyPressedKeys[event.keyCode] = false;
    }
    function handleKeys() {
    if (currentlyPressedKeys[33]) {
        // Page Up
    }
    if (currentlyPressedKeys[34]) {
        // Page Down
    }
    if (currentlyPressedKeys[37]) {
        // Left cursor key
    }
    if (currentlyPressedKeys[39]) {
        // Right cursor key
    }
    if (currentlyPressedKeys[38]) {
        // Up cursor key
    }
    if (currentlyPressedKeys[40]) {
        // Down cursor key
  }
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

        var normalMatrix = mat3.create();
        mat4.toInverseMat3(mvMatrix, normalMatrix);
        mat3.transpose(normalMatrix);
        gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
    }

    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }


    var teapotVertexPositionBuffer;
    var teapotVertexNormalBuffer;
    var teapotVertexTextureCoordBuffer;
    var teapotVertexIndexBuffer;

    function handleLoadedTeapot(teapotData) {
        teapotVertexNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotData.vertexNormals), gl.STATIC_DRAW);
        teapotVertexNormalBuffer.itemSize = 3;
        teapotVertexNormalBuffer.numItems = teapotData.vertexNormals.length / 3;

        teapotVertexTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexTextureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotData.vertexTextureCoords), gl.STATIC_DRAW);
        teapotVertexTextureCoordBuffer.itemSize = 2;
        teapotVertexTextureCoordBuffer.numItems = teapotData.vertexTextureCoords.length / 2;

        teapotVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotData.vertexPositions), gl.STATIC_DRAW);
        teapotVertexPositionBuffer.itemSize = 3;
        teapotVertexPositionBuffer.numItems = teapotData.vertexPositions.length / 3;

        teapotVertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotVertexIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(teapotData.indices), gl.STATIC_DRAW);
        teapotVertexIndexBuffer.itemSize = 1;
        teapotVertexIndexBuffer.numItems = teapotData.indices.length;

        document.getElementById("loadingtext").textContent = "";
    }

