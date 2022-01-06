//-- Imports -------------------------------------------------------------------------------------
import * as THREE from '../libs/three/build/three.module.js';
import { VRButton } from '../libs/three/build/jsm/webxr/VRButton.js';
import { Orbi } from '../libs/orbixr.js';
import {GLTFLoader} from '../libs/three/build/jsm/loaders/GLTFLoader.js'


var searchBar = location.search;
if (searchBar.length != 0) {
    let langPattern = "?lang=";
    let separatorIndex = searchBar.indexOf("&");
    let qualityPattern = "&quality=";
    let lang = searchBar.substring(langPattern.length, separatorIndex);
    let quality = parseInt(searchBar.substring(separatorIndex + qualityPattern.length, searchBar.length));
    switch (quality) {
        case 1:
            startApp(lang, "high");
            break;
        case 0:
            startApp(lang, "low");
            break;
    }
}
else {
    startApp("en-US", "low");
}

function startApp(lang, quality)
{
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
    type: "Type",
  };    
  
  const brTexts = {
    folderName: "Parâmetros",
    axis: "Eixos",
    size: "Tamanho do Objeto",
    type: "Tipo de Rocha",
  
  }; 
  
  const brButtonPaths = {
    buttonNext: 'assets/icons/next-(pt-BR).png',
    buttonPrevious: 'assets/icons/previous-(pt-BR).png',
    buttonDecrease: 'assets/icons/decrease(pt-BR).png',
    buttonIncrease: 'assets/icons/increase(pt-BR).png',
    buttonRotation: 'assets/icons/rotation(pt-BR).png',
  }
  
  const usButtonPaths = {
    buttonNext: 'assets/icons/next.png',
    buttonPrevious: 'assets/icons/previous.png',
    buttonDecrease: 'assets/icons/decrease.png',
    buttonIncrease: 'assets/icons/increase.png',
    buttonRotation: 'assets/icons/rotation.png',
  }
  
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
  
  
  
  var rocks = usRocks; // Default
  var interfaceTexts = usTexts;
  var lang = "en-US";
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
  document.getElementById("webgl-output").appendChild(renderer.domElement);
  
  let limestone, basalt, granite, slate, marble, rotateSpeed = 0.015;
  
  var paths = highPaths;
  var buttonsPaths = brButtonPaths;
    console.log(quality)
    console.log(lang)
    paths = highPaths;
    if(quality == "low") 
    {
      paths = lowPaths;
      rockParam.limeHigh = 1627;
      rockParam.basaHigh = 2095;
      rockParam.granHigh = 2350;
      rockParam.marbHigh = 1799;
      rockParam.slatHigh = 2310;
    }
    if(lang == 'pt-BR')
      buttonsPaths = brButtonPaths;
  
  
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
  
  
  var ls = new LoadScreen(renderer,{type:'stepped-circular-fancy-offset', progressColor:'#fff',infoStyle:{padding:'0'}}).onComplete(init).start(ASSETS);
  var content;
  //-- Setting scene and camera -------------------------------------------------------------------
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, .1, 1000);
  
  
  
  function init() {
  
    createScene();
  
    console.log('aaaa')
    light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(0, 0, 100);
    scene.add(light);  
  
    basalt = ASSETS.objects.basalt;
    basalt.position.set(1, 1, -1);
    basalt.scale.set(0.03, 0.03, 0.03);
    basalt.visible = true;
    scene.add(basalt);
  
    limestone = ASSETS.objects.limestone;
    limestone.position.set(1.2, 1, -2);
    limestone.scale.set(0.05, 0.05, 0.05);
    limestone.rotation.set(0, -Math.PI / 12, 0);
    limestone.visible = false;
    scene.add(limestone);
  
    granite = ASSETS.objects.granite;
    granite.position.set(1.2, 1, -2);
    granite.scale.set(0.8, 0.8, 0.8);
    granite.rotation.set(0, -Math.PI / 12, 0);
    granite.visible = false;
    scene.add(granite)
  
    slate = ASSETS.objects.slate;
    slate.position.set(1.2, 1.3, -2);
    slate.scale.set(0.5, 0.5, 0.5);
    slate.rotation.set(0, -Math.PI / 6, 0);
    slate.visible = false;
    scene.add(slate)
  
    marble = ASSETS.objects.marble;
    marble.position.set(1.8, 1, -3);
    marble.scale.set(0.06, 0.06, 0.06);
    marble.visible = false;
    scene.add(marble)
  
  
    ls.remove(() => {
      animate();
    });
  }
  
  
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
  
  var number = 1;
  var size = 1;
  
  const orbi = new Orbi(camera, config);
  cameraHolder.add(orbi);
  var loader = new GLTFLoader();
  
  orbi.addButton('1', buttonsPaths.buttonPrevious, () => {
    if(number == 5)
      number = 1;
    else
      number ++;
    
    switch(number) {
      case 1:
        {
          limestone.visible = false;
          marble.visible = false;
          granite.visible = false;
          slate.visible = false;
          basalt.visible = true;
          break;
        }
      case 2:
        {
          limestone.visible = false;
          marble.visible = false;
          granite.visible = false;
          slate.visible = true;
          basalt.visible = false;
          break;
        }
      case 3:
        {
          limestone.visible = false;
          marble.visible = false;
          granite.visible = true;
          slate.visible = false;
          basalt.visible = false;
          break;
        }
      case 4:
        {
          limestone.visible = false;
          marble.visible = true;
          granite.visible = false;
          slate.visible = false;
          basalt.visible = false;
          break;
        }
      case 5:
        {
          limestone.visible = true;
          marble.visible = false;
          granite.visible = false;
          slate.visible = false;
          basalt.visible = false;
          break;
        }
    }
    
  });
  
  orbi.addButton('2', buttonsPaths.buttonNext, () => { 
    if(number == 1)
    number = 5;
  else
    number --;
  
  switch(number) {
    case 1:
      {
        limestone.visible = false;
        marble.visible = false;
        granite.visible = false;
        slate.visible = false;
        basalt.visible = true;
        break;
      }
    case 2:
      {
        limestone.visible = false;
        marble.visible = false;
        granite.visible = false;
        slate.visible = true;
        basalt.visible = false;
        break;
      }
    case 3:
      {
        limestone.visible = false;
        marble.visible = false;
        granite.visible = true;
        slate.visible = false;
        basalt.visible = false;
        break;
      }
    case 4:
      {
        limestone.visible = false;
        marble.visible = true;
        granite.visible = false;
        slate.visible = false;
        basalt.visible = false;
        break;
      }
    case 5:
      {
        limestone.visible = true;
        marble.visible = false;
        granite.visible = false;
        slate.visible = false;
        basalt.visible = false;
        break;
      }
  }
   });
  
  orbi.addButton('3', buttonsPaths.buttonDecrease, () => {
    if(size > 1)
    {
      size --;
      switch(number) {
        case 1:
          {
            basalt.scale.set(SIZE.basalt + size/3 * SIZE.basalt, SIZE.basalt + size/3 * SIZE.basalt, SIZE.basalt + size/3 * SIZE.basalt)
            break;
          }
        case 2:
          {
            slate.scale.set(SIZE.slate + size/3 * SIZE.slate, SIZE.slate + size/3 * SIZE.slate, SIZE.slate + size/3 * SIZE.slate);
            break;
          }
        case 3:
          {
            granite.scale.set(SIZE.granite + size/3 * SIZE.granite, SIZE.granite + size/3 * SIZE.granite, SIZE.granite + size/3 * SIZE.granite);
            break;
          }
        case 4:
          {
            marble.scale.set(SIZE.marble + size/3 * SIZE.marble, SIZE.marble + size/3 * SIZE.marble, SIZE.marble + size/3 * SIZE.marble);
            break;
          }
        case 5:
          {
            limestone.scale.set(SIZE.limestone + size/3 * SIZE.limestone, SIZE.limestone + size/3 * SIZE.limestone, SIZE.limestone + size/3 * SIZE.limestone);
            break;
          }
      }
    }
   
   });
  
  orbi.addButton('4', buttonsPaths.buttonIncrease, () => {
    if(size < 3)
    {
      size ++;
      switch(number) {
        case 1:
          {
            basalt.scale.set(SIZE.basalt + size/3 * SIZE.basalt, SIZE.basalt + size/3 * SIZE.basalt, SIZE.basalt + size/3 * SIZE.basalt)
            break;
          }
        case 2:
          {
            slate.scale.set(SIZE.slate + size/3 * SIZE.slate, SIZE.slate + size/3 * SIZE.slate, SIZE.slate + size/3 * SIZE.slate);
            break;
          }
        case 3:
          {
            granite.scale.set(SIZE.granite + size/3 * SIZE.granite, SIZE.granite + size/3 * SIZE.granite, SIZE.granite + size/3 * SIZE.granite);
            break;
          }
        case 4:
          {
            marble.scale.set(SIZE.marble + size/3 * SIZE.marble, SIZE.marble + size/3 * SIZE.marble, SIZE.marble + size/3 * SIZE.marble);
            break;
          }
        case 5:
          {
            limestone.scale.set(SIZE.limestone + size/3 * SIZE.limestone, SIZE.limestone + size/3 * SIZE.limestone, SIZE.limestone + size/3 * SIZE.limestone);
            break;
          }
      }
    }
  });
  
  orbi.addButton('5', buttonsPaths.buttonRotation, () => { 
    if(rotateSpeed == 0.015)
      rotateSpeed = 0;
    else
      rotateSpeed = 0.015;  
  });
  
  
  
  
  //--  General globals ---------------------------------------------------------------------------
  // window.addEventListener('resize', onWindowResize);
  
  
  //-- Creating Scene and calling the main loop ----------------------------------------------------
  /*createScene();
  animate();
  */
  //------------------------------------------------------------------------------------------------
  //-- FUNCTIONS -----------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------------
  
  //-- Main loop -----------------------------------------------------------------------------------
  function animate() {
    renderer.setAnimationLoop(render);
  }
  
  function render() {
    limestone.rotation.y += rotateSpeed;
    marble.rotation.y += rotateSpeed;
    granite.rotation.y += rotateSpeed;
    slate.rotation.y += rotateSpeed;
    basalt.rotation.y += rotateSpeed;
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
    
}

