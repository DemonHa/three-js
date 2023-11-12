import * as THREE from "./lib/three.module";
import { VRButton } from "./World/components/VrButton";

let camera, scene, renderer, sphere, clock;

init();
animate();

function init() {
  const container = document.getElementById("container");

  clock = new THREE.Clock();
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x101010);

  const light = new THREE.AmbientLight(0xffffff, 3);
  scene.add(light);

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  scene.add(camera);

  // Create the panoramic sphere geometery
  const panoSphereGeo = new THREE.SphereGeometry(6, 256, 256);

  // Create the panoramic sphere material
  const panoSphereMat = new THREE.MeshStandardMaterial({
    side: THREE.BackSide,
    displacementScale: -4.0,
  });

  // Create the panoramic sphere mesh
  sphere = new THREE.Mesh(panoSphereGeo, panoSphereMat);

  // Load and assign the texture and depth map
  const manager = new THREE.LoadingManager();
  const loader = new THREE.TextureLoader(manager);

  loader.load("./assets/7.jpg", function (texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    sphere.material.map = texture;
  });

  // On load complete add the panoramic sphere to the scene
  manager.onLoad = function () {
    scene.add(sphere);
  };

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType("local");
  container.appendChild(renderer.domElement);

  document.body.appendChild(VRButton.createButton(renderer));
  window.addEventListener("resize", onWindowResize);

  // 	const listener = new THREE.AudioListener();
  // camera.add( listener );

  // const sound = new THREE.Audio( listener );

  // const audioLoader = new THREE.AudioLoader();
  // audioLoader.load( 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Ave_Maria_%28USNB%29.ogg', function( buffer ) {
  // 	sound.setBuffer( buffer );
  // 	sound.setLoop( true );
  // 	sound.setVolume( 0.5 );
  // 	sound.play();
  // });
  const listener = new THREE.AudioListener();
  camera.add( listener );
  
  // create the PositionalAudio object (passing in the listener)
  const sound = new THREE.PositionalAudio( listener );
  
  // load a sound and set it as the PositionalAudio object's buffer
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load( 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Ave_Maria_%28USNB%29.ogg', function( buffer ) {
	  sound.setBuffer( buffer );
	  sound.setRefDistance( 20 );
  });

  window.addEventListener("click", () => {
    sound.play();
  })
  
  // create an object for the sound to play from
  const spheree = new THREE.SphereGeometry( 20, 32, 16 );
  const material = new THREE.MeshPhongMaterial( { color: 0xff2200 } );
  const mesh = new THREE.Mesh( spheree, material );
  scene.add( mesh );
  
  // finally add the sound to the mesh
  mesh.add( sound );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  renderer.setAnimationLoop(render);
}

function render() {
  // If we are not presenting move the camera a little so the effect is visible
  if (renderer.xr.isPresenting === false) {
    const time = clock.getElapsedTime();

    sphere.rotation.y += 0.001;
    sphere.position.x = Math.sin(time) * 0.2;
    sphere.position.z = Math.cos(time) * 0.2;
  }

  renderer.render(scene, camera);
}
