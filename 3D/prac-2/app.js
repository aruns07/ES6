const T3 = window.THREE;

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

let cube;
let scene = new T3.Scene();
let camera;
let renderer;

function setRenderer() {
    renderer = new T3.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
}


function createCube() {
    let geometry = new T3.CubeGeometry(2, 2, 2);
    let material = new T3.MeshNormalMaterial();
    cube = new T3.Mesh(geometry, material);

    scene.add( cube );
}

function setCamera() {
    camera = new T3.PerspectiveCamera( 75, windowWidth/windowHeight, 1, 10 );
    //camera = new THREE.OrthographicCamera( windowWidth / - 2, windowWidth / 2, windowHeight / 2, windowHeight / - 2, 0, 40 );
    camera.position.set(0, 5, 5);
    camera.lookAt(scene.position);
}

function createPolygon() {
    let geometry = new T3.Geometry();
    geometry.vertices.push(new T3.Vector3(100, 100, 0));
    geometry.vertices.push(new T3.Vector3(-100, -100, 0));
    geometry.vertices.push(new T3.Vector3(100, -100, 0));
    geometry.vertices.push(new T3.Vector3(-100, 100, 0));

    geometry.faces.push(new T3.Face3(0, 1, 2));
    geometry.faces.push(new T3.Face3(3, 1, 0));

    let material = new T3.MeshBasicMaterial({ color: 0x00ff00, side: THREE.FrontSide});
    let mesh = new T3.Mesh(geometry, material);


    let geometry2 = new T3.Geometry();
    geometry2.vertices.push(new T3.Vector3(100, 100, -10));
    geometry2.vertices.push(new T3.Vector3(-100, -100, -10));
    geometry2.vertices.push(new T3.Vector3(100, -100, -10));
    geometry2.vertices.push(new T3.Vector3(-100, 100, -10));

    geometry2.faces.push(new T3.Face3(2, 1, 0));
    geometry2.faces.push(new T3.Face3(0, 1, 3));

    let material2 = new T3.MeshBasicMaterial({ color: 0xff0000, side: THREE.FrontSide});
    let mesh2 = new T3.Mesh(geometry2, material2);
    /*
    let ambientLight = new THREE.AmbientLight( 0xff0000 );
    let light = new THREE.DirectionalLight( 0xff0000, 1.0 );
	light.position.set( 0, 0, 50 );
    */

    scene.add( mesh );
    scene.add( mesh2 );
    //scene.add(ambientLight);
    //scene.add(light);
}

let rotateBy = Math.PI / 180;
let rotationAngle = rotateBy;
let rotationAxis = new T3.Vector3(0, 1, 0);
let center = new T3.Vector3(0, 0, 0);
var SPEED = 0.01;
function animate() {
    requestAnimationFrame(animate);

    /* Case 1: rotate cube */
    //cube.rotateOnAxis(rotationAxis, rotateBy);
    
    /* Case 1, Way 2 : rotate cube */
    //cube.rotation.x -= SPEED * 2;
    //cube.rotation.y -= SPEED;
    //cube.rotation.z -= SPEED * 3;
    
    /* Case 3 : rotate camera around cube */
    /* I should try this with matrix  */
    rotationAngle += rotateBy;
    camera.position.x = Math.sin(rotationAngle) * 5;
    camera.position.z = Math.cos(rotationAngle) * 5;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}
setCamera();
setRenderer();
createCube();
animate();