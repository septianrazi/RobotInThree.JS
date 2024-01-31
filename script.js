import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';

let perspCam, orthCam, controls, controls2, scene, renderer, view1Elem, view2Elem, canvas, geometries, material, primitiveMeshes;

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x11111111);
  scene.fog = new THREE.Fog(0xcccccc, 1, 15);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  canvas = document.querySelector('#c');
  view1Elem = document.querySelector('#view1');
  view2Elem = document.querySelector('#view2');

  perspCam = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  perspCam.position.set(80, 160, 300);

  orthCam = new THREE.OrthographicCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  // orthCam.position.set(80, 160, 300);

  orthCam.position.set(40, 10, 30);
  orthCam.lookAt(0, 5, 0);

  // controls
  controls = new OrbitControls(perspCam, view1Elem);
  controls2 = new OrbitControls(orthCam, view2Elem);
  controls.listenToKeyEvents(window); // optional
  controls2.update();

  controls.enableDamping = false; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;
  controls.target.set(50, 50, 0);

  controls.screenSpacePanning = false;

  controls.minDistance = 100;
  controls.maxDistance = 500;

  controls.maxPolarAngle = Math.PI / 2;


  // edges
  //wireframe

  // Material
  material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });

  // primitives
  var width = 10;
  var height = 10;
  var depth = 10;
  var segments = 20
  geometries = [[], [], []]


  const boxGeo = new THREE.BoxGeometry(width, height, depth);
  geometries[0].push(boxGeo);
  const boxGeo2 = new THREE.BoxGeometry(width, height / 3, depth / 2);
  geometries[1].push(boxGeo2);
  const boxGeo3 = new THREE.BoxGeometry(width / 2, height, depth * 2, segments, segments, segments);
  geometries[2].push(boxGeo3);

  const circleGeo = new THREE.CircleGeometry(width);
  geometries[0].push(circleGeo);
  const circleGeo2 = new THREE.CircleGeometry(width, segments * 2, Math.PI / 2, Math.PI * 4 / 3);
  geometries[1].push(circleGeo2);
  const circleGeo3 = new THREE.CircleGeometry(width, segments * 2, -Math.PI / 2, Math.PI * 1.1);
  geometries[2].push(circleGeo3);

  const coneGeo = new THREE.ConeGeometry(width, height);
  geometries[0].push(coneGeo);
  const coneGeo2 = new THREE.ConeGeometry(width, height * 1.5, segments, segments, true, Math.PI / 2, Math.PI * 4 / 3);
  geometries[1].push(coneGeo2);
  const coneGeo3 = new THREE.ConeGeometry(width / 1.5, height * 1.5, segments, segments, false, Math.PI, -Math.PI * 4 / 5);
  geometries[2].push(coneGeo3);


  const cylinderGeo = new THREE.CylinderGeometry(width, width, height);
  geometries[0].push(cylinderGeo);
  const cylinderGeo2 = new THREE.CylinderGeometry(width, width * 1.1, height, segments, segments, true, Math.PI / 4, Math.PI * 1.5);
  geometries[1].push(cylinderGeo2);
  const cylinderGeo3 = new THREE.CylinderGeometry(width, width * 1.1, height, segments, segments, false, Math.PI, -Math.PI * 6 / 5);
  geometries[2].push(cylinderGeo3);


  const dodecahedronGeo = new THREE.DodecahedronGeometry(width);
  geometries[0].push(dodecahedronGeo);
  const dodecahedronGeo2 = new THREE.DodecahedronGeometry(width, 1);
  geometries[1].push(dodecahedronGeo2);
  const dodecahedronGeo3 = new THREE.DodecahedronGeometry(width / 2, 3);
  geometries[2].push(dodecahedronGeo3);


  const icosahedronGeo = new THREE.IcosahedronGeometry(width);
  geometries[0].push(icosahedronGeo);
  const icosahedronGeo2 = new THREE.IcosahedronGeometry(width, 1);
  geometries[1].push(icosahedronGeo2);
  const icosahedronGeo3 = new THREE.IcosahedronGeometry(width / 2, 2);
  geometries[2].push(icosahedronGeo3);


  const octahedronGeo = new THREE.OctahedronGeometry(width);
  geometries[0].push(octahedronGeo);
  const octahedronGeo2 = new THREE.OctahedronGeometry(width, 1);
  geometries[1].push(octahedronGeo2);
  const octahedronGeo3 = new THREE.OctahedronGeometry(width / 2, 2);
  geometries[2].push(octahedronGeo3);

  const tetraGeo = new THREE.TetrahedronGeometry(width);
  geometries[0].push(tetraGeo);
  const tetraGeo2 = new THREE.TetrahedronGeometry(width, 1);
  geometries[1].push(tetraGeo2);
  const tetraGeo3 = new THREE.TetrahedronGeometry(width / 2, 2);
  geometries[2].push(tetraGeo3);

  const planeGeo = new THREE.PlaneGeometry(width, height);
  geometries[0].push(planeGeo);
  const planeGeo2 = new THREE.PlaneGeometry(width, height * 1.3, segments, segments);
  geometries[1].push(planeGeo2);
  const planeGeo3 = new THREE.PlaneGeometry(width * 2, height, 1, 1);
  geometries[2].push(planeGeo3);

  const ringGeo = new THREE.RingGeometry(width / 2, width);
  geometries[0].push(ringGeo);
  const ringGeo2 = new THREE.RingGeometry(width / 2, width, segments, segments, Math.PI / 2, Math.PI * 4 / 3);
  geometries[1].push(ringGeo2);
  const ringGeo3 = new THREE.RingGeometry(width / 2, width, 1, 1, -Math.PI / 2, Math.PI * 4 / 3);
  geometries[2].push(ringGeo3);

  const sphereGeo = new THREE.SphereGeometry(width);
  geometries[0].push(sphereGeo);
  const sphereGeo2 = new THREE.SphereGeometry(width, segments, segments, Math.PI / 2, Math.PI * 4 / 3);
  geometries[1].push(sphereGeo2);
  const sphereGeo3 = new THREE.SphereGeometry(width, segments, segments, Math.PI / 2, Math.PI * 4 / 3, 1, 1);
  geometries[2].push(sphereGeo3);


  const torusGeo = new THREE.TorusGeometry(width / 2, width / 3);
  geometries[0].push(torusGeo);
  const torusGeo2 = new THREE.TorusGeometry(width / 1.5, width / 5);
  geometries[1].push(torusGeo2);
  const torusGeo3 = new THREE.TorusGeometry(width / 1.5, width / 5, 5, 5);
  geometries[2].push(torusGeo3);

  const torusKnotGeo = new THREE.TorusKnotGeometry(width / 2, width / 3);
  geometries[0].push(torusKnotGeo);
  const torusKnotGeo2 = new THREE.TorusKnotGeometry(width / 2, width / 3, segments, segments, 3, 1);
  geometries[1].push(torusKnotGeo2);
  const torusKnotGeo3 = new THREE.TorusKnotGeometry(width / 2, width / 3, 10, 10, 4, 1);
  geometries[2].push(torusKnotGeo3);

  {
    // Create curve for tube
    const point1 = new THREE.Vector3(-5, -5, 0);
    const point2 = new THREE.Vector3(0, 5, 0);
    const point3 = new THREE.Vector3(5, 0, 0);

    const curve = new THREE.QuadraticBezierCurve3(point1, point2, point3);
    const tubeGeo = new THREE.TubeGeometry(curve, segments, width / 3, 8, false);
    geometries[0].push(tubeGeo);
  }
  {
    // Create curve for tube
    const point1 = new THREE.Vector3(-5, -5, 0);
    const point2 = new THREE.Vector3(0, 5, 0);
    const point3 = new THREE.Vector3(5, -10, 0);
    const point4 = new THREE.Vector3(10, -5, 7);

    const curve = new THREE.CubicBezierCurve3(point1, point2, point3, point4);
    const tubeGeo2 = new THREE.TubeGeometry(curve, segments, width / 8, 8, false);
    geometries[1].push(tubeGeo2);
  }

  {
    // Create curve for tube
    const point1 = new THREE.Vector3(-5, -5, 0);
    const point2 = new THREE.Vector3(0, 5, 0);
    const point3 = new THREE.Vector3(10, 10, 0);
    const point4 = new THREE.Vector3(10, -5, 7);

    const curve = new THREE.CubicBezierCurve3(point1, point2, point3, point4);
    const tubeGeo3 = new THREE.TubeGeometry(curve, segments, width / 8, 8, true);
    geometries[2].push(tubeGeo3);
  }

  {
    // Create lathe points
    const points = [
      new THREE.Vector2(5, 0),
      new THREE.Vector2(8, 5),
      new THREE.Vector2(15, 7),
    ];

    const latheGeo = new THREE.LatheGeometry(points, segments);
    geometries[0].push(latheGeo);
  }
  {
    // Create lathe points
    const points = [
      new THREE.Vector2(5, 0),
      new THREE.Vector2(8, 5),
      new THREE.Vector2(15, 7),
    ];

    const latheGeo2 = new THREE.LatheGeometry(points, segments, Math.PI / 2, Math.PI * 4 / 3);
    geometries[1].push(latheGeo2);
  }
  {
    // Create lathe points
    const points = [
      new THREE.Vector2(5, 0),
      new THREE.Vector2(8, 5),
      new THREE.Vector2(15, 7),
      new THREE.Vector2(-7, 12),
    ];

    const latheGeo3 = new THREE.LatheGeometry(points, segments, -Math.PI, Math.PI);
    geometries[2].push(latheGeo3);
  }

  {
    // create shape for extrudeGeometry
    let crown = new THREE.Shape();
    crown.moveTo(0, 0); crown.lineTo(-5, 0)
    crown.lineTo(-7, 8)
    crown.lineTo(-3, 5)
    crown.lineTo(0, 8)
    crown.lineTo(3, 5)
    crown.lineTo(7, 8)
    crown.lineTo(5, 0)

    const shapeGeo = new THREE.ShapeGeometry(crown);
    geometries[0].push(shapeGeo);

    const extrudeSettings = { depth: 8, bevelEnabled: true };
    const extrudeGeo = new THREE.ExtrudeGeometry(crown, extrudeSettings);
    geometries[0].push(extrudeGeo);
  }
  {
    // create shape for extrudeGeometry
    let shape = new THREE.Shape();
    shape.moveTo(-5, -5);
    shape.bezierCurveTo(-10, 2, -2, 1, 0, 7);
    shape.bezierCurveTo(-2, 2, 10, 1, 5, -5);

    const shapeGeo2 = new THREE.ShapeGeometry(shape, 3);
    geometries[1].push(shapeGeo2);

    const extrudeSettings = { depth: 8, bevelEnabled: false, bevelSize: 4 };
    const extrudeGeo2 = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometries[1].push(extrudeGeo2);
  }

  {
    // create shape for extrudeGeometry
    let shape = new THREE.Shape();
    shape.moveTo(-5, -5);
    shape.bezierCurveTo(-10, 2, -2, 1, 0, 7);
    shape.bezierCurveTo(-2, 2, 10, 1, 5, -5);

    const shapeGeo3 = new THREE.ShapeGeometry(shape, segments);
    geometries[2].push(shapeGeo3);

    const extrudeSettings = { depth: 8, bevelEnabled: true, bevelThickness: 3, bevelSegments: 2 };
    const extrudeGeo3 = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometries[2].push(extrudeGeo3);
  }


  // Create polyhedron
  const verticesOfCube = [
    - 3, - 3, - 1, 3, - 3, - 1, 1, 1, - 1, - 1, 1, - 1,
    - 3, - 3, 1, 3, - 3, 1, 1, 1, 1, - 1, 1, 1,
  ];
  const indicesOfFaces = [
    2, 1, 0, 0, 3, 2,
    0, 4, 7, 7, 3, 0,
    0, 1, 5, 5, 4, 0,
    1, 2, 6, 6, 5, 1,
    2, 3, 7, 7, 6, 2,
    4, 5, 6, 6, 7, 4,
  ];



  const polyGeo = new THREE.PolyhedronGeometry(verticesOfCube, indicesOfFaces, width);
  geometries[0].push(polyGeo);
  const polyGeo2 = new THREE.PolyhedronGeometry(verticesOfCube, indicesOfFaces, width, 2);
  geometries[1].push(polyGeo2);
  const polyGeo3 = new THREE.PolyhedronGeometry(verticesOfCube, [0, 1, 2], width);
  geometries[2].push(polyGeo3);

  // Create parametric geometry
  const parametricFunction = function (u, v, target) {
    let z = (u ** 2 - v ** 2) % 0.5;

    target.set(u, v, z).multiplyScalar(10);
  }
  const parametricGeo = new ParametricGeometry(parametricFunction, segments, segments);
  geometries[0].push(parametricGeo);

  // Create parametric geometry
  const parametricSaddle = function (u, v, target) {
    let z = 2 * (u ** 3 - v ** 3);

    target.set(u, v, z).multiplyScalar(10);
  }
  const parametricGeo2 = new ParametricGeometry(parametricSaddle, segments, segments);
  geometries[1].push(parametricGeo2);
  const parametricGeo3 = new ParametricGeometry(parametricSaddle, 2, 2);
  geometries[2].push(parametricGeo3);


  const edgeGeo = new THREE.EdgesGeometry(cylinderGeo, 1);
  geometries[0].push(edgeGeo);
  const edgeGeo2 = new THREE.EdgesGeometry(cylinderGeo, 20);
  geometries[1].push(edgeGeo2);
  const edgeGeo3 = new THREE.EdgesGeometry(sphereGeo3);
  geometries[2].push(edgeGeo3);

  const wireframeGeo = new THREE.WireframeGeometry(cylinderGeo);
  geometries[0].push(wireframeGeo);
  const wireframeGeo2 = new THREE.WireframeGeometry(cylinderGeo);
  geometries[1].push(wireframeGeo2);
  const wireframeGeo3 = new THREE.WireframeGeometry(sphereGeo3);
  geometries[2].push(wireframeGeo3);


  // Text (make sure this is last)
  const loader = new FontLoader();
  loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeo = new TextGeometry('Imagine\nDragons?', {
      font: font,
      size: 3,
      height: 2,
    });
    geometries[0].push(textGeo);

    const textGeo2 = new TextGeometry('Imagine\nDragons?', {
      font: font,
      size: 2,
      height: 2,
      curveSegments: 1,
      bevelEnabled: true,
      bevelThickness: 0.001,
      bevelSize: .3,
      bevelSegments: 1,
    });
    geometries[1].push(textGeo2);



    addMeshesToScene(geometries[0], 0); // we wait for the font to load before adding meshes
    addMeshesToScene(geometries[1], 50); // we wait for the font to load before adding meshes
  });

  loader.load('https://threejs.org/examples/fonts/gentilis_regular.typeface.json', (font2) => {
    const textGeo3 = new TextGeometry('Imagine\nDragons?', {
      font: font2,
      size: 5,
      height: 1,
      curveSegments: segments,
      bevelEnabled: false,
    });
    geometries[2].push(textGeo3);
    addMeshesToScene(geometries[2], 100); // we wait for the font to load before adding meshes

  });



  // lights
  const dirLight1 = new THREE.DirectionalLight(0xffffff);
  dirLight1.position.set(1, 1, 1);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x002288);
  dirLight2.position.set(-1, -1, -1);
  scene.add(dirLight2);

  const ambientLight = new THREE.AmbientLight(0x442222);
  scene.add(ambientLight);

  //axes
  var axesHelper = new THREE.AxesHelper(100);
  scene.add(axesHelper);

  window.addEventListener("resize", onWindowResize);

  floor();

}

function setScissorForElement(elem) {
  const canvasRect = canvas.getBoundingClientRect();
  const elemRect = elem.getBoundingClientRect();

  // compute a canvas relative rectangle
  const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
  const left = Math.max(0, elemRect.left - canvasRect.left);
  const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
  const top = Math.max(0, elemRect.top - canvasRect.top);

  const width = Math.min(canvasRect.width, right - left);
  const height = Math.min(canvasRect.height, bottom - top);

  // setup the scissor to only render to that part of the canvas
  const positiveYUpBottom = canvasRect.height - bottom;
  renderer.setScissor(left, positiveYUpBottom, width, height);
  renderer.setViewport(left, positiveYUpBottom, width, height);

  // return the aspect
  return width / height;
}

/**
 * Draws a floor grid of crosses with spotlight affect around the x/z offset.
 */
function floor() {
  let xOffset = 50;
  let zOffset = 50;
  let spacing = 10
  var gridRows = 50;
  for (var x = -gridRows / 2; x < gridRows; x++) {
    for (var z = -gridRows / 2; z < gridRows; z++) {
      cross(xOffset + x * spacing, zOffset + z * spacing, spacing / 3, xOffset, zOffset);
    }
  }
}


/**
 * Draws a cross shape at the specified position with a specified opacity.
 * @param {number} x - The x-coordinate of the center of the cross.
 * @param {number} z - The z-coordinate of the center of the cross.
 * @param {number} size - The size of the cross.
 * @param {number} xOffset - The x-coordinate offset.
 * @param {number} zOffset - The z-coordinate offset.
 */
function cross(x, z, size, xOffset, zOffset) {
  let op = 1 - Math.sqrt((x - xOffset) ** 2 + (z - zOffset) ** 2) / 150;

  let lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: op
  });
  // line 1
  let x1s = x - size / 2;
  let x1e = x + size / 2;
  let z1 = z

  const points1 = [];
  points1.push(new THREE.Vector3(x1s, 0, z1));
  points1.push(new THREE.Vector3(x1e, 0, z1));
  const line1Geo = new THREE.BufferGeometry().setFromPoints(points1);
  const line1 = new THREE.Line(line1Geo, lineMaterial);
  scene.add(line1);

  // line 2
  let x2 = x;
  let z2s = z - size / 2;
  let z2e = z + size / 2;

  const points2 = [];
  points2.push(new THREE.Vector3(x2, 0, z2s));
  points2.push(new THREE.Vector3(x2, 0, z2e));
  const line2Geo = new THREE.BufferGeometry().setFromPoints(points2);
  const line2 = new THREE.Line(line2Geo, lineMaterial);
  scene.add(line2);
}

function onWindowResize() {
  console.log(window.innerWidth);
  perspCam.aspect = window.innerWidth / window.innerHeight;
  perspCam.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}


/**
 * Converts geometries to meshes and adds to the scene as a grid on the XY plane based on the specified z
 * @param {Array} geometries - An array of geometries to create meshes from.
 * @param {number} z - The z-coordinate of the meshes.
 */
function addMeshesToScene(geometries, z) {
  var gridRows = 5;
  primitiveMeshes = []
  for (var x = 0; x < gridRows; x++) {
    for (var y = 0; y < gridRows; y++) {

      const thisGeo = geometries[y * gridRows + x];
      let mesh;
      if (thisGeo instanceof THREE.WireframeGeometry || thisGeo instanceof THREE.EdgesGeometry) {
        const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        mesh = new THREE.LineSegments(thisGeo, edgeMaterial);
      } else {
        mesh = new THREE.Mesh(thisGeo, material);
      }

      mesh.position.x = x * 25;
      mesh.position.y = 50 + y * 25;
      mesh.position.z = z;
      mesh.updateMatrix();
      mesh.matrixAutoUpdate = false;
      primitiveMeshes.push(mesh);
      scene.add(mesh);
    }
  }
}

function animate() {
  requestAnimationFrame(animate);

  controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

  render();
}

function render() {
  // renderer.render(scene, perspCam);
  renderer.setScissorTest(true);

  // render the original view
  {
    const aspect = setScissorForElement(view1Elem);

    // adjust the camera for this aspect
    perspCam.aspect = aspect;
    perspCam.updateProjectionMatrix();
    // cameraHelper.update();

    // don't draw the camera helper in the original view
    // cameraHelper.visible = false;

    scene.background.set(0x000000);

    // render
    renderer.render(scene, perspCam);
  }

  // render from the 2nd camera
  {
    const aspect = setScissorForElement(view2Elem);

    // adjust the camera for this aspect
    orthCam.aspect = aspect;
    orthCam.updateProjectionMatrix();

    // draw the camera helper in the 2nd view
    // cameraHelper.visible = true;

    scene.background.set(0x000040);

    renderer.render(scene, orthCam);
  }
}