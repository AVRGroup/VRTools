//-- Imports -------------------------------------------------------------------------------------
import * as THREE from '../libs/three/build/three.module.js';
import { VRButton } from '../libs/three/build/jsm/webxr/VRButton.js';
import { Orbi } from '../libs/orbixr.js';
import {GLTFLoader} from '../libs/three/build/jsm/loaders/GLTFLoader.js'

// import {
//   onWindowResize,
// } from "../../libs/util/util.js";

//-----------------------------------------------------------------------------------------------
//-- MAIN SCRIPT --------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------

//-- Renderer settings ---------------------------------------------------------------------------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(new THREE.Color("#232323"));
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
renderer.xr.cameraAutoUpdate = false;
renderer.gammaFactor = 2.2;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

let ASSETS, calcario, basalto, granito, ardosia, marmore;

/*
ASSETS = {
  textures: {
      helper: {
          path: 'assets/textures/loader-helper.jpg',
          fileSize: 1627 + 2095 + 2350 + 1799 + 2310, 
      }
  },


  objects: {
      calcario: {
          path: 'assets/models/rocks/limestone_low.glb',
          fileSize: 1627,
          //draco: dracoLoader,
      },
      basalto: {
          path: 'assets/models/rocks/basalt_low.glb',
          fileSize: 2095,
      },
      granito: {
          path: 'assets/models/rocks/granite_low.glb',
          fileSize: 2350,
      },
      ardosia: {
          path: 'assets/models/rocks/slate_low.glb',
          fileSize: 1799,
      },
      marmore: {
          path: 'assets/models/rocks/marble_low.glb',
          fileSize: 2310,
      }
  }
};
*/

//loader.load('assets/models/rocks/limestone_low.glb');

//var ls = new LoadScreen(renderer,{type:'stepped-circular-fancy-offset', progressColor:'#fff',infoStyle:{padding:'0'}}).onComplete(init).start(ASSETS);

//-- Setting scene and camera -------------------------------------------------------------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, .1, 1000);

rock = new THREE.Object3D();

const SIZE = {
  limestone: 0.05,
  calcarioY: 1,
  basalt: 0.05,
  basaltoY: 30,
  granite: 0.8,
  granitoY: 1,
  slate: 0.5,
  ardosia: 1,
  marble: 0.06,
  marmoreY: 0.04
};

//-- 'Camera Holder' to help moving the camera
const cameraHolder = new THREE.Object3D();
// cameraHolder.position.set(0, 1.6, 0)
cameraHolder.add(camera);
scene.add(cameraHolder);
// controllers
const controller1 = renderer.xr.getController(0);
camera.add(controller1);
const config = {
  display: new THREE.Vector2(2, 2),
  orbits: [1, 2, 3],
  rotation: {
    theta: 0,
  },
  button: {
    transparent: true,
    opacity: 0.95
  },
  gap: new THREE.Vector2(0.003, 0.003),
  border: {
    enabled: true
  },
  font: {
    path: '../libs/fonts/Roboto_Regular.json'
  }
}


var light = new THREE.DirectionalLight(0xffffff, 1);
scene.add(light);
light.position.set(0, 1.6, 0);

var rock;
var firstLoad = new GLTFLoader();
firstLoad.load('assets/models/rocks/basalt_low.glb', function(object) {
  rock = object.scene;
  calcario = object.scene;
  rock.position.set(1, 1, -1);
  rock.scale.set(0.05, 0.05, 0.05);
  scene.add(rock);
});
var number = 1;



const orbi = new Orbi(camera, config);
cameraHolder.add(orbi);
var loader = new GLTFLoader();



orbi.addButton('1', '../img/icons/alert.png', () => {
  if(number == 5)
    number = 1;
  else
    number ++;
  
  switch(number) {
    case 1:
      {
        scene.remove(rock);
        loader.load('assets/models/rocks/basalt_low.glb', function(object) {
          rock = object.scene;
          rock.position.set(1, 1, -1);
          rock.scale.set(0.05, 0.05, 0.05);
          scene.add(rock);
        });
        break;
      }
    case 2:
      {
        scene.remove(rock);
        loader.load('assets/models/rocks/limestone_low.glb', function(object) {
          rock = object.scene;
          rock.position.set(1.2, 1, -2);
          rock.scale.set(0.05, 0.05, 0.05);
          scene.add(rock);
        });
        break;
      }
    case 3:
      {
        scene.remove(rock);
        loader.load('assets/models/rocks/granite_low.glb', function(object) {
          rock = object.scene;
          rock.position.set(1.2, 1, -2);
          rock.scale.set(0.8, 0.8, 0.8);
          scene.add(rock);
        });
        break;
      }
    case 4:
      {
        scene.remove(rock);
        loader.load('assets/models/rocks/slate_low.glb', function(object) {
          rock = object.scene;
          rock.position.set(1.2, 1.3, -2);
          rock.scale.set(0.5, 0.5, 0.5);
          scene.add(rock);
        });
        break;
      }
    case 5:
      {
        scene.remove(rock);
        loader.load('assets/models/rocks/marble_low.glb', function(object) {
          rock = object.scene;
          rock.position.set(1.8, 1, -3);
          rock.scale.set(0.06, 0.06, 0.06);
          scene.add(rock);
        });
        break;
      }
  }
  
});

orbi.addButton('2', '../img/icons/alert.png', () => { 
  if(number == 1)
  number = 5;
else
  number --;

switch(number) {
  case 1:
    {
      scene.remove(rock);
      loader.load('assets/models/rocks/basalt_low.glb', function(object) {
        rock = object.scene;
        rock.position.set(1, 1, -1);
        rock.scale.set(0.05, 0.05, 0.05);
        scene.add(rock);
      });
      break;
    }
  case 2:
    {
      scene.remove(rock);
      loader.load('assets/models/rocks/limestone_low.glb', function(object) {
        rock = object.scene;
        rock.position.set(1.2, 1, -2);
        rock.scale.set(0.05, 0.05, 0.05);
        scene.add(rock);
      });
      break;
    }
  case 3:
    {
      scene.remove(rock);
      loader.load('assets/models/rocks/granite_low.glb', function(object) {
        rock = object.scene;
        rock.position.set(1.2, 1, -2);
        rock.scale.set(1, 1, 1);
        scene.add(rock);
      });
      break;
    }
  case 4:
    {
      scene.remove(rock);
      loader.load('assets/models/rocks/slate_low.glb', function(object) {
        rock = object.scene;
        rock.position.set(1.2, 1.3, -2);
        rock.scale.set(0.5, 0.5, 0.5);
        scene.add(rock);
      });
      break;
    }
  case 5:
    {
      scene.remove(rock);
      loader.load('assets/models/rocks/marble_low.glb', function(object) {
        rock = object.scene;
        rock.position.set(1.8, 1, -3);
        rock.scale.set(0.06, 0.06, 0.06);
        scene.add(rock);
      });
      break;
    }
}
 });
console.log(cameraHolder.position)
orbi.addButton('3', '../img/icons/alert.png', () => { 
  switch(number) {
    case 1:
      {
        scene.remove(rock);
        loader.load('assets/models/rocks/basalt_low.glb', function(object) {
          rock = object.scene;
          rock.position.set(1, 1, -1);
          rock.scale.set(0.05, 0.05, 0.05);
          scene.add(rock);
        });
        break;
      }
    case 2:
      {
        scene.remove(rock);
        loader.load('assets/models/rocks/limestone_low.glb', function(object) {
          rock = object.scene;
          rock.position.set(1.2, 1, -2);
          rock.scale.set(0.05, 0.05, 0.05);
          scene.add(rock);
        });
        break;
      }
    case 3:
      {
        scene.remove(rock);
        loader.load('assets/models/rocks/granite_low.glb', function(object) {
          rock = object.scene;
          rock.position.set(1.2, 1, -2);
          rock.scale.set(1, 1, 1);
          scene.add(rock);
        });
        break;
      }
    case 4:
      {
        scene.remove(rock);
        loader.load('assets/models/rocks/slate_low.glb', function(object) {
          rock = object.scene;
          rock.position.set(1.2, 1.3, -2);
          rock.scale.set(0.5, 0.5, 0.5);
          scene.add(rock);
        });
        break;
      }
    case 5:
      {
        scene.remove(rock);
        loader.load('assets/models/rocks/marble_low.glb', function(object) {
          rock = object.scene;
          rock.position.set(1.8, 1, -3);
          rock.scale.set(0.06, 0.06, 0.06);
          scene.add(rock);
        });
        break;
      }
  }
 });

orbi.addButton('4', '../img/icons/alert.png', () => { orbi.showMessage('button 4') });

orbi.addButton('5', '../img/icons/alert.png', () => { orbi.showMessage('button 5') });




//--  General globals ---------------------------------------------------------------------------
// window.addEventListener('resize', onWindowResize);


//-- Creating Scene and calling the main loop ----------------------------------------------------
createScene();
animate();

//------------------------------------------------------------------------------------------------
//-- FUNCTIONS -----------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------

//-- Main loop -----------------------------------------------------------------------------------
function animate() {
  renderer.setAnimationLoop(render);
}

function render() {
  renderer.xr.updateCamera(camera);
  orbi.update();
  renderer.render(scene, camera);
}


//------------------------------------------------------------------------------------------------
//-- Scene and auxiliary functions ---------------------------------------------------------------
//------------------------------------------------------------------------------------------------

//-- Create Scene --------------------------------------------------------------------------------
function createScene() {
  var axesHelper = new THREE.AxesHelper(12);
  scene.add(axesHelper);
  
  var planeGeometry = new THREE.PlaneGeometry(20, 20);
  var planeMaterial = new THREE.MeshBasicMaterial({
    color: "rgba(150, 150, 150)",
    side: THREE.DoubleSide,
  });
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = Math.PI / 2;
  plane.position.y = -0.01;
  scene.add(plane);

  var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
  var cubeMaterial = new THREE.MeshNormalMaterial();
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  camera.add(cube);

  document.body.appendChild(VRButton.createButton(renderer));
}

