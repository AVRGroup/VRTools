function startApp(lang, quality) 
{
    if(quality == "high")
        console.log("High Quality textures");
    else
        console.log("Low Quality textures");

    // It's necessary to create renderer before than load Assets because they use the renderer
    var renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
    });
    renderer.outputEncoding = THREE.sRGBEncoding;

    renderer.setPixelRatio(window.devicePixelRatio);            //Improve Ratio of pixel in function of the of device
    renderer.setSize(window.innerWidth, window.innerHeight); //640, 480
    const rockParam = {
        limeSize: 0.025,
        basaSize:  0.025,
        granSize:  0.350,
        slatSize:  0.250,
        marbSize:  0.020, 
        
        limeHigh: 28719,
        basaHigh: 30895,
        granHigh: 33486,
        marbHigh: 26975,
        slatHigh: 23685,
    };

    const usRocks = {
        limestone: "Limestone",
        basalt:  "Basalt",
        granite:  "Granite",
        slate:  "Slate",
        marble:  "Marble"
    };

    const brRocks = {
        limestone: "Calcario",
        basalt:  "Basalto",
        granite:  "Granito",
        slate:  "Ardosia",
        marble:  "Marmore"
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
        limestone: 'assets/models/rocks/limestone.glb',
        basalt:  'assets/models/rocks/basalt.glb',
        granite:  'assets/models/rocks/granite.glb',
        slate:  'assets/models/rocks/slate.glb',
        marble: 'assets/models/rocks/marble.glb',
    }

    const lowPaths = {
        limestone: 'assets/models/rocks/limestone_low.glb',
        basalt:  'assets/models/rocks/basalt_low.glb',
        granite:  'assets/models/rocks/granite_low.glb',
        slate:  'assets/models/rocks/slate_low.glb',
        marble: 'assets/models/rocks/marble_low.glb',
    }

    // Default paths
    var paths = highPaths;
    if(quality == "low") 
    {
        paths = lowPaths;
        rockParam.limeHigh = 1627;
        rockParam.basaHigh = 2095;
        rockParam.granHigh = 2350;
        rockParam.marbHigh = 1799;
        rockParam.slatHigh = 2310;
    }


    // Adiciona a saída do renderizador para um elemento da página HTML
    document.getElementById("webgl-output").appendChild(renderer.domElement);

    // Load all elements before the execution 
    var ASSETS = {
        textures: {
            helper: {
                path: 'assets/textures/loader-helper.jpg',
                fileSize: rockParam.limeHigh + rockParam.basaHigh + rockParam.granHigh + rockParam.marbHigh + rockParam.slatHigh, 
            }
        },
   
        objects: {
            limestone: {
                path: paths.limestone,
                fileSize: rockParam.limeHigh,
            },
            basalt: {
                path: paths.basalt,
                fileSize: rockParam.basaHigh,
            },
            granite: {
                path: paths.granite,
                fileSize: rockParam.granHigh,
            },
            slate: {
                path: paths.slate,
                fileSize: rockParam.slatHigh,
            },
            marble: {
                path: paths.marble,
                fileSize: rockParam.marbHigh,
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
        var defaultSize = 2;
   
        // Add objects to scene
        var objectArray = new Array();
    
        // Creating de planets and stars
        insertObjectsOnScene(objectArray);

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
            this.size = defaultSize; // 2
            this.type = rocks.limestone;
            this.axes = false;

            this.chooseObject = function () {
                objectArray[this.meshNumber].visible = false;
                switch (this.type) {
                    case rocks.limestone: // Limestone
                        this.meshNumber = 0;
                        break;
                    case rocks.basalt: // Basalt
                        this.meshNumber = 1;
                        break;
                    case rocks.granite: // Granite
                        this.meshNumber = 2;
                        break;
                    case rocks.slate: // Slate
                        this.meshNumber = 3;
                        break;
                    case rocks.marble: // Marble
                        this.meshNumber = 4;
                        break;
                }
                mesh = objectArray[this.meshNumber];
                mesh.visible = true;                         
                this.resize();
            }

            this.resize = function () {
                var meshBounds, objectSize;
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
               
                fixObjectPositionAndSize(mesh, this.size * objectSize);                                                          
            }
        }

        function fixObjectPositionAndSize(mesh, size)
        {
            // Põe o objeto na origem antes de fazer a escala            
            meshBounds = new THREE.Box3().setFromObject( mesh );                
            var ySize = Math.abs(meshBounds.max.y-meshBounds.min.y);
            mesh.position.y = -ySize/2.0 + (meshBounds.min.y > 0) ? -meshBounds.min.y : meshBounds.min.y;               

            // Faz a escala e reposiciona objeto após escala
            mesh.scale.set(size, size, size);                                                  
            meshBounds = new THREE.Box3().setFromObject( mesh );
            mesh.position.y += (meshBounds.min.y < 0) ? -meshBounds.min.y : meshBounds.min.y;            
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

        guiFolder.add(controls, 'type', [rocks.limestone, rocks.basalt, rocks.granite, rocks.slate, rocks.marble]).onChange(function (e) {
            controls.chooseObject();
        }).name(interfaceTexts.type);

        function insertObjectsOnScene(objectArray){
            limestone = ASSETS.objects.limestone;
            scale = rockParam.limeSize;
            limestone.scale.set(scale, scale, scale);
            limestone.visible = true;
            objectArray.push(limestone);
            scene.add(limestone);
        
            basalt = ASSETS.objects.basalt;
            scale = rockParam.basaSize;
            basalt.scale.set(scale, scale, scale);          
            basalt.visible = false;
            objectArray.push(basalt);
            scene.add(basalt)
        
            granite = ASSETS.objects.granite;
            scale = rockParam.granSize;            
            granite.scale.set(scale, scale, scale);
            granite.visible = false;
            objectArray.push(granite);
            scene.add(granite)

        
            slate = ASSETS.objects.slate;
            scale = rockParam.slatSize;            
            slate.scale.set(scale, scale, scale);
            slate.visible = false;
            objectArray.push(slate);
            scene.add(slate)
        
            marble = ASSETS.objects.marble;
            scale = rockParam.marbSize;            
            marble.scale.set(scale, scale, scale);
            marble.visible = false;
            objectArray.push(marble);
            scene.add(marble)

            // Acerta posição do primeiro objeto a ser colocado na cena
            fixObjectPositionAndSize(objectArray[0], rockParam.limeSize * defaultSize); 
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
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }
        ls.remove(render);   // Remove the interface of loading and play loop of render
    }
}