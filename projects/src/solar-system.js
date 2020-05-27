function init() {
    // use the defaults
    var scene = new THREE.Scene(); // Create main scene
    var stats = initStats(); // To show FPS information
    var renderer = initRenderer(); // View function in util/utils
    renderer.setClearColor("rgb(30, 30, 40)");
    var textureLoader = new THREE.TextureLoader();

    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.lookAt(0, 0, 0);
    camera.position.set(5, 15, 30);
    camera.up.set(0, 1, 0);
    scene.add(camera);

    var clock = new THREE.Clock();
    
    // Light
    var spotLight = new THREE.SpotLight(0xffffff);
    //spotLight.position.set(10, 80, 150);
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    spotLight.shadow.camera.fov = 20;
    spotLight.castShadow = true;
    spotLight.decay = 2;
    spotLight.penumbra = 0.05;
    spotLight.name = "spotLight"

    scene.add(spotLight);


    var ambientLight = new THREE.AmbientLight(0x343434);
    ambientLight.name = "ambientLight";
    scene.add(ambientLight);

    var spotLightSphereGeometry = new THREE.SphereGeometry(3, 50, 50);
    var spotLightSphereMaterial = new THREE.MeshPhongMaterial({color: "white"});
    var spotLightSphere = new THREE.Mesh(spotLightSphereGeometry, spotLightSphereMaterial);
    spotLightSphere.position.set(0, 0, 150);
    spotLightSphere.add(spotLight);
    //spotLightSphere.position.copy(spotLight.position);
    scene.add(spotLightSphere);

    console.log(spotLightSphere);

    // Show axes (parameter is size of each axis)
    var axes = new THREE.AxesHelper(80);
    axes.name = "AXES";
    axes.visible = false;
    scene.add(axes);
    

    // Enable mouse rotation, pan, zoom etc.
    var trackballControls = initTrackballControls(camera, renderer);

    // Skybox of galaxy
    var skyBoxMaterial = new THREE.MeshBasicMaterial({
        map: textureLoader.load("./assets/textures/space/Stars_milky_way.jpg"),               // imagem da terra
        side: 1,        
    });

    var skyBoxGeometry = new THREE.SphereGeometry(200, 50, 50);
    //var sphere1 = addGeometryWithMaterial(scene, sphere, 'sphere', gui, controls, skyBoxMaterial.clone());

    var skyBox = new THREE.Mesh(skyBoxGeometry,skyBoxMaterial);
    skyBox.color =  "white";
    skyBox.castShadow = true;
    skyBox.receiveShadow = true;
    
    scene.add(skyBox);
    console.log(skyBox);


    // Earth
    var earthMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load("./assets/textures/space/Earth.jpg"),               // imagem da terra
        normalMap: textureLoader.load("assets/textures/space/Earth-normal-8k.dds"),     // mapeamento das normais
        specularMap: textureLoader.load("assets/textures/space/EarthSpec.tif"),     // mapeamento da luz especular(Reflexão)
        normalScale: new THREE.Vector2(164, 82), //6,6
        color: "white",
        //flatShading: false,
        //side: THREE.frontSide
    });
    /*var earthMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load("./assets/textures/space/earth/Earth.png"),               // imagem da terra
        normalMap: textureLoader.load("assets/textures/space/earth/EarthNormal.png"),     // mapeamento das normais
        specularMap: textureLoader.load("assets/textures/space/earth/EarthSpec.png"),     // mapeamento da luz especular(Reflexão)
        normalScale: new THREE.Vector2(6, 6), //6,6
        color: "white",
        //flatShading: false,
        //side: THREE.frontSide
    });*/

    /*var earthMaterial = new THREE.MeshPhongMaterial({
        color: "blue",
        //side: THREE.frontSide
    });*/
  
    //console.log(skyBoxMaterial);
    var earthGeometry = new THREE.SphereGeometry(12, 200, 200);
    //var sphere1 = addGeometryWithMaterial(scene, sphere, 'sphere', gui, controls, skyBoxMaterial.clone());

    var earth = new THREE.Mesh(earthGeometry, earthMaterial);
    //mesh.castShadow = true;
    
    scene.add(earth);
    console.log(earthMaterial);
    //earth.material.flatShading = false;
    //earth.material.needsUpdate = true;
    //addBasicMaterialSettings(gui, controls, material, name + '-THREE.Material');
    //addSpecificMaterialSettings(gui, controls, material, name + '-Material');

    earth.rotation.y = (1/6) * Math.PI;

    // Object Material for all objects
    var objectMaterial = new THREE.MeshPhongMaterial({ color: "rgb(255, 0, 0)" });

    // Add objects to scene
    var objectArray = new Array();

    // Controls of sidebar
    var controls = new function() {
        var self = this;

        // Axes
        this.axes = false;

        // Inicia a geometria e material de base a serem controlados pelo menu interativo
        //this.appliedMaterial = applyMeshNormalMaterial;
        this.castShadow = true;
        this.groundPlaneVisible = true;

        //Physics
        this.rotation = 0.02;
        this.wireframe = false;
        this.color = "rgb(255, 0, 0)";

        // Geometry
        this.mesh = objectArray[0];
        this.meshNumber = 0;
        this.radius = 10;
        this.detail = 0;
        this.type = 'Tetrahedron';
        this.size = 1.0;

        this.choosePoligon = function() {
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

        this.resizePoligon = function() {
            const poligon = objectArray[this.meshNumber]
            const radius = poligon.name === "Cube" ? poligon.geometry.parameters.height : poligon.geometry.parameters.radius

            poligon.scale.set(this.size, this.size, this.size)
                // console.log(poligon)
            poligon.position.y = radius * this.size * 1.1
        }

        this.updateColor = function() {
            // removing the objects with the old material color
            for (let i = 0; i < objectArray.length; i++) {
                //scene.remove(scene.getObjectByName("particles1"));
                scene.remove(objectArray[i]);
            }
            objectArray = new Array();
            objectMaterial = new THREE.MeshPhongMaterial({ color: controls.color }); // Setting the material with new color

            // Recreating those objects
            scene.add(createCube(5.0));

            // Position of the cube
            objectArray[1].position.y = 5;

            controls.choosePoligon();

            // Correcting if the wireframe option is tick
            this.wireframeController();
        }

        this.wireframeController = function() {
            if (this.wireframe) {
                objectMaterial.wireframe = true;
            } else {
                objectMaterial.wireframe = false;
            }
        }
    }

    // GUI de controle e ajuste de valores especificos da geometria do objeto
    var gui = new dat.GUI();

    var guiFolder = gui.addFolder("Properties");
    guiFolder.open(); // Open the folder
    guiFolder.add(controls, "axes").listen().onChange(function(e) {
        if (controls.axes) {
            axes.visible = true;
        } else {
            axes.visible = false;
        }
    });

    guiFolder.add(controls, 'rotation', 0, 0.5).onChange();
    //gui.add(controls, 'radius', 0, 40).step(1).onChange(controls.redraw);
    //gui.add(controls, 'detail', 0, 3).step(1).onChange(controls.redraw);
    guiFolder.addColor(controls, 'color').onChange(function(e) {
        controls.updateColor();
    });

    guiFolder.add(controls, 'wireframe').listen().onChange(function(e) {
        controls.wireframeController();
    });

    guiFolder.add(controls, 'type', ['Tetrahedron', 'Cube', 'Octahedron', 'Dodecahedron', 'Icosahedron']).onChange(function(e) {
        controls.choosePoligon();
        controls.resizePoligon()
    });

    gui.add(controls, 'size', 0.5, 2).listen().onChange(function(e) {
        controls.resizePoligon()
    });

    


    render();

    function render() {
        stats.update();
        trackballControls.update(clock.getDelta());

        // Rotating the mesh selected
        /*controls.mesh.rotation.x += controls.rotation;
        controls.mesh.rotation.y += controls.rotation;
        controls.mesh.rotation.z += controls.rotation;*/
        earth.rotation.y -= 0.01;
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
}