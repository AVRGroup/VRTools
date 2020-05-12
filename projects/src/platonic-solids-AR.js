function main(){
	//////////////////////////////////////////////////////////////////////////////////
	//		Init
	//////////////////////////////////////////////////////////////////////////////////

	// use the defaults
    var scene = new THREE.Scene();                  // Create main scene
	var camera = new THREE.Camera();
	scene.add(camera);

    var clock = new THREE.Clock();
    //var light = initDefaultLighting(scene, new THREE.Vector3(2.2, 4.4, 0));  // Use default light

    var dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position = new THREE.Vector3(2.2, 4.4, 0);
    dirLight.castShadow = false;

    scene.add(dirLight);

    var ambientLight = new THREE.AmbientLight(0x343434);
    ambientLight.name = "ambientLight";
    scene.add(ambientLight);

	// init renderer
	var renderer	= new THREE.WebGLRenderer({
		antialias: true,
		alpha: true
    });
    renderer.setClearColor(new THREE.Color('lightgrey'), 0);
	
	renderer.domElement.style.position = 'absolute';
	renderer.domElement.style.top = '0px';
	renderer.domElement.style.left = '0px';
	renderer.setSize( 640, 480 );
    //renderer.setSize(window.innerWidth, window.innerHeight);

	// Adiciona a saída do renderizador para um elemento da página HTML
	document.getElementById("webgl-output").appendChild(renderer.domElement);	//document.body.appendChild( renderer.domElement );
	
	// Show axes (parameter is size of each axis)
    var axes = new THREE.AxesHelper(0.8);
    axes.name = "AXES";
    axes.visible = false;
    scene.add(axes);

    /* Generate a plane above the solids */
    /*var groundPlane = createGroundPlane(1, 1); // width and height
    groundPlane.rotateX(degreesToRadians(-90));
	scene.add(groundPlane);*/   
	
	// Object Material for all objects
    var objectMaterial = new THREE.MeshNormalMaterial({color:"rgb(255, 0, 0)"});//new THREE.MeshPhongMaterial({color:"rgb(255, 0, 0)"});
    objectMaterial.side = THREE.DoubleSide;     

    // Add objects to scene
    var objectArray = new Array();
    scene.add(createTetrahedron(0.28, 0));
    scene.add(createCube(0.28));
    scene.add(createOctahedron(0.28, 0));
    scene.add(createDodecahedron(0.28, 0));
    scene.add(createIcosahedron(0.28, 0));
    
    // Position of the cube
	objectArray[1].position.y = 0.25;
	
	// Controls of sidebar
    var controls = new function () {

        // Axes
        this.axes = false;
        this.axesSize = 0.8;

        this.updateAxes = function(){
            scene.remove(axes);                                 //Remove o eixo antigo
            axes = new THREE.AxesHelper(controls.axesSize);
            axes.visible = this.axes;
            scene.add(axes);
        }

        this.wireframe = false;
        this.color = "rgb(255, 0, 0)";

        // Geometry
        this.mesh = objectArray[0];
        this.meshNumber = 0;
        this.type = 'Tetrahedron';

        this.choosePoligon = function(){
            objectArray[this.meshNumber].visible = false;
            switch (this.type) {
                case 'Tetrahedron':
                    this.meshNumber = 0;
                    break;
                case 'Cube':
                    this.meshNumber = 1;
                    break;
                case 'Octahedron':
                    this.meshNumber = 2;
                    break;
                case 'Dodecahedron':
                    this.meshNumber = 3;
                    break;
                case 'Icosahedron':
                    this.meshNumber = 4;
                    break;
            }
            objectArray[this.meshNumber].visible = true;
            this.mesh = objectArray[this.meshNumber];
        }

        this.updateColor = function(){
            // removing the objects with the old material color
            for(let i = 0; i < objectArray.length; i++){            
                scene.remove(objectArray[i]);
            }
            objectArray = new Array();
            objectMaterial = new THREE.MeshNormalMaterial({color:controls.color});//new THREE.MeshPhongMaterial({color:controls.color})
            // Setting the material with new color

            objectMaterial.side = THREE.DoubleSide;
            
            // Recreating those objects
            scene.add(createTetrahedron(0.28, 0));
            scene.add(createCube(0.28));
            scene.add(createOctahedron(0.28, 0));
            scene.add(createDodecahedron(0.28, 0));
            scene.add(createIcosahedron(0.28, 0));
            
            // Position of the cube
            objectArray[1].position.y = 0.25;

            controls.choosePoligon();
        }
	}
	
	// GUI de controle e ajuste de valores especificos da geometria do objeto
	var gui = new dat.GUI();

    var guiFolder = gui.addFolder("Properties");
    guiFolder.open();                                       // Open the folder
    guiFolder.add(controls, "axes").listen().onChange(function(e){
        if(controls.axes){
        	axes.visible = true;
        }
        else{
        	axes.visible = false;
        }
    });
    guiFolder.add(controls, "axesSize", 0.1, 3).listen().onChange(function(e){
         controls.updateAxes();
    });
    guiFolder.addColor(controls, 'color').onChange(function(e){
        controls.updateColor();
    });
    guiFolder.add(controls, 'wireframe').listen().onChange(function(e){
        if(controls.wireframe){
        	objectMaterial.wireframe = true;
        }
        else{
        	objectMaterial.wireframe = false;
        }
    });
    guiFolder.add(controls, 'type', ['Tetrahedron','Cube', 'Octahedron', 'Dodecahedron', 'Icosahedron']).onChange(function(e){
        controls.choosePoligon();
    });

    controls.choosePoligon();               // Update de selection of the polygon

    // 4 faces
    function createTetrahedron(radius, detail)
    {
        var geometry = new THREE.TetrahedronGeometry(radius, detail);
        var object = new THREE.Mesh(geometry, objectMaterial);
        object.position.set(0.0, radius, 0.0);
        object.rotation.z = 45;
        object.visible = false;
        object.name = "Tetrahedron";
        objectArray.push(object);
        return object;
    }

    // 6 faces
    function createCube(s)
    {
        let geometry = new THREE.BoxGeometry(s, s, s);
        let object = new THREE.Mesh(geometry, objectMaterial);
        object.position.set(0.0, s/2.0, 0.0);
        object.visible = false;
        object.name = "Cube";
        objectArray.push(object);
        return object;
    }

    // 8 faces
    function createOctahedron(radius, detail)
    {
        var geometry = new THREE.OctahedronGeometry(radius, detail);
        var object = new THREE.Mesh(geometry, objectMaterial);
        object.position.set(0.0, radius, 0.0);
        object.visible = false;
        object.name = "Octahedro";
        objectArray.push(object);
        return object;
    }

    // 12 faces
    function createDodecahedron(radius, detail)
    {
        var geometry = new THREE.DodecahedronGeometry(radius, detail);
        var object = new THREE.Mesh(geometry, objectMaterial);
        object.position.set(0.0, radius, 0.0);
        object.visible = false;
        object.name = "Dodecahedron";
        objectArray.push(object);
        return object;
    }

    // 20 faces
    function createIcosahedron(radius, detail)
    {
        let geometry = new THREE.IcosahedronGeometry(radius, detail);
        let object = new THREE.Mesh(geometry, objectMaterial);
        object.position.set(0.0, radius, 0.0);
        object.visible = false;
        object.name = "Icosahedron";
        objectArray.push(object);
        return object;
    }
    

	////////////////////////////////////////////////////////////////////////////////
	//          Handler arToolkitSource
	////////////////////////////////////////////////////////////////////////////////

	var arToolkitSource = new THREEx.ArToolkitSource({
		// to read from the webcam
		sourceType : 'webcam',

		// // to read from an image
		// sourceType : 'image',
		// sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/images/img.jpg',

		// to read from a video
		// sourceType : 'video',
		// sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/videos/headtracking.mp4',

		// resolution of at which we initialize the source image
		//sourceWidth: 640,
		//sourceHeight: 480,

		// resolution displayed for the source
		// displayWidth: window.innerWidth,  //window.innerWidth,
		// displayHeight: window.innerHeight//window.innerHeight
	})

	arToolkitSource.init(function onReady(){
        //onResize();

        // Esse timeout força a interface de AR se redimensionar com base no tempo passado
        /*setTimeout(() => {
            onResize()
        }, 25);
        */

       setTimeout(onResize, 100);
    });

	// handle resize
	window.addEventListener('resize', function(){
		onResize();
	});

	function onResize(){
		arToolkitSource.onResizeElement();
		arToolkitSource.copyElementSizeTo(renderer.domElement);
		if( arToolkitContext.arController !== null ){
			arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
		}
	}
	
	////////////////////////////////////////////////////////////////////////////////
	//          initialize arToolkitContext
	////////////////////////////////////////////////////////////////////////////////


	// create atToolkitContext
	var arToolkitContext = new THREEx.ArToolkitContext({
		cameraParametersUrl: THREEx.ArToolkitContext.baseURL + 'data/data/camera_para.dat',
		detectionMode: 'mono',

		// tune the maximum rate of pose detection in the source image
		//maxDetectionRate: 60,
		// resolution of at which we detect pose in the source image
		// canvasWidth: window.innerWidth,	//640
		// canvasHeight: window.innerHeight,	//480

		// debug - true if one should display artoolkit debug canvas, false otherwise
		//debug: false,

		// enable image smoothing or not for canvas copy - default to true
		// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled
		// imageSmoothingEnabled : true,
	})

	// initialize it
	arToolkitContext.init(function onCompleted(){
		// copy projection matrix to camera
        camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
        onResize();     // TESTE
	});

	////////////////////////////////////////////////////////////////////////////////
	//          Create a ArMarkerControls
	////////////////////////////////////////////////////////////////////////////////

	// init controls for camera
	var markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
		type : 'pattern',
		patternUrl : THREEx.ArToolkitContext.baseURL + 'data/data/patt.hiro',
		// patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji',
		// as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
		changeMatrixMode: 'cameraTransformMatrix'
	});

	// as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
	scene.visible = false;

	//////////////////////////////////////////////////////////////////////////////////
	//		Rendering of camera and solids
	//////////////////////////////////////////////////////////////////////////////////

	function updateAR(){
		if( arToolkitSource.ready === false )	return;

		arToolkitContext.update( arToolkitSource.domElement );

		// update scene.visible if the marker is seen
		scene.visible = camera.visible;
	}

	render();
    function render() {
        updateAR();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
}