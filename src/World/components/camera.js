import { PerspectiveCamera, Group } from 'three';

const createCamera = () => {
  const camera = new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 2000 );
  return camera;
}

const createDolly = (camera, scene) => {
  const dolly = new Group();
  dolly.name = "dolly";
  scene.add(dolly);
  dolly.add(camera);
  return dolly;
}

export { createCamera, createDolly };