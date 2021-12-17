function mainMediumQuality(lang) {
    console.log("Medium Quality of the textures");

    // It's necessary to create renderer before than load Assets because they use the renderer
    var renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);            //Improve Ratio of pixel in function of the of device
    renderer.setSize(window.innerWidth, window.innerHeight); //640, 480
    const SIZE = {
        calario: 0.025,
        calcarioY: 1,
        basalto: 0.025,
        basaltoY: 30,
        granito: 0.5,
        granitoY: 1,
        ardosia: 0.25,
        ardosia: 1,
        marmore: 0.02,
        marmoreY: 0.04
    };
    // Adiciona a saída do renderizador para um elemento da página HTML
    document.getElementById("webgl-output").appendChild(renderer.domElement);

    // Load all elements before the execution 
    var ASSETS = {
        textures: {
            helper: {
                path: 'assets/textures/loader-helper.jpg',
                fileSize: 23521 + 24647 + 32702 + 13302 + 26344, 
            }
        },
        geometries: {
            sphereGeometry: new THREE.SphereGeometry(1, 20, 20),
        },
        materials: {
            sphereMaterial: new THREE.MeshPhongMaterial({ color: 0x0D8CFF, transparent: true, opacity: 0.5, wireframe: false })
        },
    
        objects: {
            calcario: {
                path: 'assets/models/rocks/limestone_low.glb',

                fileSize: 23521,
            },
            basalto: {
                path: 'assets/models/rocks/basalt_low.glb',

                fileSize: 24647,
            },
            granito: {
                path: 'assets/models/rocks/granite_low.glb',
                fileSize: 32702,
            },
            ardosia: {
                path: 'assets/models/rocks/slate_low.glb',
                fileSize: 13302,
            },
            marmore: {
                path: 'assets/models/rocks/marble_low.glb',
                fileSize: 26344,
            }
        }
    };

    // Loading Screen
    var ls = new LoadScreen(renderer,{type:'stepped-circular-fancy-offset', progressColor:'#f80',infoStyle:{padding:'0'}}).onComplete(setScene).start(ASSETS);

    function setScene(){
        console.log("Elements loaded");

        // use the defaults
        // use the basic elements
        var scene = new THREE.Scene();  // Create main scene;
        var clock = new THREE.Clock();
        
        // Setting Camera
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.lookAt(0, 0, 0);
        camera.position.set(5, 15, 50);
        camera.up.set(0, 1, 0);
        scene.add(camera);

        //  Setting the Lights

   

        var light = new THREE.DirectionalLight(0xffffff, 1.8);
        camera.add(light); 

        function insertSolarObjectsOnScene(objectArray){
            calcario = ASSETS.objects.calcario;
            calcario.scale.set(0.025, 0.025, 0.025);
            calcario.position.set(0, 0, 0);
            calcario.rotation.set(0, -Math.PI / 12, 0);
            calcario.visible = false;
            objectArray.push(calcario);
            scene.add(calcario);
        
            basalto = ASSETS.objects.basalto;
            basalto.scale.set(0.025, 0.025, 0.025);
            basalto.position.set(0, 0, 0);
            basalto.visible = true;
            objectArray.push(basalto);
            scene.add(basalto)
        
            granito = ASSETS.objects.granito;
            granito.scale.set(0.5, 0.5, 0.5);
            granito.position.set(0, 0, 0);
            granito.rotation.set(0, -Math.PI / 12, 0);
            granito.visible = false;
            objectArray.push(granito);
            scene.add(granito)
        
            ardosia = ASSETS.objects.ardosia;
            ardosia.scale.set(0.25, 0.25, 0.25);
            ardosia.position.set(0, 0, 0);
            ardosia.rotation.set(0, -Math.PI / 6, 0);
            ardosia.visible = false;
            objectArray.push(ardosia);
            scene.add(ardosia)
        
            marmore = ASSETS.objects.marmore;
            marmore.scale.set(0.02, 0.02, 0.02);
            marmore.position.set(0, 0.04, 0);
            marmore.visible = false;
            objectArray.push(marmore);
            scene.add(marmore)
        }
    
        // Add objects to scene
        var objectArray = new Array();
    
        // Creating de planets and stars
        insertSolarObjectsOnScene(objectArray);
    
        // Controls of sidebar

        switch (lang) {
            case "en-US":
                {
                    var controls = new function () {

                        // Geometry
                        this.meshNumber = 1;//4;
                        this.mesh = objectArray[this.meshNumber];
                        this.size = 1;
                        this.type = "Basalt";//"Earth";

                        this.chooseObject = function () {
                            objectArray[this.meshNumber].visible = false;
                            switch (this.type) {
                                case 'Basalt':
                                    this.meshNumber = 1;
                                    
                                    break;
                                case 'Limestone':
                                    this.meshNumber = 0;
                                    
                                    break;
                                case 'Granite':
                                    this.meshNumber = 2;
                                    
                                    break;
                                case 'Slate':
                                    this.meshNumber = 3;
                                    
                                    break;
                                case 'Marble':
                                    this.meshNumber = 4;
                                    
                                    break;
                            }
                            objectArray[this.meshNumber].visible = true;
                            this.mesh = objectArray[this.meshNumber];
                            this.resize();
                        }



                        this.resize = function () {
                            switch(this.meshNumber)
                            {
                                case 1: {
                                    objectArray[this.meshNumber].scale.set(this.size * SIZE.basalto,this.size * SIZE.basalto, this.size * SIZE.basalto);
                                    //objectArray[this.meshNumber].position.y = this.size * SIZE.basaltoY;
                                    break;
                                }
                                case 0: {
                                    objectArray[this.meshNumber].scale.set(this.size * SIZE.calario,this.size * SIZE.calario, this.size * SIZE.calario);
                                    //objectArray[this.meshNumber].position.y = -this.size + SIZE.calcarioY;
                                    break;
                                }
                                case 2: {
                                    objectArray[this.meshNumber].scale.set(this.size * SIZE.granito,this.size * SIZE.granito, this.size * SIZE.granito);
                                    //objectArray[this.meshNumber].position.y = -this.size + SIZE.granitoY;
                                    break;
                                }
                                case 3: {
                                    objectArray[this.meshNumber].scale.set(this.size * SIZE.ardosia,this.size * SIZE.ardosia, this.size * SIZE.ardosia);
                                    //objectArray[this.meshNumber].position.y = -this.size * SIZE.ardosia + SIZE.ardosiaY;
                                    break;
                                }
                                case 4: {
                                    objectArray[this.meshNumber].scale.set(this.size * SIZE.marmore,this.size * SIZE.marmore, this.size * SIZE.marmore);
                                    //objectArray[this.meshNumber].position.y = -this.size + SIZE.marmoreY;
                                    break;
                                }
                            }
                            /*
                            objectArray[this.meshNumber].scale.set(this.size, this.size, this.size);

                            objectArray[this.meshNumber].position.y = -this.size + 0.5;
                            */
                        }
                    }

                    // First object is visible

                    // GUI de controle e ajuste de valores especificos da geometria do objeto
                    var gui = new dat.GUI();

                    var guiFolder = gui.addFolder("Properties");
                    guiFolder.open(); // Open the folder

                    guiFolder.add(controls, "size", 1, 4).listen().onChange(function (e) {
                        controls.resize();
                    });

                    guiFolder.add(controls, 'type', ['Basalt', 'Limestone', 'Granite', 'Slate', 'Marble']).onChange(function (e) {
                        controls.chooseObject();
                    });
                    break;
                }
            case "pt-BR":
                {
                    var controls = new function () {

                        // Geometry
                        this.meshNumber = 0;//4;
                        this.mesh = objectArray[this.meshNumber];
                        this.tamanho = 1;
                        this.tipo = "Basalto";//"Earth";

                        this.chooseObject = function () {
                            objectArray[this.meshNumber].visible = false;
                            switch (this.tipo) {
                                case 'Basalto':
                                    this.meshNumber = 0;
                                    break;
                                case 'Calcário':
                                    this.meshNumber = 1;
                                    break;
                                case 'Ganito':
                                    this.meshNumber = 2;
                                    break;
                                case 'Ardósia':
                                    this.meshNumber = 3;
                                    break;
                                case 'Mármore':
                                    this.meshNumber = 4;
                                    break;
                            }
                            objectArray[this.meshNumber].visible = true;
                            this.mesh = objectArray[this.meshNumber];
                            this.resize();
                        }

                        this.resize = function () {
                            switch(this.meshNumber)
                            {
                                case 1: {
                                    objectArray[this.meshNumber].scale.set(this.size * SIZE.basalto,this.size * SIZE.basalto, this.size * SIZE.basalto);
                                    //objectArray[this.meshNumber].position.y = -this.size + SIZE.basaltoY;
                                    break;
                                }
                                case 0: {
                                    objectArray[this.meshNumber].scale.set(this.size * SIZE.calario,this.size * SIZE.calario, this.size * SIZE.calario);
                                    //objectArray[this.meshNumber].position.y = -this.size + SIZE.calcarioY;
                                    break;
                                }
                                case 2: {
                                    objectArray[this.meshNumber].scale.set(this.size * SIZE.granito,this.size * SIZE.granito, this.size * SIZE.granito);
                                    //objectArray[this.meshNumber].position.y = -this.size + SIZE.granitoY;
                                    break;
                                }
                                case 3: {
                                    objectArray[this.meshNumber].scale.set(this.size * SIZE.ardosia,this.size * SIZE.ardosia, this.size * SIZE.ardosia);
                                    //objectArray[this.meshNumber].position.y = -this.size * SIZE.ardosia + SIZE.ardosiaY;
                                    break;
                                }
                                case 4: {
                                    objectArray[this.meshNumber].scale.set(this.size * SIZE.marmore,this.size * SIZE.marmore, this.size * SIZE.marmore);
                                    //objectArray[this.meshNumber].position.y = -this.size + SIZE.marmoreY;
                                    break;
                                }
                            }
                        }
                    }

                    // First object is visible

                    // GUI de controle e ajuste de valores especificos da geometria do objeto
                    var gui = new dat.GUI();

                    var guiFolder = gui.addFolder("Properties");
                    guiFolder.open(); // Open the folder

                    guiFolder.add(controls, "tamanho", 0.5, 4).listen().onChange(function (e) {
                        controls.resize();
                    });

                    guiFolder.add(controls, 'tipo', ['Basalto', 'Calcário', 'Granito', 'Ardósia', 'Mármore']).onChange(function (e) {
                        controls.chooseObject();
                    });
                    break;
                }
        }

    

        ////////////////////////////////////////////////////////////////////////////////
        //          Handler arToolkitSource
        ////////////////////////////////////////////////////////////////////////////////

        var arToolkitSource = new THREEx.ArToolkitSource({
            // to read from the webcam
            sourceType: 'webcam',

        })

        arToolkitSource.init(function onReady() {
            // Esse timeout força a interface de AR se redimensionar com base no tempo passado
            setTimeout(onResize, 1000);
        });

        // handle resize
        window.addEventListener('resize', function() {
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
    
        function render() {
            updateAR();
    
            // Rotating the mesh selected
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }

        ls.remove(render);   // Remove the interface of loading and play loop of render
    }

}