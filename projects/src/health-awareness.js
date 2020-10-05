let rendererStats, renderer, scene, camera, orbitControls, light, ambientLight, controls, gui, clock;

let heart, stroke;

const decoder = new THREE.DRACOLoader().setDecoderPath('../libs/draco/gltf/');

const ASSETS = {
    textures: {
        helper: {
            path: 'assets/textures/loader-helper.jpg',
            fileSize: 461 + 304,
        }
    },
    objects: {
        heart: {
            path: 'assets/models/health-awareness/heart.glb',
            fileSize: 461,
            draco: decoder//new THREE.DRACOLoader().setDecoderPath('../libs/draco/gltf/')
        },
        // cancer: {
        //     path: 'assets/models/health-awareness/cancer.glb',
        //     fileSize: 37429,
        //     draco: decoder
        // },
        // copd: {
        //     path: 'assets/models/health-awareness/copd.glb',
        //     fileSize: 37429,
        //     draco: decoder
        // },
        stroke: {
            path: 'assets/models/health-awareness/stroke.glb',
            fileSize: 304,
            // draco: decoder
        },
    }
};

setRenderer();

const ls = new LoadScreen(renderer, { type: 'stepped-circular', progressColor: '#447' })
    .onComplete(init)
    .start(ASSETS);

function init() {
    initStats();

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 1, 700);
    camera.position.set(0, 0, 100);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);
    onResize();

    ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    light = new THREE.PointLight(0xfefefe, 1);
    light.position.set(0, 0, 100);
    scene.add(light);

    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControls.minDistance = 10;
    orbitControls.maxDistance = 120;
    orbitControls.update();

    heart = ASSETS.objects.heart;
    heart.scale.set(0.5, 0.5, 0.5);
    heart.position.set(0, 0, 0);
    scene.add(heart);

    stroke = ASSETS.objects.stroke;
    stroke.scale.set(0.45, 0.45, 0.45);
    stroke.position.set(0, 15, 0);
    stroke.rotation.set(0, -Math.PI / 12, 0)
    stroke.visible = false;
    scene.add(stroke);

    window.addEventListener('resize', onResize);

    ls.remove(() => {
        animate();
    });
}

function animate() {
    requestAnimationFrame(animate);

    light.position.copy(camera.position);



    rendererStats.update();
    renderer.render(scene, camera);
}

function setRenderer() {
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xA1ACB3);
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

const content = {
    cardio: {
        whatis: 'Cardiovascular diseases (CVDs) are a group of disorders of the heart and vessels, such as coronary heart disease (disease of the vessels supplying the heart) and cerebrovascular disease (disease of the vessels supplying the brain). The CVDs are the number one cause of death worldwide.',
        risk: 'The main risk factors are unhealthy diet, physical inactivity, tobacco use and harmful use of alcohol.',
        symptoms: 'Often, the first symptoms are a heart attack or a stroke. Symptoms of a heart attack include pain or discomfort in the center of the chest, arms, left shoulder, elbows, jaws, or back. The most common stroke symptom is sudden weakness of the face, arm, or leg, most often on one side of the body.',
        source: 'https://www.who.int/news-room/fact-sheets/detail/cardiovascular-diseases-(cvds)'
    },
    cancer: {
        whatis: 'Cancer is a generic term to refer to diseases caused by the fast creation of abnormal cells that grow beyond their usual boundaries. Cancer is the number two cause of death worldwide and it can affect any part of the body. The model depicts a malignant chest wall tumor, which can be identified by the localized mass on the ribs.',
        risk: 'The cancer risk factors include tobacco use, being overweight or orbese, unhealthy diet with low fruit and vegetable intake, alcohol intake, ionizing and ultraviolet radiation, and urban air pollution.',
        symptoms: 'How cancer embraces a large number of diseases, it can cause almost any type of symptom. However, some general symptoms are unexplained weight loss, fever, fatigue, pain, and skin changes.',
        source: 'https://www.who.int/news-room/fact-sheets/detail/cancer;\nhttps://www.saintjohnscancer.org/thoracic/conditions/chest-wall-tumors/;\nhttps://www.cancer.org/cancer/cancer-basics/signs-and-symptoms-of-cancer.html'
    },
    copd: {
        whatis: 'Chronic obstructive pulmonary disease is a lung disease that is characterized by a persistent reduction of airflow. COPD is not curable and its symptoms are progressively worsening, but treatment can relieve symptoms, improve quality of life and reduce the risk of death.',
        risk: 'The primary cause of COPD is tobacco smoke, but other risk factors are air pollution, occupational dust and chemicals, and frequently lower respiratory infections during childhood.',
        symptoms: 'COPD develops slowly and usually becomes apparent after 40 or 50 years of age. The most common symptoms are breathlessness, chronic cough, and mucous production.',
        source: 'https://www.who.int/news-room/fact-sheets/detail/chronic-obstructive-pulmonary-disease-(copd)'
    },
    // trauma: {
    //     whatis: '',
    //     risk: '',
    //     symptoms: '',
    //     source: ''
    // },
    stroke: {
        whatis: 'A stroke occurs when the blood supply to part of your brain is interrupted or reduced, preventing brain tissue from getting oxygen and nutrients. Brain cells begin to die in minutes. A stroke is a medical emergency, and prompt treatment is crucial. Early action can reduce brain damage and other complications.',
        risk: 'The main risk factors are high blood pressure, or hypertension, nicotine and carbon monoxide in cigarette smoke, physical inactivity and a unhealthy diet that results in diabetes or high blood cholesterol.',
        symptoms: 'Trouble speaking and understanding what others are saying, paralysis or numbness of the face, arm or leg, problems seeing in one or both eyes, headache and trouble walking are the most common symptoms.',
        source: 'https://www.nhlbi.nih.gov/health-topics/stroke \nhttps://www.stroke.org/en/about-stroke/stroke-risk-factors/stroke-risk-factors-you-can-control-treat-and-improve \nhttps://www.mayoclinic.org/diseases-conditions/stroke/symptoms-causes/syc-20350113'
    },
    alzheimer: {
        whatis: 'A progressive disease that destroys memory and other important mental functions.The connections of brain cells and the cells themselves degenerate and die, eventually destroying memory and other important mental functions.',
        risk: 'The risk of developing Alzheimer\'s appears to be increased by many conditions that damage the heart and blood vessels. These include heart disease, diabetes, stroke, high blood pressure, and high cholesterol.',
        symptoms: 'Alzheimer\'s symptoms vary according to the evolution of the disease, but all are related to memory loss, whether to solve problems of reasoning or more common things in everyday life, such as remembering where you live.',
        source: 'https://www.alz.org/alzheimers-dementia/what-is-alzheimers \nhttps://www.nhs.uk/conditions/alzheimers-disease/symptoms/'
    },
    // diabetes: {
    //     whatis: '',
    //     risk: '',
    //     symptoms: '',
    //     source: ''
    // },
    // flu: {
    //     whatis: '',
    //     risk: '',
    //     symptoms: '',
    //     source: ''
    // },
    kidney: {
        whatis: 'Kidney disease occurs when a disease or condition impairs kidney function, causing kidney damage to worsen over several months or years.',
        risk: 'Diabetes, high blood pressure, heart and blood vessel(cardiovascular) disease, smoking, obesity, and family history of kidney disease are factors that increase the risk of kidney disease.',
        symptoms: 'weight loss and poor appetite, swollen ankles, feet or hands – as a result of water retention, shortness of breath, tiredness, blood in the urine, an increased need to pee – particularly at night and headaches are the most common symptoms.',
        source: 'https://www.nhs.uk/conditions/kidney-disease/symptoms/ \nhttps://www.mayoclinic.org/diseases-conditions/chronic-kidney-disease/symptoms-causes/syc-20354521'
    },
}

function changeContent() {
    let value = document.querySelector('#selector').value;

    document.querySelector('#whatis').innerHTML = content[value].whatis;
    document.querySelector('#risk').innerHTML = content[value].risk;
    document.querySelector('#symptoms').innerHTML = content[value].symptoms;
    document.querySelector('#source').innerHTML = content[value].source;

    heart.visible = !heart.visible;
    stroke.visible = !stroke.visible;
}