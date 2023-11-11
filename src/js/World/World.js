import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Loop } from "./system/Loop.js";
import { createRenderer } from "./system/renderer.js";
import { createScene } from "./components/scene.js";
import { createCamera, createDolly } from "./components/camera.js";
import { createLights } from "./components/lights.js";
import { blue } from "./components/materials/blue.js";
import { cube } from "./components/meshes/cube.js";
import { sphere } from "./components/meshes/sphere.js";
import { createFloor } from "./components/meshes/floor.js";
import { VrControls } from "./system/VrControls.js";

import One from "./../../assets/4.jpg";

import * as THREE from "three";

class World {
  constructor() {
    this.renderer = createRenderer();
    this.scene = createScene(this.renderer);
    this.camera = createCamera();
    this.loop = new Loop(this.camera, this.scene, this.renderer);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    const dolly = createDolly(this.camera, this.scene);
    dolly.position.set(0, 0, 0);

    const vrControls = new VrControls(this.renderer, dolly, this.camera);
    this.loop.updatables.push(vrControls);

    // Load images 
    // Create the panoramic sphere geometery
    const panoSphereGeo = new THREE.SphereGeometry( 6, 256, 256 );

    // Create the panoramic sphere material
    const panoSphereMat = new THREE.MeshStandardMaterial( {
      side: THREE.BackSide,
      displacementScale: - 4.0
    } );

    // Create the panoramic sphere mesh
    const sphere = new THREE.Mesh( panoSphereGeo, panoSphereMat );

    // Load and assign the texture and depth map
    const manager = new THREE.LoadingManager();
    const loader = new THREE.TextureLoader( manager );

    loader.load( One, function ( texture ) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.NearestFilter;
      texture.generateMipmaps = false;
      sphere.material.map = texture;

    } );

    loader.load( 'https://threejs.org/examples/textures/kandao3_depthmap.jpg', function ( depth ) {

      depth.minFilter = THREE.NearestFilter;
      depth.generateMipmaps = false;
      sphere.material.displacementMap = depth;

    } );

    // On load complete add the panoramic sphere to the scene
    manager.onLoad = () => {

      this.scene.add( sphere );

    };

    const floor = createFloor(this.scene);
    const lights = createLights(this.scene);
    const materialCube = blue(0xffffff);

    // const tmp_cube = cube(materialCube, 10, 10, 10);
    // tmp_cube.position.x = 0;
    // tmp_cube.position.y = 10;
    // tmp_cube.position.z = 0;
    // this.scene.add(tmp_cube);
  }

  start() {
    this.loop.start();
  }

  stop() {
    this.loop.stop();
  }
}

export { World };
