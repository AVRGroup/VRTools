let rendererStats, renderer, scene, camera, trackballControls, light, ambientLight, controls, gui, clock;
let calcario, basalto, granito, ardosia, marmore, highlight, viewpoint, isMouseOut;
let language = 'en-US';
let quality = 0;
let lang = 'en-US';
let ASSETS;

const decoder = new THREE.DRACOLoader().setDecoderPath('../libs/draco/gltf/');

var searchBar = location.search;
        
if(searchBar.length != 0){
    let langPattern = "?lang=";
    let separatorIndex = searchBar.indexOf("&");
    let qualityPattern = "&quality=";
    lang = searchBar.substring(langPattern.length, separatorIndex);
    quality = parseInt(searchBar.substring(separatorIndex + qualityPattern.length, searchBar.length));
}
else{                                     
    quality = 0;
}
console.log(quality)
if(quality == 1)
{
    ASSETS = {
        textures: {
            helper: {
                path: 'assets/textures/loader-helper.jpg',
                fileSize: 12259 + 25574 + 4428 + 15957 + 3521, 
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
                path: 'assets/models/geography/calcita.glb',
                fileSize: 12259,
                draco: decoder // the first model needs to set the draco decoder
            },
            basalto: {
                path: 'assets/models/geography/basalto2.glb',
                fileSize: 25574,
            },
            granito: {
                path: 'assets/models/geography/granito.glb',
                fileSize: 4428,
            },
            ardosia: {
                path: 'assets/models/geography/ardosia.glb',
                fileSize: 15957,
            },
            marmore: {
                path: 'assets/models/geography/marmore1.glb',
                fileSize: 3.521,
            }
        }
    };
} else {
    ASSETS = {
        textures: {
            helper: {
                path: 'assets/textures/loader-helper.jpg',
                fileSize: 2936 + 3892 + 1626 + 1702 + 2072, 
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
                path: 'assets/models/geography/calcario_low.glb',
                fileSize: 2936,
                draco: decoder // the first model needs to set the draco decoder
            },
            basalto: {
                path: 'assets/models/geography/basalto_low.glb',
                fileSize: 3892,
            },
            granito: {
                path: 'assets/models/geography/granito_low.glb',
                fileSize: 1626,
            },
            ardosia: {
                path: 'assets/models/geography/ardosia_low.glb',
                fileSize: 1702,
            },
            marmore: {
                path: 'assets/models/geography/marmore1.glb',
                fileSize: 2072,
            }
        }
    };
}


setRenderer();

var ls = new LoadScreen(renderer,{type:'stepped-circular-fancy-offset', progressColor:'#fff',infoStyle:{padding:'0'}}).onComplete(init).start(ASSETS);
/*
const ls = new LoadScreen(renderer, { type: 'stepped-circular', progressColor: '#447' })
    .onComplete(init)
    .start(ASSETS);
*/
function init() {
    initStats();

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 1, 700);
    camera.position.set(0, 0, 100);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);
    onResize();

    ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    //scene.add(ambientLight);
    console.log('aaaa')
    light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(0, 0, 100);
    scene.add(light);  

    trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
    trackballControls.minDistance = 10;
    trackballControls.maxDistance = 120;
    trackballControls.rotateSpeed = 4;

    calcario = ASSETS.objects.calcario;
    calcario.scale.set(2, 2, 2);
    calcario.position.set(0, -20, 0);
    calcario.rotation.set(0, -Math.PI / 12, 0);
    calcario.visible = false;
    content.calcario.model = calcario;
    scene.add(calcario);

    basalto = ASSETS.objects.basalto;
    basalto.scale.set(2, 2, 2);
    basalto.position.set(0, -20, 0);
    basalto.visible = true;
    content.basalto.model = basalto;
    scene.add(basalto)

    granito = ASSETS.objects.granito;
    granito.scale.set(10, 10, 10);
    granito.position.set(0, 0, 0);
    granito.visible = false;
    content.granito.model = granito;
    scene.add(granito)

    ardosia = ASSETS.objects.ardosia;
    ardosia.scale.set(20, 20, 20);
    ardosia.position.set(0, 0, 0);
    ardosia.rotation.set(0, -Math.PI / 6, 0);
    ardosia.visible = false;
    content.ardosia.model = ardosia;
    scene.add(ardosia)

    marmore = ASSETS.objects.marmore;
    marmore.scale.set(15, 15, 15);
    marmore.position.set(0, 2, 0);
    marmore.visible = false;
    content.marmore.model = marmore;
    scene.add(marmore)

    window.addEventListener('resize', onResize);

    window.parent.addEventListener('mouseup', (e) => {
        trackballControls.handleParentKeyUp(e);
    });

    ls.remove(() => {
        animate();
    });
}

function animate() {
    requestAnimationFrame(animate);

    trackballControls.update();
    light.position.copy(camera.position);

    rendererStats.update();
    renderer.render(scene, camera);
}

function setRenderer() {
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xA1ACB3);
    renderer.setPixelRatio(devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    if (window.innerWidth >= 768) {
        renderer.setSize(window.innerWidth * 0.75, window.innerHeight);
    } else {
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    // document.body.appendChild(renderer.domElement);
    document.querySelector("#output").appendChild(renderer.domElement);
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
    if (window.innerWidth >= 768) {
        camera.aspect = window.innerWidth * 0.75 / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth * 0.75, window.innerHeight);
    } else {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

const content = {
    calcario: {
        whatis: 'Limestone is a sedimentary rock that contains minerals with amounts above 30% of calcium carbonate (aragonite or calcite). Limestones are most often formed by the accumulation of lower organisms (eg, cyanobacteria) or calcium carbonate precipitation in the form of bicarbonate, mainly in the marine environment. They can also be found in rivers, lakes and underground (caves).',
        risk: 'Limestone is the main product used to correct soil acidity. Generally speaking, it acts by reducing the amount of harmful elements, increasing the level of Calcium and Magnesium, thus making the soil more aerated, allowing greater water circulation and better root development and, as a result, increasing the activity of microorganisms causing that the fertilization yields more.The benefits generated by the application in crops and pastures start with greater productivity, synonymous with better yields for landowners, regardless of the areas extension.',
        
        whatisPT: 'Calcário é uma rocha sedimentar que contém minerais com quantidades acima de 30% de carbonato de cálcio (aragonita ou calcita). Os calcários, na maioria das vezes, são formados pelo acúmulo de organismos inferiores (por exemplo, cianobactérias) ou precipitação de carbonato de cálcio na forma de bicarbonato, principalmente em meio marinho. Também podem ser encontrados em rios, lagos e no subsolo (cavernas).',
        riskPT: 'O calcário é o principal produto utilizado para corrigir a acidez do solo. Em linhas gerais age reduzindo a quantidade dos elementos nocivos, aumentando o nível de Cálcio e Magnésio, tornando assim o solo mais aerado, permitindo maior circulação de água e melhor desenvolvimento das raízes e, em consequência, proporcionando o aumento da atividade dos microrganismos fazendo com que a adubação renda mais. Os benefícios gerados pela aplicação na lavoura e nas pastagens começam pela maior produtividade, sinônimo de melhores rendimentos para os donos de terra, independente da extensão da área.',
        
        source: `<a href="https://pt.wikipedia.org/wiki/Calc%C3%A1rio" target="_blank" rel="noopener external">Wikipedia</a><br/>
        <a href="https://agropos.com.br/o-que-e-calcario/" target="_blank" rel="noopener external">Agropos</a><br/>`,
        credits: `<a href="https://sketchfab.com/3d-models/calcite-f842f5c568af4b808ad309ba3a8db538" target="_blank" rel="noopener external">Edurock</a>`,

    },
    basalto: {
        whatis: 'Basalt is an eruptive rock, consolidated from magma outside the earths crust. It usually appears in large extensions called "lava rivers". , hard, and rich in iron and magnesium. Basalt is a rock made up of plagioclases (mainly labradorite) and mafic minerals, with secondary components such as rhombic pyroxemes, biotite, magnesite and ilmenite. There is also columnar basalt that comes from certain conditions cooling magma, causing disjunction in prisms.',
        risk: 'Basalt, due to its hardness and resistance to weathering, is used for the production of masonry and construction aggregates and as an ornamental stone for coverings and sidewalks. Basalt fiber production is a booming industry.',
        
        whatisPT: 'O basalto é uma rocha eruptiva, consolidada a partir do magma no exterior da crusta terrestre.Geralmente aparece em grandes extensões denominadas "rios de lava".É uma rocha básica, em geral melanocrática, de cor muito escura, de textura porfírica, muito pesada, dura, e rica em ferro e magnésio.O basalto é uma rocha constituída por plagioclases (sobretudo labradorite) e por minerais máficos, aparecendo componentes secundários como piroxemas rômbicas, biotite, magnesite e ilmenite.Existe também o basalto colunar que provém de certas condições de arrefecimento do magma, originando a disjunção em prismas.',
        riskPT: 'O basalto, pela sua dureza e resistência à meteorização, é explorada para a produção de alvenarias e de agregados de construção civil e como rocha ornamental para revestimentos e calçadas. A produção de fibras de basalto é uma indústria em expansão.',
        
        source: `<a href="https://www.infopedia.pt/$basalto#:~:text=O%20basalto%20%C3%A9%20uma%20rocha,rica%20em%20ferro%20e%20magn%C3%A9sio." target="_blank" rel="noopener external">Infopedia</a><br/>
        <a href="https://pt.wikipedia.org/wiki/Basalto" target="_blank" rel="noopener external">Wikipedia</a>`,
        credits: '<a href="https://sketchfab.com/3d-models/basalt-b6fa41f193c94eefa2661bdff7bd71e8" target="_blank" rel="noopener external">Edurock</a> (adapted)',

    },
    granito: {
        whatis: 'Granite is a rock formed by a set of minerals. Its composition is basically as follows: Quartz, a colorless mineral; Feldspar (orthoclase, sanidin and microcline), responsible for the variety of colors (reddish, pinkish and grayish-cream); Mica (biotite and muscovite), which gives the rock shine. The colors of granite most found in nature are gray and reddish tones, however they are found in the colors: white, black, blue, green, yellow and brown. Furthermore, granites can present minerals such as: amphibole (hornblende), pyroxene (augite and hyperstena), olivine, zircon, among others. It has a high degree of hardness, crystalline, varied color.',
        risk: 'The use of granite as a construction material, as an architectural piece, decorative piece and in the creation of many other products, has centuries of history. Granite is used in buildings, bridges, monuments, pavements and many other projects. In interiors, it is used on counters, as tiles on the floor or walls, stairs, columns and other decorative elements. It is considered a prestigious material, used to project elegance and quality.',
        
        whatisPT: 'O Granito é uma rocha formada por um conjunto de minerais.Sua composição é basicamente a seguinte:Quartzo, um mineral incolor;o Feldspato (ortoclase, sanidina e microclina), responsável pela variedade de cores (avermelhada, rosada e creme-acinzentada);Mica (biotite e moscovite), que confere o brilho à rocha.As cores de granito mais encontradas na natureza são as de tons cinzento e avermelhado, contudo encontram-se nas cores: branco, preto, azul, verde, amarelo e marrom.Além disso, os granitos podem apresentar minerais como: anfíbolas (hornblenda), piroxenas (augite e hiperstena), olivina, zircão, dentre outros.Possui alto grau de dureza, cristalino, coloração variada.',
        riskPT: 'A utilização do granito como material de construção, como peça arquitectónica, peça decorativa e na criação de muitos outros produtos, tem séculos de história.O granito é usado em edifícios, pontes, monumentos, pavimentos e muitos outros projectos. Em interiores é usado em balcões, como ladrilho em pavimento ou paredes, escadarias, colunas e outros elementos decorativas.É considerado um material de prestígio, utilizado para projectar elegância e qualidade.',
        
        source: `<a href="https://www.todamateria.com.br/tipos-de-granito-caracteristicas-e-composicao/" target="_blank" rel="noopener external">TodaMatéria</a><br>
        <a href="https://gra2003.pt/pt/utilizacao-do-granito/" target="_blank" rel="noopener external">gra2003</a> `,
        credits: `<a href="https://unsplash.com/photos/0gGmd1tXCD4?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink" target="_blank" rel="noopener external">Gareth David</a> (adapted)`,
 
    },
    ardosia: {
        whatis: 'Slate is a siliceous-clay metamorphic rock formed by the transformation of clay under pressure and temperature, hardened into thin lamellae. Of low metamorphic grade, slate is formed under the lowest pressures and temperatures among metamorphic rocks.',
        risk: 'Currently, its main use is in floor and wall cladding. It is a rock much appreciated by architects, which combines rustic beauty with an affordable price. But in the past it was widely used on school blackboards.',
        
        whatisPT: 'A ardósia é uma rocha metamórfica sílico-argilosa formada pela transformação da argila sob pressão e temperatura, endurecida em finas lamelas. De baixo grau metamórfico, a ardósia é formada sob as menores pressões e temperaturas dentre as rochas metamórficas.',
        riskPT: 'Atualmente o seu maior uso está em revestimento de pisos e paredes. É uma rocha muito apreciada pelos arquitetos, que alia uma beleza rústica a um preço acessível. Mas no passado foi muito utilizada nos quadros negros das escolas.',
        
        source: `<a href="https://pt.wikipedia.org/wiki/Ard%C3%B3sia" target="_blank" rel="noopener external">Wikipedia</a><br>
        <a href="https://www.hydronorth.com.br/blog-e-dicas/7/ja-ouviu-falar-sobre-a-pedra-ardosia.html" target="_blank" rel="noopener external">hydronoth</a>`,
        credits: '<a href="https://sketchfab.com/3d-models/helmsmans-slate-9747d38ca6a048f9a3c8522647affa23" target="_blank" rel="noopener external">Charlie Harper</a> (adapted)',

    },
    marmore: {
        whatis: 'Marble is a metamorphic rock that originates from limestone exposed to high temperatures and low to moderate pressure.[1] For this reason, the largest deposits of marble are found in regions of limestone matrix and where there was volcanic activity. Marble is a rock explored for use in civil construction.',
        risk: 'Marble is used in decorations, in the making of ornamental objects and sculptures. The famous Venus de Milo statue was carved in marble in the 2nd century BC Marble can still be used in civil construction in the manufacture of objects for household use such as sinks, tables and floors.',
        
        whatisPT: 'Mármore é uma rocha metamórfica originada de calcário exposto a altas temperaturas e pressão de baixa a moderada.[1] Por este motivo as maiores jazidas de mármore são encontradas em regiões de rocha matriz calcária e onde houve atividade vulcânica. O mármore é uma rocha explorada para uso em construção civil.',
        riskPT: 'O mármore é usado em decorações, na confecção de objetos ornamentais e esculturas. A famosa estátua Vênus de Milo foi esculpida em mármore no século II a.C. O mármore pode ainda ser usado em construções civis na fabricação de objetos para uso domiciliar como pias, mesas e pisos.',
        
        source: `<a href="https://pt.wikipedia.org/wiki/M%C3%A1rmore" target="_blank" rel="noopener external">Wikipedia</a><br>
        <a href="https://mundoeducacao.uol.com.br/quimica/marmore.htm" target="_blank" rel="noopener external">Mundo Educação</a>`,
        credits: '<a href="https://unsplash.com/photos/osuiatBDTww?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink" target="_blank" rel="noopener external">Annie Spratt</a> (adapted)',

    }
}


function changeContent() {
    let value = document.querySelector('#selector').value;
    let info = content[value];
    var language;
     if (lang === 'pt-BR') {
        document.querySelector('#whatis').innerHTML = info.whatisPT;
        document.querySelector('#risk').innerHTML = info.riskPT;
        
    }
    else {
        document.querySelector('#whatis').innerHTML = info.whatis;
        document.querySelector('#risk').innerHTML = info.risk;
        
    }
    document.querySelector('#source').innerHTML = info.source;
    document.querySelector('#credits').innerHTML = info.credits; 

    calcario.visible = false;
    basalto.visible = false;
    granito.visible = false;
    ardosia.visible = false;
    marmore.visible = false;
    scene.remove(light);
    scene.remove(ambientLight)

    console.log(value)

    if(content[value] == 'granito') {
        light = new THREE.DirectionalLight(0xffffff, 2);
        light.position.set(0, 0, 100);
        scene.add(light);    
    }
    if(content[value] === calcario) {
        console.log('entrou')
        ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        scene.add(ambientLight);
    }
    else {
        light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 0, 100);
        scene.add(light);    
    }

    trackballControls.reset();

    trackballControls.update();

    info.model.visible = true;
}
console.log(content);
function changeLanguage(newLang) {
    console.log('Change', newLang, lang)
    if (newLang !== language) {
        let info
        let value = document.querySelector('#selector').value;

        if (newLang === 'pt-BR') {
            info = content[value];
            console.log(newLang)

            document.querySelector('#whatis').innerHTML = info.whatisPT;
            document.querySelector('#risk').innerHTML = info.riskPT;


            document.querySelector('#whatis-title').innerHTML = 'Sobre';
            document.querySelector('#risk-title').innerHTML = 'Aplicações';

            document.querySelector('#source-title').innerHTML = 'Fontes';
            document.querySelector('#credits-title').innerHTML = 'Créditos Modelo 3D'; 

            document.querySelector('#opt-calcario').innerHTML = "Calcário";
            document.querySelector('#opt-basalto').innerHTML = "Basalto";
            document.querySelector('#opt-granito').innerHTML = "Granito";
            document.querySelector('#opt-ardosia').innerHTML = "Ardósia";
            document.querySelector('#opt-marmore').innerHTML = "Mármore";

            language = newLang;
        }
        else {
            info = content[value];
            console.log(newLang, ' !')

            document.querySelector('#whatis').innerHTML = info.whatis;
            document.querySelector('#risk').innerHTML = info.risk;


            document.querySelector('#whatis-title').innerHTML = 'About';
            document.querySelector('#risk-title').innerHTML = 'Applications';

            document.querySelector('#source-title').innerHTML = 'Source';
            document.querySelector('#credits-title').innerHTML = 'Model 3D Credits'; 

            document.querySelector('#opt-calcario').innerHTML = "Limestone";
            document.querySelector('#opt-basalto').innerHTML = "Basalt";
            document.querySelector('#opt-granito').innerHTML = "Granite";
            document.querySelector('#opt-ardosia').innerHTML = "Slate";
            document.querySelector('#opt-marmore').innerHTML = "Marble";

            language = 'en-US';
        }
    }
}

window.onload = function () {
    const url = new URLSearchParams(window.location.search);
    const lang = url.get('lang');
    console.log(url, lang);

    if (lang && lang === 'pt-BR') {
        changeLanguage('pt-BR');
    }
}
