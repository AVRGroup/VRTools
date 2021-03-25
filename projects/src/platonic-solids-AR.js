function main(lang) {
    //////////////////////////////////////////////////////////////////////////////////
    //		Init
    //////////////////////////////////////////////////////////////////////////////////

    // use the defaults

    switch (lang) {
        case "en-US":
            {
                var scene = new THREE.Scene(); // Create main scene
                var camera = new THREE.Camera();
                scene.add(camera);


                // Default Light
                var dirLight = new THREE.DirectionalLight(0xffffff);
                dirLight.position = new THREE.Vector3(2.2, 4.4, 0);
                dirLight.castShadow = false;
                scene.add(dirLight);
                var ambientLight = new THREE.AmbientLight(0x343434);
                ambientLight.name = "ambientLight";
                scene.add(ambientLight);

                // init renderer
                var renderer = new THREE.WebGLRenderer({
                    antialias: true,
                    alpha: true
                });
                renderer.setClearColor(new THREE.Color('lightgrey'), 0);

                renderer.domElement.style.position = 'absolute';
                renderer.domElement.style.top = '0px';
                renderer.domElement.style.left = '0px';
                renderer.setPixelRatio(window.devicePixelRatio); //Improve Ratio of pixel in function of the of device
                renderer.setSize(window.innerWidth, window.innerHeight); //640, 480

                // Adiciona a saída do renderizador para um elemento da página HTML
                document.getElementById("webgl-output").appendChild(renderer.domElement);

                // Show axes (parameter is size of each axis)
                var axes = new THREE.AxesHelper(0.8);
                axes.name = "AXES";
                axes.visible = false;
                scene.add(axes);

                /*var groundPlane = createGroundPlane(1, 1,0); // width and height
                groundPlane.rotateX(degreesToRadians(-90));
                scene.add(groundPlane);*/

                // Object Material for all objects -- MeshNormalMaterial
                var objectMaterial = new THREE.MeshBasicMaterial({ color: "rgb(255, 0, 0)" });
                objectMaterial.side = THREE.DoubleSide;
                var wireframe = new THREE.LineBasicMaterial({ color: "rgb(255, 0, 0)", linewidth: 2 });
                // Add objects to scene
                var objectArray = new Array();

                criationObjects();

                function criationObjects() {
                    scene.add(createTetrahedron(0.35, 0));
                    scene.add(createCube(0.50));
                    scene.add(createOctahedron(0.28, 0));
                    scene.add(createDodecahedron(0.28, 0));
                    scene.add(createIcosahedron(0.28, 0));

                    scene.add(createTetrahedronWireframe(0.35, 0));
                    scene.add(createCubeWireframe(0.50));
                    scene.add(createOctahedronWireframe(0.28, 0));
                    scene.add(createDodecahedronWireframe(0.28, 0));
                    scene.add(createIcosahedronWireframe(0.28, 0));
                }
                // Controls of sidebar
                var controls = new function () {

                    // Axes
                    this.axes = false;

                    this.wireframe = false;
                    this.color = "rgb(255, 0, 0)";

                    // Rotation
                    /*this.rotX = 0.1;
                    this.rotY = 0.1;
                    this.rotZ = 0.1;*/

                    // Geometry
                    this.mesh = objectArray[0];
                    this.meshNumber = 0;
                    this.type = 'Tetrahedron';
                    this.size = 1.0

                    this.choosePoligon = function () {
                        objectArray[this.meshNumber].visible = false;
                        if (this.wireframe) {
                            switch (this.type) {
                                case 'Tetrahedron':
                                    this.type = 'TetrahedronWireframe';
                                    this.meshNumber = 5;
                                    break;
                                case 'Cube':
                                    this.type = 'CubeWireframe';
                                    this.meshNumber = 6;
                                    break;
                                case 'Octahedron':
                                    this.type = 'OctahedronWireframe';
                                    this.meshNumber = 7;
                                    break;
                                case 'Dodecahedron':
                                    this.type = 'DodecahedronWireframe';
                                    this.meshNumber = 8;
                                    break;
                                case 'Icosahedron':
                                    this.type = 'IcosahedronWireframe';
                                    this.meshNumber = 9;
                                    break;
                            }
                        } else {
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
                        }
                        objectArray[this.meshNumber].visible = true;
                        this.mesh = objectArray[this.meshNumber];
                    }

                    this.resizePoligon = function () {
                        if (this.wireframeStatus) {
                            this.meshNumber -= 5;
                        }

                        const poligon = objectArray[this.meshNumber]
                        const radius = this.type === "Cube" || this.type === "CubeWireframe" ? poligon.geometry.parameters.height : poligon.geometry.parameters.radius


                        poligon.scale.set(this.size, this.size, this.size)
                        switch (this.type) {
                            case 'Tetrahedron':
                                poligon.position.y = radius / 3 * this.size;
                                break;
                            case 'TetrahedronWireframe':
                                poligon.position.y = radius / 3 * this.size;
                                break;

                            case 'Cube':
                                poligon.position.y = radius / 2 * this.size;
                                break;
                            case 'CubeWireframe':
                                poligon.position.y = radius / 2 * this.size;
                                break;

                            case 'Octahedron':
                            case 'OctahedronWireframe':

                            case 'Dodecahedron':
                                poligon.position.y = radius * this.size;
                                break;
                            case 'DodecahedronWireframe':
                                poligon.position.y = radius * this.size;
                                break;

                            case 'Icosahedron':
                                poligon.position.y = (radius - 0.05) * this.size;
                                break;
                            case 'IcosahedronWireframe':
                                poligon.position.y = (radius - 0.05) * this.size;
                                break;
                        }
                        if (this.wireframeStatus) {
                            this.meshNumber += 5;
                            objectArray[this.meshNumber].scale.set(this.size, this.size, this.size);
                            objectArray[this.meshNumber].position.y = poligon.position.y;

                        }
                    }

                    this.updateColor = function () {
                        // removing the objects with the old material color
                        for (let i = 0; i < objectArray.length; i++) {
                            scene.remove(objectArray[i]);
                        }
                        objectArray = new Array();
                        objectMaterial = new THREE.MeshBasicMaterial({ color: controls.color });
                        objectMaterial.side = THREE.DoubleSide;
                        wireframe = new THREE.LineBasicMaterial({ color: controls.color });
                        // Recreating those objects
                        criationObjects();

                        this.choosePoligon();

                        this.resizePoligon();

                        // Correcting if the wireframe option is tick
                        this.wireframeController();
                    }

                    this.wireframeController = function () {
                        if (this.wireframe) {
                            objectArray[this.meshNumber].visible = false;
                            if (this.meshNumber < 5) {
                                this.meshNumber += 5;
                            }
                            objectArray[this.meshNumber].visible = true;
                            objectArray[this.meshNumber].scale.set(this.size, this.size, this.size);
                            this.wireframeStatus = true;
                        } else {
                            objectArray[this.meshNumber].visible = false;
                            if (this.meshNumber > 4) {
                                this.meshNumber -= 5;
                            }
                            objectArray[this.meshNumber].visible = true;
                            objectMaterial.visible = true;
                            this.wireframeStatus = false;
                        }
                        this.choosePoligon();
                        this.resizePoligon();
                    }
                }

                // GUI de controle e ajuste de valores especificos da geometria do objeto
                var gui = new dat.GUI();

                var guiFolder = gui.addFolder("Properties");
                guiFolder.open();                                       // Open the folder
                /*guiFolder.add(controls, "axes").listen().onChange(function(e) {
                    if (controls.axes) {
                        axes.visible = true;
                    } else {
                        axes.visible = false;
                    }
                });*/

                /*guiFolder.add(controls, "rotX", -60, 60).listen().onChange(function(e){
                    controls.mesh.rotation.x = (degreesToRadians(controls.rotX));
                });
                guiFolder.add(controls, "rotY", -60, 60).listen().onChange(function(e){
                    controls.mesh.rotation.y = (degreesToRadians(controls.rotY));
                });
                guiFolder.add(controls, "rotZ", -60, 60).listen().onChange(function(e){
                    controls.mesh.rotation.z = (degreesToRadians(controls.rotZ));
                });*/

                guiFolder.addColor(controls, 'color').onChange(function (e) {
                    controls.updateColor();
                });
                guiFolder.add(controls, 'wireframe').listen().onChange(function (e) {
                    controls.wireframeController();
                });
                guiFolder.add(controls, 'type', ['Tetrahedron', 'Cube', 'Octahedron', 'Dodecahedron', 'Icosahedron']).onChange(function (e) {
                    if (this.wireframeStatus) {
                        this.meshNumber -= 5;
                    }
                    controls.choosePoligon();
                    controls.resizePoligon()
                });
                guiFolder.add(controls, 'size', 0.5, 4).listen().onChange(function (e) {
                    controls.resizePoligon()
                })
                controls.wireframeController();
                controls.choosePoligon(); // Update de selection of the polygon

                // 4 faces
                function createTetrahedron(radius, detail) {
                    var geometry = new THREE.TetrahedronGeometry(radius, detail);
                    var object = new THREE.Mesh(geometry, objectMaterial);
                    object.position.set(0.0, radius / 3, 0.0); //Color Axe (Red, Green, Blue)

                    //Set rotation
                    object.rotation.x = degreesToRadians(-41.12);
                    object.rotation.y = degreesToRadians(-42.26);
                    object.rotation.z = degreesToRadians(0.1);

                    object.visible = false;
                    object.name = "Tetrahedron";

                    // Border -- Black line
                    var geo = new THREE.EdgesGeometry(object.geometry);
                    var mat = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.4 });
                    var borderLine = new THREE.LineSegments(geo, mat);
                    borderLine.renderOrder = 1; // make sure wireframes are rendered 2nd
                    borderLine.name = "borderLine";
                    object.add(borderLine);

                    objectArray.push(object);
                    return object;
                }

                // 6 faces
                function createCube(s) {
                    let geometry = new THREE.BoxGeometry(s, s, s);
                    let object = new THREE.Mesh(geometry, objectMaterial);
                    object.position.set(0.0, s / 2, 0.0);
                    object.visible = false;
                    object.name = "Cube";

                    // Border
                    var geo = new THREE.EdgesGeometry(object.geometry);
                    var mat = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.4 });
                    var borderLine = new THREE.LineSegments(geo, mat);
                    borderLine.renderOrder = 1; // make sure wireframes are rendered 2nd
                    borderLine.name = "borderLine";
                    borderLine.transparent = false;
                    object.add(borderLine);

                    objectArray.push(object);
                    return object;
                }

                // 8 faces
                function createOctahedron(radius, detail) {
                    var geometry = new THREE.OctahedronGeometry(radius, detail);
                    var object = new THREE.Mesh(geometry, objectMaterial);
                    object.position.set(0.0, radius, 0.0);
                    object.visible = false;
                    object.name = "Octahedro";

                    // Border
                    var geo = new THREE.EdgesGeometry(object.geometry);
                    var mat = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.4 });
                    var borderLine = new THREE.LineSegments(geo, mat);
                    borderLine.renderOrder = 1; // make sure wireframes are rendered 2nd
                    borderLine.name = "borderLine";
                    object.add(borderLine);

                    objectArray.push(object);
                    return object;
                }

                // 12 faces
                function createDodecahedron(radius, detail) {
                    var geometry = new THREE.DodecahedronGeometry(radius, detail);
                    var object = new THREE.Mesh(geometry, objectMaterial);
                    object.position.set(0.0, radius, 0.0);
                    object.visible = false;
                    object.name = "Dodecahedron";

                    // Border
                    var geo = new THREE.EdgesGeometry(object.geometry);
                    var mat = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.4 });
                    var borderLine = new THREE.LineSegments(geo, mat);
                    borderLine.renderOrder = 1; // make sure wireframes are rendered 2nd
                    borderLine.name = "borderLine";
                    object.add(borderLine);

                    objectArray.push(object);
                    return object;
                }

                // 20 faces
                function createIcosahedron(radius, detail) {
                    let geometry = new THREE.IcosahedronGeometry(radius, detail);
                    let object = new THREE.Mesh(geometry, objectMaterial);
                    object.position.set(0.0, radius - 0.05, 0.0);
                    object.visible = false;
                    object.name = "Icosahedron";

                    // Border
                    var geo = new THREE.EdgesGeometry(object.geometry);
                    var mat = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.4 });
                    var borderLine = new THREE.LineSegments(geo, mat);
                    borderLine.renderOrder = 1; // make sure wireframes are rendered 2nd
                    borderLine.name = "borderLine";
                    object.add(borderLine);

                    objectArray.push(object);
                    return object;
                }


                // 4 faces
                function createTetrahedronWireframe(radius, detail) {

                    let edges = new THREE.EdgesGeometry(new THREE.TetrahedronGeometry(radius, detail));
                    let object = new THREE.LineSegments(edges, wireframe);
                    object.material.linewidth = 2;
                    object.castShadow = true;
                    object.position.set(0.0, radius / 3, 0.0); //Color Axe (Red, Green, Blue)
                    object.visible = false;
                    object.name = "TetrahedronWireframe";
                    objectArray.push(object);

                    object.rotation.x = degreesToRadians(-41.12);
                    object.rotation.y = degreesToRadians(-42.26);
                    object.rotation.z = degreesToRadians(0.1);

                    return object;
                }

                // 6 faces
                function createCubeWireframe(s) {
                    let edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(s, s, s));
                    let object = new THREE.LineSegments(edges, wireframe);
                    object.castShadow = true;
                    object.position.set(0.0, s / 2, 0.0);
                    object.name = "CubeWireframe";
                    object.visible = false;
                    objectArray.push(object);
                    return object;
                }

                // 8 faces
                function createOctahedronWireframe(radius, detail) {
                    const edges = new THREE.EdgesGeometry(new THREE.OctahedronGeometry(radius, detail));
                    const edgesMesh = new THREE.LineSegments(edges, wireframe);
                    edgesMesh.castShadow = true;
                    edgesMesh.position.set(0.0, radius, 0.0);
                    edgesMesh.name = "OcatahedronWireframe";
                    edgesMesh.visible = false;
                    objectArray.push(edgesMesh);
                    return edgesMesh;
                }

                // 12 faces
                function createDodecahedronWireframe(radius, detail) {
                    const edges = new THREE.EdgesGeometry(new THREE.DodecahedronGeometry(radius, detail));
                    const edgesMesh = new THREE.LineSegments(edges, wireframe);
                    edgesMesh.castShadow = true;
                    edgesMesh.position.set(0.0, radius, 0.0);
                    edgesMesh.name = "DodecahedronWireframe";
                    edgesMesh.visible = false;
                    objectArray.push(edgesMesh);
                    return edgesMesh;
                }

                // 20 faces
                function createIcosahedronWireframe(radius, detail) {
                    const edges = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(radius, detail));
                    const edgesMesh = new THREE.LineSegments(edges, wireframe);
                    edgesMesh.castShadow = true;
                    edgesMesh.position.set(0.0, radius, 0.0);
                    edgesMesh.name = "IcosahedronWireframe";
                    edgesMesh.visible = false;
                    objectArray.push(edgesMesh);
                    return edgesMesh;
                }



                ////////////////////////////////////////////////////////////////////////////////
                //          Handler arToolkitSource
                ////////////////////////////////////////////////////////////////////////////////

                var arToolkitSource = new THREEx.ArToolkitSource({
                    // to read from the webcam
                    sourceType: 'webcam',

                    // // to read from an image
                    // sourceType : 'image',
                    // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/images/img.jpg',

                    // to read from a video
                    // sourceType : 'video',
                    // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/videos/headtracking.mp4',

                    // resolution of at which we initialize the source image
                    //sourceWidth: 640,   //640
                    //sourceHeight: 480,  // 480

                    // resolution displayed for the source
                    //displayWidth: 640,  //window.innerWidth,
                    //displayHeight: 480//window.innerHeight

                })

                arToolkitSource.init(function onReady() {
                    // Esse timeout força a interface de AR se redimensionar com base no tempo passado
                    setTimeout(onResize, 1000);
                });

                // handle resize
                window.addEventListener('resize', function () {
                    onResize();
                });

                function onResize() {
                    arToolkitSource.onResizeElement();
                    arToolkitSource.copyElementSizeTo(renderer.domElement);
                    if (arToolkitContext.arController !== null) {
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
                arToolkitContext.init(function onCompleted() {
                    // copy projection matrix to camera
                    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
                });

                ////////////////////////////////////////////////////////////////////////////////
                //          Create a ArMarkerControls
                ////////////////////////////////////////////////////////////////////////////////

                // init controls for camera
                var markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
                    type: 'pattern',
                    patternUrl: THREEx.ArToolkitContext.baseURL + 'data/data/patt.hiro',
                    // patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji',
                    // as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
                    changeMatrixMode: 'cameraTransformMatrix'
                });

                // as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
                scene.visible = false;

                //////////////////////////////////////////////////////////////////////////////////
                //		Rendering of camera and solids
                //////////////////////////////////////////////////////////////////////////////////

                function updateAR() {
                    if (arToolkitSource.ready === false) return;

                    arToolkitContext.update(arToolkitSource.domElement);

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
            break;
        case 'pt-BR': {
            var scene = new THREE.Scene(); // Create main scene
            var camera = new THREE.Camera();
            scene.add(camera);


            // Default Light
            var dirLight = new THREE.DirectionalLight(0xffffff);
            dirLight.position = new THREE.Vector3(2.2, 4.4, 0);
            dirLight.castShadow = false;
            scene.add(dirLight);
            var ambientLight = new THREE.AmbientLight(0x343434);
            ambientLight.name = "ambientLight";
            scene.add(ambientLight);

            // init renderer
            var renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true
            });
            renderer.setClearColor(new THREE.Color('lightgrey'), 0);

            renderer.domElement.style.position = 'absolute';
            renderer.domElement.style.top = '0px';
            renderer.domElement.style.left = '0px';
            renderer.setPixelRatio(window.devicePixelRatio); //Improve Ratio of pixel in function of the of device
            renderer.setSize(window.innerWidth, window.innerHeight); //640, 480

            // Adiciona a saída do renderizador para um elemento da página HTML
            document.getElementById("webgl-output").appendChild(renderer.domElement);

            // Show axes (parameter is size of each axis)
            var axes = new THREE.AxesHelper(0.8);
            axes.name = "AXES";
            axes.visible = false;
            scene.add(axes);

            /*var groundPlane = createGroundPlane(1, 1,0); // width and height
            groundPlane.rotateX(degreesToRadians(-90));
            scene.add(groundPlane);*/

            // Object Material for all objects -- MeshNormalMaterial
            var objectMaterial = new THREE.MeshBasicMaterial({ color: "rgb(255, 0, 0)" });
            objectMaterial.side = THREE.DoubleSide;
            var wireframe = new THREE.LineBasicMaterial({ color: "rgb(255, 0, 0)", linewidth: 2 });
            // Add objects to scene
            var objectArray = new Array();

            criationObjects();

            function criationObjects() {
                scene.add(createTetrahedron(0.35, 0));
                scene.add(createCube(0.50));
                scene.add(createOctahedron(0.28, 0));
                scene.add(createDodecahedron(0.28, 0));
                scene.add(createIcosahedron(0.28, 0));

                scene.add(createTetrahedronWireframe(0.35, 0));
                scene.add(createCubeWireframe(0.50));
                scene.add(createOctahedronWireframe(0.28, 0));
                scene.add(createDodecahedronWireframe(0.28, 0));
                scene.add(createIcosahedronWireframe(0.28, 0));
            }
            // Controls of sidebar
            var controls = new function () {

                // Axes
                this.axes = false;

                this.wireframe = false;
                this.cor = "rgb(255, 0, 0)";

                // Rotation
                /*this.rotX = 0.1;
                this.rotY = 0.1;
                this.rotZ = 0.1;*/

                // Geometry
                this.mesh = objectArray[0];
                this.meshNumber = 0;
                this.tipo = 'Tetraedro';
                this.tamanho = 1.0

                this.choosePoligon = function () {
                    objectArray[this.meshNumber].visible = false;
                    if (this.wireframe) {
                        switch (this.type) {
                            case 'Tetraedro':
                                this.type = 'TetrahedronWireframe';
                                this.meshNumber = 5;
                                break;
                            case 'Cubo':
                                this.type = 'CubeWireframe';
                                this.meshNumber = 6;
                                break;
                            case 'Octaedro':
                                this.type = 'OctahedronWireframe';
                                this.meshNumber = 7;
                                break;
                            case 'Dodecaedro':
                                this.type = 'DodecahedronWireframe';
                                this.meshNumber = 8;
                                break;
                            case 'Icosaedro':
                                this.type = 'IcosahedronWireframe';
                                this.meshNumber = 9;
                                break;
                        }
                    } else {
                        switch (this.type) {
                            case 'Tetraedro':
                                this.meshNumber = 0;
                                break;
                            case 'Cubo':
                                this.meshNumber = 1;
                                break;
                            case 'Octaedro':
                                this.meshNumber = 2;
                                break;
                            case 'Dodecaedro':
                                this.meshNumber = 3;
                                break;
                            case 'Icosaedro':
                                this.meshNumber = 4;
                                break;
                        }
                    }
                    objectArray[this.meshNumber].visible = true;
                    this.mesh = objectArray[this.meshNumber];
                }

                this.resizePoligon = function () {
                    if (this.wireframeStatus) {
                        this.meshNumber -= 5;
                    }

                    const poligon = objectArray[this.meshNumber]
                    const radius = this.type === "Cubo" || this.type === "CubeWireframe" ? poligon.geometry.parameters.height : poligon.geometry.parameters.radius


                    poligon.scale.set(this.tamanho, this.tamanho, this.tamanho)
                    switch (this.tamanho) {
                        case 'Tetraedro':
                            poligon.position.y = radius / 3 * this.tamanho;
                            break;
                        case 'TetrahedronWireframe':
                            poligon.position.y = radius / 3 * this.tamanho;
                            break;

                        case 'Cubo':
                            poligon.position.y = radius / 2 * this.tamanho;
                            break;
                        case 'CubeWireframe':
                            poligon.position.y = radius / 2 * this.tamanho;
                            break;

                        case 'Octaedro':
                        case 'OctahedronWireframe':

                        case 'Dodecaedro':
                            poligon.position.y = radius * this.tamanho;
                            break;
                        case 'DodecahedronWireframe':
                            poligon.position.y = radius * this.tamanho;
                            break;

                        case 'Icosaedro':
                            poligon.position.y = (radius - 0.05) * this.tamanho;
                            break;
                        case 'IcosahedronWireframe':
                            poligon.position.y = (radius - 0.05) * this.tamanho;
                            break;
                    }
                    if (this.wireframeStatus) {
                        this.meshNumber += 5;
                        objectArray[this.meshNumber].scale.set(this.tamanho, this.tamanho, this.tamanho);
                        objectArray[this.meshNumber].position.y = poligon.position.y;

                    }
                }

                this.updateColor = function () {
                    // removing the objects with the old material color
                    for (let i = 0; i < objectArray.length; i++) {
                        scene.remove(objectArray[i]);
                    }
                    objectArray = new Array();
                    objectMaterial = new THREE.MeshBasicMaterial({ color: controls.cor });
                    objectMaterial.side = THREE.DoubleSide;
                    wireframe = new THREE.LineBasicMaterial({ color: controls.cor });
                    // Recreating those objects
                    criationObjects();

                    this.choosePoligon();

                    this.resizePoligon();

                    // Correcting if the wireframe option is tick
                    this.wireframeController();
                }

                this.wireframeController = function () {
                    if (this.wireframe) {
                        objectArray[this.meshNumber].visible = false;
                        if (this.meshNumber < 5) {
                            this.meshNumber += 5;
                        }
                        objectArray[this.meshNumber].visible = true;
                        objectArray[this.meshNumber].scale.set(this.tamanho, this.tamanho, this.tamanho);
                        this.wireframeStatus = true;
                    } else {
                        objectArray[this.meshNumber].visible = false;
                        if (this.meshNumber > 4) {
                            this.meshNumber -= 5;
                        }
                        objectArray[this.meshNumber].visible = true;
                        objectMaterial.visible = true;
                        this.wireframeStatus = false;
                    }
                    this.choosePoligon();
                    this.resizePoligon();
                }
            }

            // GUI de controle e ajuste de valores especificos da geometria do objeto
            var gui = new dat.GUI();

            var guiFolder = gui.addFolder("Propriedades");
            guiFolder.open();                                       // Open the folder
            /*guiFolder.add(controls, "axes").listen().onChange(function(e) {
                if (controls.axes) {
                    axes.visible = true;
                } else {
                    axes.visible = false;
                }
            });*/

            /*guiFolder.add(controls, "rotX", -60, 60).listen().onChange(function(e){
                controls.mesh.rotation.x = (degreesToRadians(controls.rotX));
            });
            guiFolder.add(controls, "rotY", -60, 60).listen().onChange(function(e){
                controls.mesh.rotation.y = (degreesToRadians(controls.rotY));
            });
            guiFolder.add(controls, "rotZ", -60, 60).listen().onChange(function(e){
                controls.mesh.rotation.z = (degreesToRadians(controls.rotZ));
            });*/

            guiFolder.addColor(controls, 'cor').onChange(function (e) {
                controls.updateColor();
            });
            guiFolder.add(controls, 'wireframe').listen().onChange(function (e) {
                controls.wireframeController();
            });
            guiFolder.add(controls, 'tipo', ['Tetraedro', 'Cubo', 'Octaedro', 'Dodecaedro', 'Icosaedro']).onChange(function (e) {
                if (this.wireframeStatus) {
                    this.meshNumber -= 5;
                }
                controls.choosePoligon();
                controls.resizePoligon()
            });
            guiFolder.add(controls, 'tamanho', 0.5, 4).listen().onChange(function (e) {
                controls.resizePoligon()
            })
            controls.wireframeController();
            controls.choosePoligon(); // Update de selection of the polygon

            // 4 faces
            function createTetrahedron(radius, detail) {
                var geometry = new THREE.TetrahedronGeometry(radius, detail);
                var object = new THREE.Mesh(geometry, objectMaterial);
                object.position.set(0.0, radius / 3, 0.0); //Color Axe (Red, Green, Blue)

                //Set rotation
                object.rotation.x = degreesToRadians(-41.12);
                object.rotation.y = degreesToRadians(-42.26);
                object.rotation.z = degreesToRadians(0.1);

                object.visible = false;
                object.name = "Tetraedro";

                // Border -- Black line
                var geo = new THREE.EdgesGeometry(object.geometry);
                var mat = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.4 });
                var borderLine = new THREE.LineSegments(geo, mat);
                borderLine.renderOrder = 1; // make sure wireframes are rendered 2nd
                borderLine.name = "borderLine";
                object.add(borderLine);

                objectArray.push(object);
                return object;
            }

            // 6 faces
            function createCube(s) {
                let geometry = new THREE.BoxGeometry(s, s, s);
                let object = new THREE.Mesh(geometry, objectMaterial);
                object.position.set(0.0, s / 2, 0.0);
                object.visible = false;
                object.name = "Cubo";

                // Border
                var geo = new THREE.EdgesGeometry(object.geometry);
                var mat = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.4 });
                var borderLine = new THREE.LineSegments(geo, mat);
                borderLine.renderOrder = 1; // make sure wireframes are rendered 2nd
                borderLine.name = "borderLine";
                borderLine.transparent = false;
                object.add(borderLine);

                objectArray.push(object);
                return object;
            }

            // 8 faces
            function createOctahedron(radius, detail) {
                var geometry = new THREE.OctahedronGeometry(radius, detail);
                var object = new THREE.Mesh(geometry, objectMaterial);
                object.position.set(0.0, radius, 0.0);
                object.visible = false;
                object.name = "Octaedro";

                // Border
                var geo = new THREE.EdgesGeometry(object.geometry);
                var mat = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.4 });
                var borderLine = new THREE.LineSegments(geo, mat);
                borderLine.renderOrder = 1; // make sure wireframes are rendered 2nd
                borderLine.name = "borderLine";
                object.add(borderLine);

                objectArray.push(object);
                return object;
            }

            // 12 faces
            function createDodecahedron(radius, detail) {
                var geometry = new THREE.DodecahedronGeometry(radius, detail);
                var object = new THREE.Mesh(geometry, objectMaterial);
                object.position.set(0.0, radius, 0.0);
                object.visible = false;
                object.name = "Dodecaedro";

                // Border
                var geo = new THREE.EdgesGeometry(object.geometry);
                var mat = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.4 });
                var borderLine = new THREE.LineSegments(geo, mat);
                borderLine.renderOrder = 1; // make sure wireframes are rendered 2nd
                borderLine.name = "borderLine";
                object.add(borderLine);

                objectArray.push(object);
                return object;
            }

            // 20 faces
            function createIcosahedron(radius, detail) {
                let geometry = new THREE.IcosahedronGeometry(radius, detail);
                let object = new THREE.Mesh(geometry, objectMaterial);
                object.position.set(0.0, radius - 0.05, 0.0);
                object.visible = false;
                object.name = "Icosaedro";

                // Border
                var geo = new THREE.EdgesGeometry(object.geometry);
                var mat = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.4 });
                var borderLine = new THREE.LineSegments(geo, mat);
                borderLine.renderOrder = 1; // make sure wireframes are rendered 2nd
                borderLine.name = "borderLine";
                object.add(borderLine);

                objectArray.push(object);
                return object;
            }


            // 4 faces
            function createTetrahedronWireframe(radius, detail) {

                let edges = new THREE.EdgesGeometry(new THREE.TetrahedronGeometry(radius, detail));
                let object = new THREE.LineSegments(edges, wireframe);
                object.material.linewidth = 2;
                object.castShadow = true;
                object.position.set(0.0, radius / 3, 0.0); //Color Axe (Red, Green, Blue)
                object.visible = false;
                object.name = "TetrahedronWireframe";
                objectArray.push(object);

                object.rotation.x = degreesToRadians(-41.12);
                object.rotation.y = degreesToRadians(-42.26);
                object.rotation.z = degreesToRadians(0.1);

                return object;
            }

            // 6 faces
            function createCubeWireframe(s) {
                let edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(s, s, s));
                let object = new THREE.LineSegments(edges, wireframe);
                object.castShadow = true;
                object.position.set(0.0, s / 2, 0.0);
                object.name = "CubeWireframe";
                object.visible = false;
                objectArray.push(object);
                return object;
            }

            // 8 faces
            function createOctahedronWireframe(radius, detail) {
                const edges = new THREE.EdgesGeometry(new THREE.OctahedronGeometry(radius, detail));
                const edgesMesh = new THREE.LineSegments(edges, wireframe);
                edgesMesh.castShadow = true;
                edgesMesh.position.set(0.0, radius, 0.0);
                edgesMesh.name = "OcatahedronWireframe";
                edgesMesh.visible = false;
                objectArray.push(edgesMesh);
                return edgesMesh;
            }

            // 12 faces
            function createDodecahedronWireframe(radius, detail) {
                const edges = new THREE.EdgesGeometry(new THREE.DodecahedronGeometry(radius, detail));
                const edgesMesh = new THREE.LineSegments(edges, wireframe);
                edgesMesh.castShadow = true;
                edgesMesh.position.set(0.0, radius, 0.0);
                edgesMesh.name = "DodecahedronWireframe";
                edgesMesh.visible = false;
                objectArray.push(edgesMesh);
                return edgesMesh;
            }

            // 20 faces
            function createIcosahedronWireframe(radius, detail) {
                const edges = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(radius, detail));
                const edgesMesh = new THREE.LineSegments(edges, wireframe);
                edgesMesh.castShadow = true;
                edgesMesh.position.set(0.0, radius, 0.0);
                edgesMesh.name = "IcosahedronWireframe";
                edgesMesh.visible = false;
                objectArray.push(edgesMesh);
                return edgesMesh;
            }



            ////////////////////////////////////////////////////////////////////////////////
            //          Handler arToolkitSource
            ////////////////////////////////////////////////////////////////////////////////

            var arToolkitSource = new THREEx.ArToolkitSource({
                // to read from the webcam
                sourceType: 'webcam',

                // // to read from an image
                // sourceType : 'image',
                // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/images/img.jpg',

                // to read from a video
                // sourceType : 'video',
                // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/videos/headtracking.mp4',

                // resolution of at which we initialize the source image
                //sourceWidth: 640,   //640
                //sourceHeight: 480,  // 480

                // resolution displayed for the source
                //displayWidth: 640,  //window.innerWidth,
                //displayHeight: 480//window.innerHeight

            })

            arToolkitSource.init(function onReady() {
                // Esse timeout força a interface de AR se redimensionar com base no tempo passado
                setTimeout(onResize, 1000);
            });

            // handle resize
            window.addEventListener('resize', function () {
                onResize();
            });

            function onResize() {
                arToolkitSource.onResizeElement();
                arToolkitSource.copyElementSizeTo(renderer.domElement);
                if (arToolkitContext.arController !== null) {
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
            arToolkitContext.init(function onCompleted() {
                // copy projection matrix to camera
                camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
            });

            ////////////////////////////////////////////////////////////////////////////////
            //          Create a ArMarkerControls
            ////////////////////////////////////////////////////////////////////////////////

            // init controls for camera
            var markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
                type: 'pattern',
                patternUrl: THREEx.ArToolkitContext.baseURL + 'data/data/patt.hiro',
                // patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji',
                // as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
                changeMatrixMode: 'cameraTransformMatrix'
            });

            // as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
            scene.visible = false;

            //////////////////////////////////////////////////////////////////////////////////
            //		Rendering of camera and solids
            //////////////////////////////////////////////////////////////////////////////////

            function updateAR() {
                if (arToolkitSource.ready === false) return;

                arToolkitContext.update(arToolkitSource.domElement);

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
            break;
    }

 
}