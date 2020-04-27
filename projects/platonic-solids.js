function init(){
    // use the defaults
    //var stats = initStats();
    //var stats = new Stats();
    //stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    //document.getElementById("webgl-output").appendChild(stats.dom);

    // use the defaults
    var renderer = initRenderer();
    var stats = initStats();
    var camera = initCamera(new THREE.Vector3(0, 20, 40));
    var trackballControls = initTrackballControls(camera, renderer);
    var clock = new THREE.Clock();

    var axisHelper = new THREE.AxesHelper(10);

    // create a scene, that will hold all our elements such as objects, cameras and lights.
    // and add some simple default lights
    var scene = new THREE.Scene();
    var groundPlane = addGroundPlane(scene);
    initDefaultLighting(scene);
    scene.add(new THREE.AmbientLight(0x444444));
    scene.add(axisHelper);

    // create a scene, that will hold all our elements such as objects, cameras and lights.
    // and add some simple default lights
    //var scene = new THREE.Scene();

    var controls = new function () {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
    };

    var gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'bouncingSpeed', 0, 0.5);
    
    render();
    function render() {
        stats.update();
        trackballControls.update(clock.getDelta());
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
}