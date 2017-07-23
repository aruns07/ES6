const T3 = window.THREE;
let scene = new T3.Scene();
let camera = new T3.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

let renderer = new T3.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let geometry = new T3.BoxGeometry(1, 1, 1);
let material = new T3.MeshBasicMaterial({ color: 0x00ff00});
let cube = new T3.Mesh(geometry, material);

scene.add( cube );
camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}
animate();