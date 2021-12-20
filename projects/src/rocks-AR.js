/******************************
 *                            *
 *  MEDIUM QUALITY TEXTURES   *
 *                            *
 *****************************/

function mainMediumQuality(lang, quality) 
{
    console.log("Medium Quality of the textures");

    // It's necessary to create renderer before than load Assets because they use the renderer
    var renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);            //Improve Ratio of pixel in function of the of device
    renderer.setSize(window.innerWidth, window.innerHeight); //640, 480
    const rockParam = {
        limeSize: 0.025,
        basaSize:  0.025,
        granSize:  0.350,
        slatSize:  0.250,
        marbSize:  0.020,
        defaultDirectLight: 1,
        basaltLight: 6,
        slateLight: 3,        
        graniteLight: 2,                
    };

    const usRocks = {
        calcario: "Limestone",
        basalto:  "Basalt",
        granito:  "Granite",
        ardosia:  "Slate",
        marmore:  "Marble"
    };

    const brRocks = {
        calcario: "Calcario",
        basalto:  "Basalto",
        granito:  "Granito",
        ardosia:  "Ardosia",
        marmore:  "Marmore"
    };

    const usTexts = {
        folderName: "Properties",
        axis: "Axes",
        size: "Object Size",
        type: "Type"
    };    

    const brTexts = {
        folderName: "Parâmetros",
        axis: "Eixos",
        size: "Tamanho do Objeto",
        type: "Tipo de Rocha"
    }; 

    const highPaths = {
        calcario: 'assets/models/rocks/limestone.glb',
        basalto:  'assets/models/rocks/basalt.glb',
        granito:  'assets/models/rocks/granite.glb',
        ardosia:  'assets/models/rocks/slate.glb',
        marmore: 'assets/models/rocks/marble.glb',
    }

    const lowPaths = {
        calcario: 'assets...',
        /* COMPLETAR AQUI OS CAMINHOS DE BAIXA QUALIDADE */
    }

    // Default paths
    var paths = highPaths;
    if(quality == "low") path = lowPaths;

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
                path: paths.calcario,
                fileSize: 23521,
            },
            basalto: {
                path: paths.basalto,
                fileSize: 24647,
            },
            granito: {
                path: paths.granito,
                fileSize: 32702,
            },
            ardosia: {
                path: paths.ardosia,
                fileSize: 13302,
            },
            marmore: {
                path: paths.marmore,
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
        
        // Setting Camera
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        scene.add(camera);

        //  Setting the Lights
        var light = new THREE.DirectionalLight(0xffffff, 1);
        camera.add(light); 

        var ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);

        // Show axes (parameter is size of each axis)
        var axesHelper = new THREE.AxesHelper( 1 );
            axesHelper.visible = false;
        scene.add( axesHelper );
        var scale = 0;

        function insertSolarObjectsOnScene(objectArray){
            calcario = ASSETS.objects.calcario;
            scale = rockParam.limeSize;
            calcario.scale.set(scale, scale, scale);
            calcario.visible = true;
            objectArray.push(calcario);
            scene.add(calcario);
        
            basalto = ASSETS.objects.basalto;
            scale = rockParam.basaSize;
            basalto.scale.set(scale, scale, scale);
            basalto.rotation.set(0, Math.PI / 4, 0);            
            basalto.visible = false;
            objectArray.push(basalto);
            scene.add(basalto)
        
            granito = ASSETS.objects.granito;
            scale = rockParam.granSize;            
            granito.scale.set(scale, scale, scale);
            granito.rotation.set(0, -Math.PI / 12, 0);
            granito.visible = false;
            objectArray.push(granito);
            scene.add(granito)
        
            ardosia = ASSETS.objects.ardosia;
            scale = rockParam.slatSize;            
            ardosia.scale.set(scale, scale, scale);
            ardosia.rotation.set(-Math.PI / 6, -Math.PI / 6, 0);
            ardosia.visible = false;
            objectArray.push(ardosia);
            scene.add(ardosia)
        
            marmore = ASSETS.objects.marmore;
            scale = rockParam.marbSize;            
            marmore.scale.set(scale, scale, scale);
            //marmore.position.set(0, 0.04, 0);
            marmore.visible = false;
            objectArray.push(marmore);
            scene.add(marmore)
        }
    
        // Add objects to scene
        var objectArray = new Array();
    
        // Creating de planets and stars
        insertSolarObjectsOnScene(objectArray);

        var rocks = usRocks; // Default
        var interfaceTexts = usTexts;

        // Language selector (link address)
        switch (lang) 
        {
            case "en-US":
                rocks = usRocks;  
                interfaceTexts = usTexts;
                break;
            case "pt-BR":
                rocks = brRocks;  
                interfaceTexts = brTexts;                
                break;
        }

        var controls = new function () 
        {
            // Geometry
            this.meshNumber = 0;
            this.mesh = objectArray[this.meshNumber];
            this.size = 1;
            this.type = rocks.calcario;
            this.axes = false;

            this.chooseObject = function () {
                objectArray[this.meshNumber].visible = false;
                light.intensity = rockParam.defaultDirectLight;
                switch (this.type) {
                    case rocks.calcario: // Limestone
                        this.meshNumber = 0;
                        break;
                    case rocks.basalto: // Basalt
                        this.meshNumber = 1;
                        light.intensity = rockParam.basaltLight;
                        break;
                    case rocks.granito: // Granite
                        this.meshNumber = 2;
                        light.intensity = rockParam.graniteLight;                        
                        break;
                    case rocks.ardosia: // Slate
                        this.meshNumber = 3;
                        light.intensity = rockParam.slateLight;                        
                        break;
                    case rocks.marmore: // Marble
                        this.meshNumber = 4;
                        break;
                }
                objectArray[this.meshNumber].visible = true;
                var mesh = objectArray[this.meshNumber]
                var meshBounds = new THREE.Box3().setFromObject( mesh );
                mesh.translateY(-1*meshBounds.min.y)                            
                this.resize();
            }

            this.resize = function () {
                var mesh, meshBounds, objectSize;
                switch(this.meshNumber)
                {                                                            
                    case 0: 
                        objectSize = rockParam.limeSize;
                        break;
                    case 1: 
                        objectSize = rockParam.basaSize;
                        break;
                    case 2: 
                        objectSize = rockParam.granSize;                        
                        break;
                    case 3:
                        objectSize = rockParam.slatSize;
                        break;
                    case 4: 
                        objectSize = rockParam.marbSize;
                        break;
                }
                mesh = objectArray[this.meshNumber];
                mesh.scale.set(this.size * objectSize, this.size * objectSize, this.size * objectSize);                                  
                meshBounds = new THREE.Box3().setFromObject( mesh );
                mesh.translateY(-1*meshBounds.min.y);
            }
        }

        // GUI de controle e ajuste de valores especificos da geometria do objeto
        var gui = new dat.GUI();

        var guiFolder = gui.addFolder( interfaceTexts.folderName);
        guiFolder.open(); // Open the folder

        guiFolder.add(controls, "axes").listen().onChange(function(e) {
            if (controls.axes) {
                axesHelper.visible = true;
            } else {
                axesHelper.visible = false;
            }
        }).name(interfaceTexts.axis);

        guiFolder.add(controls, "size", 1, 3).listen().onChange(function (e) {
            controls.resize();
        }).name(interfaceTexts.size);

        guiFolder.add(controls, 'type', [rocks.calcario, rocks.basalto, rocks.granito, rocks.ardosia, rocks.marmore]).onChange(function (e) {
            controls.chooseObject();
        }).name(interfaceTexts.type);

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
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }
        ls.remove(render);   // Remove the interface of loading and play loop of render
    }
}