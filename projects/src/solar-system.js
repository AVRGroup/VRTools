function init() {
    // use the defaults
    var scene = new THREE.Scene(); // Create main scene
    var stats = initStats(); // To show FPS information
    var renderer = initRenderer(); // View function in util/utils
    renderer.setClearColor("rgb(30, 30, 40)");
    var textureLoader = new THREE.TextureLoader();

    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.lookAt(0, 0, 0);
    camera.position.set(5, 15, 50);
    camera.up.set(0, 1, 0);
    scene.add(camera);

    var clock = new THREE.Clock();
    
    //  Setting the Lights

    var ambientLight = new THREE.AmbientLight(0x343434);
    ambientLight.name = "ambientLight";
    scene.add(ambientLight);

    var pointlight = new THREE.PointLight({
        color: 0xffffff, 
        intesity: 1, 
        distance: 0,
        decay: 2
    });
    pointlight.position.set(-70, 0, 150 );
    scene.add( pointlight );

    var pointLightSphereGeometry = new THREE.SphereGeometry(3, 50, 50);
    var pointLightSphereMaterial = new THREE.MeshPhongMaterial({color: "white"});
    var pointLightSphere = new THREE.Mesh(pointLightSphereGeometry, pointLightSphereMaterial);
    pointLightSphere.position.copy(pointlight.position);
    scene.add(pointLightSphere);

    // Show axes (parameter is size of each axis)
    var axes = new THREE.AxesHelper(80);
    axes.name = "AXES";
    axes.visible = false;
    scene.add(axes);

    // Enable mouse rotation, pan, zoom etc.
    var orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControls.target.set(0, 0, -1);

    // Skybox of galaxy
    var skyBoxMaterial = new THREE.MeshBasicMaterial({
        map: textureLoader.load("./assets/textures/space/Stars_milky_way.jpg"),               // imagem da terra
        side: 1,        
    });
    var skyBoxGeometry = new THREE.SphereGeometry(300, 50, 50);
    var skyBox = new THREE.Mesh(skyBoxGeometry,skyBoxMaterial);
    skyBox.color =  "white";
    scene.add(skyBox);

    function createSolarObjects(objectArray){
        // Sun
        var sunMaterial = new THREE.MeshPhongMaterial({
            map: textureLoader.load("./assets/textures/space/sun.jpg"),  
            normalScale: new THREE.Vector2(6, 6),
        });
        var sunGeometry = new THREE.SphereGeometry(12, 50, 50);
        var sun = new THREE.Mesh(sunGeometry, sunMaterial);
        sun.rotation.y = (1/6) * Math.PI;
        objectArray.push(sun);
        sun.visible = false;
        scene.add(sun);

        // Mercury
        var mercuryMaterial = new THREE.MeshPhongMaterial({
            map: textureLoader.load("./assets/textures/space/mercury.jpg"),         
            normalScale: new THREE.Vector2(6, 6),
        });
        var mercuryGeometry = new THREE.SphereGeometry(12, 50, 50);
        var mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
        mercury.rotation.y = (1/6) * Math.PI;
        objectArray.push(mercury);
        mercury.visible = false;
        scene.add(mercury);

        // Venus
        var venusMaterial = new THREE.MeshPhongMaterial({
            map: textureLoader.load("./assets/textures/space/venus_surface.jpg"),         
            normalScale: new THREE.Vector2(6, 6),
        });
        var venusGeometry = new THREE.SphereGeometry(12, 50, 50);
        var venus = new THREE.Mesh(venusGeometry, venusMaterial);
        venus.rotation.y = (1/6) * Math.PI;
        objectArray.push(venus);
        venus.visible = false;
        scene.add(venus);

        // Moon
        var moonMaterial = new THREE.MeshPhongMaterial({
            map: textureLoader.load("./assets/textures/space/moon.jpg"),   
            normalScale: new THREE.Vector2(6, 6),
        });
        var moonGeometry = new THREE.SphereGeometry(12, 50, 50);
        var moon = new THREE.Mesh(moonGeometry, moonMaterial);
        moon.rotation.y = (1/6) * Math.PI;
        objectArray.push(moon);
        moon.visible = false;
        scene.add(moon);

        // Earth
        var earthMaterial = new THREE.MeshPhongMaterial({
            map: textureLoader.load("./assets/textures/space/Earth.jpg"),               // imagem da terra
            normalMap: textureLoader.load("assets/textures/space/earth_normal_map.tif"), // mapeamento das normais
            specularMap: textureLoader.load("assets/textures/space/EarthSpec.tif"),     // mapeamento da luz especular(Reflexão)
            normalScale: new THREE.Vector2(6, 6),
            color: "white",
        });
        var earthGeometry = new THREE.SphereGeometry(12, 200, 200);
        var earth = new THREE.Mesh(earthGeometry, earthMaterial);
        earth.rotation.y = (1/6) * Math.PI;
        objectArray.push(earth);
        earth.visible = false;
        scene.add(earth);

        // Mars
        var marsMaterial = new THREE.MeshPhongMaterial({
            map: textureLoader.load("./assets/textures/space/mars.jpg"),         
            normalScale: new THREE.Vector2(6, 6),
        });
        var marsGeometry = new THREE.SphereGeometry(12, 50, 50);
        var mars = new THREE.Mesh(marsGeometry, marsMaterial);
        mars.rotation.y = (1/6) * Math.PI;
        objectArray.push(mars);
        mars.visible = false;
        scene.add(mars);

        // Jupiter
        var JupiterMaterial = new THREE.MeshPhongMaterial({
            map: textureLoader.load("./assets/textures/space/jupiter.jpg"),         
            normalScale: new THREE.Vector2(6, 6),
        });
        var jupiterGeometry = new THREE.SphereGeometry(12, 50, 50);
        var jupiter = new THREE.Mesh(jupiterGeometry, JupiterMaterial);
        jupiter.rotation.y = (1/6) * Math.PI;
        objectArray.push(jupiter);
        jupiter.visible = false;
        scene.add(jupiter);

        // Saturn
        var saturnMaterial = new THREE.MeshPhongMaterial({
            map: textureLoader.load("./assets/textures/space/saturn.jpg"),         
            normalScale: new THREE.Vector2(6, 6),
        });
        var saturnGeometry = new THREE.SphereGeometry(12, 50, 50);
        var saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
        saturn.rotation.y = (1/6) * Math.PI;
        objectArray.push(saturn);
        saturn.visible = false;
        scene.add(saturn);

        // Saturn ring

        // ADD LATER

        // Uranus
        var uranusMaterial = new THREE.MeshPhongMaterial({
            map: textureLoader.load("./assets/textures/space/uranus.jpg"),         
            normalScale: new THREE.Vector2(6, 6),
        });
        var uranusGeometry = new THREE.SphereGeometry(12, 50, 50);
        var uranus = new THREE.Mesh(uranusGeometry, uranusMaterial);
        uranus.rotation.y = (1/6) * Math.PI;
        objectArray.push(uranus);
        uranus.visible = false;
        scene.add(uranus);

        // Neptune
        var neptuneMaterial = new THREE.MeshPhongMaterial({
            map: textureLoader.load("./assets/textures/space/neptune.jpg"),         
            normalScale: new THREE.Vector2(6, 6),
        });
        var neptuneGeometry = new THREE.SphereGeometry(12, 50, 50);
        var neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial);
        neptune.rotation.y = (1/6) * Math.PI;
        objectArray.push(neptune);
        neptune.visible = false;
        scene.add(neptune);
    }

    // Add objects to scene
    var objectArray = new Array();

    // Creating de planets and stars
    createSolarObjects(objectArray);

    // Controls of sidebar
    var controls = new function() {
        var self = this;

        // Axes
        this.axes = false;

        // Physics
        this.rotation = 0.01;

        // Geometry
        this.meshNumber = 4;
        this.mesh = objectArray[this.meshNumber];
        this.radius = 10;
        this.detail = 0;
        this.size = 1.0;
        this.type = "Earth";

        this.chooseObject = function() {
            objectArray[this.meshNumber].visible = false;
            switch (this.type) {
                case 'Sun':
                    this.meshNumber = 0;
                    break;
                case 'Mercury':
                    this.meshNumber = 1;
                    break;
                case 'Venus':
                    this.meshNumber = 2;
                    break;
                case 'Moon':
                    this.meshNumber = 3;
                    break;
                case 'Earth':
                    this.meshNumber = 4;
                    break;
                case 'Mars':
                    this.meshNumber = 5;
                    break;
                case 'Jupiter':
                    this.meshNumber = 6;
                    break;
                case 'Saturn':
                    this.meshNumber = 7;
                    break;
                case 'Uranus':
                    this.meshNumber = 8;
                    break;
                case 'Neptune':
                    this.meshNumber = 9;
                    break;
            }
            objectArray[this.meshNumber].visible = true;
            this.mesh = objectArray[this.meshNumber];
        }
    }

    // Firs object is visible
    controls.mesh.visible = true;

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

    guiFolder.add(controls, 'type', ['Sun', 'Mercury', 'Venus', 'Moon', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']).onChange(function(e) {
        controls.chooseObject();
    });

      // Reajuste da renderização com base na mudança da janela
    function onResize(){
        camera.aspect = window.innerWidth / window.innerHeight;  //Atualiza o aspect da camera com relação as novas dimensões
        camera.updateProjectionMatrix();                         //Atualiza a matriz de projeção
        renderer.setSize(window.innerWidth, window.innerHeight); //Define os novos valores para o renderizador
        //console.log('Resizing to %s x %s.', window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', onResize, false);         // Ouve os eventos de resize

    render();

    function render() {
        stats.update();
        orbitControls.update();                 // Atualiza o controle da câmera

        // Rotating the mesh selected
        /*controls.mesh.rotation.x += controls.rotation;
        controls.mesh.rotation.y += controls.rotation;
        controls.mesh.rotation.z += controls.rotation;*/
        controls.mesh.rotation.y -= controls.rotation;
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
}