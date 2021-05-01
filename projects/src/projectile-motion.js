let rendererStats, renderer, scene, camera, light, controls, labels, gui, clock;

let box, airplane, airplaneRange, trajectory, TrajectoryPath, lookDirection, x, y, t, time, totalTime;
let xPos, xTotalDis, xDis, yTotalDis, yDis; //position and displacement

Physijs.scripts.worker = '../libs/other/physijs/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

const ASSETS = {
    textures: {
        crate: {
            path: 'assets/textures/crate.png',
            fileSize: 119.437 + 4200
        },
        skyBoxMap: {
            path: 'assets/textures/cloud.jpg',
            fileSize: 1065.362
        },
        grass: {
            path: 'assets/textures/grass.png',
            fileSize: 836.528
        }
    },
    materials: {
        cubeMaterial: new THREE.MeshPhongMaterial(),
        lineMaterial: new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 4 }),
        groundMaterial: new THREE.MeshStandardMaterial({ color: 0x77FF99, }),
        skyBoxMaterial: new THREE.MeshBasicMaterial({ side: 1 })
    },
    geometries: {
        cubeGeometry: new THREE.BoxGeometry(3, 3, 3),
        skyBoxGeometry: new THREE.SphereGeometry(600, 50, 50),
    },
    objects: {
        airplane: {
            path: 'assets/models/airplane.glb',
            fileSize: 4200
        },
        skyBox: {
            type: 'mesh',
            geometry: 'skyBoxGeometry',
            material: 'skyBoxMaterial',
            map: 'skyBoxMap'
        },
    }
};

setRenderer();

const ls = new LoadScreen(renderer, { type: 'stepped-circular', progressColor: '#447' })
    .onComplete(init)
    .start(ASSETS);

function init() {
    initStats();

    scene = new Physijs.Scene();
    scene.setGravity(new THREE.Vector3(0, -9.8, 0));
    scene.addEventListener('update', simulate)

    camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 1, 700);
    camera.position.set(0, 1.6, 80);
    camera.lookAt(new THREE.Vector3(0, 30, 0));
    scene.add(camera);

    light = new THREE.DirectionalLight(0xfefefe);
    light.position.set(0, 200, 200);
    scene.add(light);

    labels = TRANSLATION.currentLang === TRANSLATION.EN_US ?
        { velocity: 'velocity_module', height: 'height', camera: 'switch_camera', info: 'show_info' }
        :
        { velocity: 'velocidade_modulo', height: 'altura', camera: 'trocar_camera', info: 'mostrar_info' };

    controls = new function () {
        this[labels.velocity] = 30;
        this.velocity = 30;
        this[labels.height] = 100;
        this[labels.camera] = false;
        this[labels.info] = true;
    };

    gui = new dat.GUI();
    gui.add(controls, labels.velocity, 20, 50).onChange(() => {
        if (controls.velocity < 0) {
            controls.velocity = controls[labels.velocity] * -1;
        }
        else {
            controls.velocity = controls[labels.velocity]
        }
    });
    gui.add(controls, labels.height, 50, 100).onChange(() => {
        airplane.position.y = controls[labels.height]
    });
    gui.add(controls, labels.camera).onChange(() => {
        if (!controls[labels.camera]) {
            camera.position.set(0, 1.6, 80);
            camera.lookAt(new THREE.Vector3(0, 30, 0));
        }
        else {
            camera.position.copy(airplane.position);
            camera.lookAt(new THREE.Vector3(0, -1, 0))
        }
    });
    gui.add(controls, labels.info).onChange(() => {
        document.getElementById('info').style.display = controls[labels.info] ? 'block' : 'none';
    });

    let planeMaterial = new Physijs.createMaterial(
        ASSETS.materials.groundMaterial,
        0.8,
        0.1
    );

    let grass = ASSETS.textures.grass;
    grass.wrapS = THREE.RepeatWrapping;
    grass.wrapT = THREE.RepeatWrapping;
    grass.repeat.set(9, 3);

    const ground = new Physijs.PlaneMesh(new THREE.PlaneGeometry(650, 160), planeMaterial);
    ground.material.map = grass;
    ground.rotation.x = Math.PI * -0.5;
    scene.add(ground);

    let skyBox = ASSETS.objects.skyBox;
    scene.add(skyBox);

    lookDirection = new THREE.Vector3(0, -1, 0);
    airplaneRange = 175;
    airplane = ASSETS.objects.airplane;
    airplane.position.set(-150, controls[labels.height], 0);
    airplane.rotation.y = Math.PI * 0.5;
    airplane.scale.set(0.15, 0.15, 0.15)
    scene.add(airplane);

    x = document.getElementById('x');
    y = document.getElementById('y');
    t = document.getElementById('t');

    let cubeMaterial = new Physijs.createMaterial(ASSETS.materials.cubeMaterial, 0.8, 0.1);
    box = new Physijs.BoxMesh(
        ASSETS.geometries.cubeGeometry,
        cubeMaterial
    );
    box.isReleased = false;
    box.material.map = ASSETS.textures.crate;
    box.position.set(0, 1.5, 85); // is not visible to the camera
    scene.add(box);

    box.addEventListener('collision', () => {
        if (!time) return;
        time = totalTime;
        xDis = xTotalDis;
        yDis = yTotalDis
        t.innerHTML = 'T: ' + time.toFixed(2) + 's';
        x.innerHTML = 'X: ' + xDis.toFixed(2) + 'm';
        y.innerHTML = 'Y: ' + yDis.toFixed(2) + 'm';
    }, false);

    TrajectoryPath = ProjectileCurve();

    let path = new TrajectoryPath(new THREE.Vector3(0, -1, 0), 0, 0, 0, 0);

    trajectory = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(path.getPoints(1)),
        ASSETS.materials.lineMaterial,
    );
    scene.add(trajectory);

    clock = new THREE.Clock();

    window.addEventListener('resize', onResize);
    document.getElementById('drop').addEventListener('click', onClick);

    ls.remove(() => {
        animate();
    });

    function drawTrajectory() {
        let path = new TrajectoryPath(
            airplane.position,
            controls.velocity,
            airplane.rotation.y * 2,
            0,
            9.8,
            10
        );
        path = path.getPoints(30)
        trajectory.geometry = new THREE.BufferGeometry().setFromPoints(path);
        trajectory.geometry.needsupdate = true;
    }

    function animate() {
        requestAnimationFrame(animate);

        airplane.position.x += controls.velocity * clock.getDelta();

        if (controls[labels.camera]) {
            camera.position.copy(airplane.position);
            camera.lookAt(airplane.position.x, 0, 0);
        }

        if (airplane.position.x > airplaneRange) {
            airplane.rotation.y += - Math.PI;
            controls.velocity *= -1;
            airplane.position.x = airplaneRange;
        }
        else if (airplane.position.x < -airplaneRange) {
            airplane.rotation.y -= Math.PI;
            controls.velocity *= -1;
            airplane.position.x = -airplaneRange;
        }

        scene.simulate(undefined, 2);
        rendererStats.update();
        renderer.render(scene, camera);
    }
    function releaseBox() {
        box.position.copy(airplane.position);
        xPos = box.position.x;
        box.__dirtyPosition = true
        box.setAngularVelocity(new THREE.Vector3(0, 0, 0));
        box.setLinearVelocity(new THREE.Vector3(controls.velocity, 0, 0));
        box.isReleased = true;
        drawTrajectory();

        totalTime = quadraticTime(-4.9, 0, controls[labels.height])
        let aux = totalTime
        time = 0;
        xTotalDis = controls.velocity * parseFloat(aux.toFixed(2));
        yTotalDis = -controls[labels.height];
    }
    function onClick() {
        releaseBox();
    }
    function ProjectileCurve() {
        function ProjectileCurve(p0, velocity, verticalAngle, horizontalAngle, gravity, scale) {
            THREE.Curve.call(this);

            if (p0 === undefined || velocity === undefined || verticalAngle === undefined || horizontalAngle === undefined) {
                return null;
            }

            let vhorizontal = velocity * Math.cos(verticalAngle);

            this.p0 = p0;
            this.vy = velocity * Math.sin(verticalAngle);
            this.vx = velocity * Math.cos(horizontalAngle);
            this.vz = velocity * Math.sin(horizontalAngle);
            this.g = (gravity === undefined) ? -9.8 : gravity;
            this.scale = (scale === undefined) ? 1 : scale;

            if (this.g > 0) this.g *= -1;
        }
        ProjectileCurve.prototype = Object.create(THREE.Curve.prototype);
        ProjectileCurve.prototype.constructor = ProjectileCurve;

        ProjectileCurve.prototype.getPoint = function (t) {
            t *= this.scale;
            let x = this.p0.x + this.vx * t;
            let y = this.p0.y + ((this.vy * t) + (this.g * 0.5 * (t * t)));
            let z = this.p0.z - this.vz * t;
            return new THREE.Vector3(x, y, z);

        };

        return ProjectileCurve
    }

}

let simuClock = new THREE.Clock();
function simulate() {
    let delta = simuClock.getDelta()
    if (time !== totalTime) {
        xDis = box.position.x - xPos;
        if (xTotalDis > 0) { // positive displacement
            if (xDis > xTotalDis - 1.6) xDis = xTotalDis;
        }
        else {
            if (xDis < xTotalDis + 1.6) xDis = xTotalDis;
        }

        yDis = box.position.y + yTotalDis - 1.5;
        if (yDis < -controls[labels.height] + 0.5) yDis = -controls[labels.height];

        time += delta;
        if (time > totalTime) time = totalTime;
        t.innerHTML = 'T: ' + time.toFixed(2) + 's';
        x.innerHTML = 'X: ' + xDis.toFixed(2) + 'm';
        y.innerHTML = 'Y: ' + yDis.toFixed(2) + 'm';
    }
}

function quadraticTime(a, b, c) {
    // This uses the quadratic formula to solve for time in a linear motion with constant aceleration
    // It returns null when the result is negative once negative time doesn't make sense
    // ax^2 + bx + c = 0

    let delta = (b * b) - 4 * a * c;

    if (delta < 0) return null;

    let x;

    if (delta === 0) {
        x = -b / 2 * a;
        return x >= 0 ? x : null;
    }

    x = (-b - Math.sqrt(delta)) / (2 * a);
    if (x > 0) return x;

    x = (-b + Math.sqrt(delta)) / (2 * a);
    if (x > 0) return x;

    return null;
}

function setRenderer() {
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x7799FF);
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(innerWidth, innerHeight);
    document.body.appendChild(renderer.domElement);
}

function initStats() {
    rendererStats = new Stats();
    rendererStats.setMode(0); // 0: fps, 1: ms

    // Align top-left
    rendererStats.domElement.style.position = 'absolute';
    rendererStats.domElement.style.left = '0px';
    rendererStats.domElement.style.top = '0px';
    document.getElementById('three-stats').appendChild(rendererStats.domElement);
}



function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
