import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';


function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.xr.enabled = true;
  document.body.appendChild(VRButton.createButton(renderer));

  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 3000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 100;

  var controls = new OrbitControls(camera, renderer.domElement);
  controls.listenToKeyEvents(window); // optional

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x333333);


  var bottomLeg = new THREE.Group();

  let material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
  let matteBlackMat = new THREE.MeshPhongMaterial({ color: 0x222222, side: THREE.DoubleSide });
  let matteYellowMat = new THREE.MeshStandardMaterial({ color: 0xFFFF00, side: THREE.DoubleSide });

  {
    let torsoShape = new THREE.Shape();
    torsoShape.moveTo(0, 60);
    torsoShape.bezierCurveTo(0, 60, 4.5, 65, 4.5, 80);
    torsoShape.lineTo(14.5, 80);
    torsoShape.bezierCurveTo(14.5, 80, 14.5, 65, 19, 60);
    torsoShape.lineTo(19, 19.25);
    torsoShape.bezierCurveTo(19, 19.25, 15.5, 14.25, 15.5, 0);
    torsoShape.lineTo(3.5, 0);
    torsoShape.bezierCurveTo(3.5, 0, 3.5, 14.25, 0, 19.25);

    const torsoGeo = new THREE.ExtrudeGeometry(torsoShape, { depth: 16, bevelEnabled: true, bevelThickness: 3, bevelSegments: 10 });
    let torsoMesh = new THREE.Mesh(torsoGeo, matteBlackMat);
    torsoMesh.position.x = - 30;
    scene.add(torsoMesh);
  }



  // scene.add(bottomLeg);

  // const wheelGeo = new THREE.CylinderGeometry(1, 1, 1, 10, 10, false, Math.PI, Math.PI);
  // let wheel = new THREE.Mesh(wheelGeo, material);
  // wheel.rotation.x = Math.PI * 0.5;
  // wheel.rotation.y = Math.PI * 0.5;
  // bottomLeg.add(wheel);

  // const femurGeo = new THREE.BoxGeometry(0.1, 10.1, 0.8);
  // const femurPivot = new THREE.Group();
  // let femurMesh = new THREE.Mesh(femurGeo, material);
  // femurMesh.position.y = 5;
  // femurPivot.add(femurMesh);
  // femurPivot.position.set(0, 0, 0);
  // femurPivot.rotation.z = Math.PI * -0.15;
  // femurPivot.position.x = -0.95;
  // bottomLeg.add(femurPivot);


  // const ankleGeo = new THREE.BoxGeometry(0.1, 2, 0.8);
  // const anklePivot = new THREE.Group();
  // let ankleMesh = new THREE.Mesh(ankleGeo, material);
  // ankleMesh.position.y = 0.9;
  // anklePivot.add(ankleMesh);
  // anklePivot.position.set(0, 0, 0);
  // anklePivot.rotation.z = Math.PI * 0.1;
  // anklePivot.position.x = 0.95;
  // bottomLeg.add(anklePivot);

  // const pivot = new THREE.Object3D();
  // let box = new THREE.Mesh(femurGeo, material);
  // box.position.y = 5;
  // pivot.add(box);
  // pivot.position.set(0, 0, 0);
  // pivot.rotation.z = Math.PI * -0.15;
  // pivot.position.x = -0.95;
  // bottomLeg.add(pivot);
  // bottomLeg.add(box);








  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(100, 100, 100);
    scene.add(light);

    const light2 = new THREE.DirectionalLight(color, intensity);
    light2.position.set(-50, -50, -50);
    scene.add(light2);


  }


  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    //   time *= 0.0004;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    renderer.render(scene, camera);
    renderer.setAnimationLoop(render);
    // requestAnimationFrame(render);
  }


  renderer.setAnimationLoop(render);
  // requestAnimationFrame(render);
}

main();