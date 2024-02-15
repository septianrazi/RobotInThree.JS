import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { MathUtils } from 'three';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.19/+esm';

// global params
let debugMaterial, matteBlackMat, matteYellowMat;
let gui;
let textureLoader;

// -------------------------------------
// Classes for Spot and movement methods
// -------------------------------------

// Parent class for spot
class Spot {
  constructor() {

    if (Spot.instance) {
      return Spot.instance;
    }
    Spot.instance = this;

    this.legs = new Legs();
    this.arm = new Arm();

    this.mesh = this.createSpot();
  }


  // Spot class methods here
  createSpot() {
    let bodyObj = new THREE.Object3D();
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
      torsoMesh.rotation.x = Math.PI * 0.5;
      torsoMesh.position.x = -19 / 2;
      torsoMesh.position.z = -8
      torsoMesh.position.y = 16 / 2;

      bodyObj.add(torsoMesh);
      this.mesh = bodyObj;

      let liveryTextureRight = textureLoader.load('right.jpg');
      let liveryTextureLeft = textureLoader.load('left.jpg');
      let liveryTextureMatRight = new THREE.MeshStandardMaterial({ map: liveryTextureRight });
      let liveryTextureMatLeft = new THREE.MeshStandardMaterial({ map: liveryTextureLeft });
      let liveryTextureMaterials = [
        liveryTextureMatRight,
        liveryTextureMatLeft,
        matteYellowMat,
        matteYellowMat,

        matteYellowMat,
        matteYellowMat
      ]

      let torsoLiveryGeo = new THREE.BoxGeometry(25, 23, 50);
      let torsoLiveryMesh = new THREE.Mesh(torsoLiveryGeo, liveryTextureMaterials);
      torsoLiveryMesh.position.z = 30
      bodyObj.add(torsoLiveryMesh);

    }

    { //head and behind
      const vertices = [
        // front
        { pos: [-1, -1, 0], norm: [0, 0, 1], uv: [0, 0], }, // 0
        { pos: [1, -1, 0], norm: [0, 0, 1], uv: [0.5, 0], }, // 1
        { pos: [-1, 0.8, 1], norm: [0, 0, 1], uv: [0, 0.5], }, // 2
        { pos: [1, 0.8, 1], norm: [0, 0, 1], uv: [0.5, 0.5], }, // 3

        // right
        { pos: [1, -1, 0], norm: [1, 0, 0], uv: [1, 1], }, // 4
        { pos: [1, -1, -1], norm: [1, 0, 0], uv: [2, 1], }, // 5
        { pos: [1, 0.8, 1], norm: [1, 0, 0], uv: [1, 2], }, // 6
        { pos: [1, 1, -1], norm: [1, 0, 0], uv: [2, 2], }, // 7

        // back
        { pos: [1, -1, -1], norm: [0, 0, -1], uv: [1, 1], }, // 8
        { pos: [-1, -1, -1], norm: [0, 0, -1], uv: [2, 1], }, // 9
        { pos: [1, 1, -1], norm: [0, 0, -1], uv: [1, 2], }, // 10
        { pos: [-1, 0, -1], norm: [0, 0, -1], uv: [2, 2], }, // 11


        // left
        { pos: [-1, -1, -1], norm: [-1, 0, 0], uv: [1, 1], }, // 12
        { pos: [-1, -1, 0], norm: [-1, 0, 0], uv: [2, 1], }, // 13
        { pos: [-1, 1, -1], norm: [-1, 0, 0], uv: [1, 2], }, // 14
        { pos: [-1, 0.8, 1], norm: [-1, 0, 0], uv: [2, 2], }, // 15


        // top
        { pos: [1, 1, -1], norm: [0, 1, 0], uv: [1, 1], }, // 16
        { pos: [-1, 1, -1], norm: [0, 1, 0], uv: [2, 1], }, // 17
        { pos: [1, 0.8, 1], norm: [0, 1, 0], uv: [1, 2], }, // 18
        { pos: [-1, 0.8, 1], norm: [0, 1, 0], uv: [2, 2], }, // 19
        // bottom
        { pos: [1, -1, 0], norm: [0, -1, 0], uv: [1, 1], }, // 20
        { pos: [-1, -1, 0], norm: [0, -1, 0], uv: [2, 1], }, // 21
        { pos: [1, -1, -1], norm: [0, -1, 0], uv: [1, 2], }, // 22
        { pos: [-1, -1, -1], norm: [0, -1, 0], uv: [2, 2], }, // 23
      ];

      const numVertices = vertices.length;
      const positionNumComponents = 3;
      const normalNumComponents = 3;
      const uvNumComponents = 2;
      const positions = new Float32Array(numVertices * positionNumComponents);
      const normals = new Float32Array(numVertices * normalNumComponents);
      const uvs = new Float32Array(numVertices * uvNumComponents);
      let posNdx = 0;
      let nrmNdx = 0;
      let uvNdx = 0;
      for (const vertex of vertices) {
        positions.set(vertex.pos, posNdx);
        normals.set(vertex.norm, nrmNdx);
        uvs.set(vertex.uv, uvNdx);
        posNdx += positionNumComponents;
        nrmNdx += normalNumComponents;
        uvNdx += uvNumComponents;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, positionNumComponents));
      geometry.setAttribute(
        'normal',
        new THREE.BufferAttribute(normals, normalNumComponents));
      geometry.setAttribute(
        'uv',
        new THREE.BufferAttribute(uvs, uvNumComponents));

      geometry.setIndex([
        0, 1, 2, 2, 1, 3,  // front
        4, 5, 6, 6, 5, 7,  // right
        8, 9, 10, 10, 9, 11,  // back
        12, 13, 14, 14, 13, 15,  // left
        16, 17, 18, 18, 17, 19,  // top
        20, 21, 22, 22, 21, 23,  // bottom
      ]);

      const frontFaceTexture = textureLoader.load('front_face.png');

      const frontFaceMaterial = new THREE.MeshStandardMaterial({ map: frontFaceTexture });



      const headLivery = new THREE.Mesh(geometry, frontFaceMaterial);
      headLivery.scale.set(10, 12, 10)
      this.mesh.add(headLivery);

      headLivery.rotation.y = (MathUtils.degToRad(180));
      headLivery.position.z = -10

      const back_texture = textureLoader.load('back_face.png');
      const backFaceMaterial = new THREE.MeshStandardMaterial({ map: back_texture });

      const hindLivery = new THREE.Mesh(geometry, backFaceMaterial);
      hindLivery.scale.set(10, 12, 10)
      this.mesh.add(hindLivery);

      hindLivery.position.z = 75

    }

    this.mesh.add(this.legs.legsMesh);
    this.mesh.add(this.arm.baseJoint);
    this.arm.baseJoint.position.y = 16;

    return bodyObj;
  }
}
// Class for spot's arm and its movement methods
class Arm {
  constructor() {
    this.baseJoint = new THREE.Object3D();
    this.lowerArm = new THREE.Object3D();
    this.elbow = new THREE.Object3D();
    this.forearmTwistJoint = new THREE.Object3D();
    this.wristTwistJoint = new THREE.Object3D();
    this.claw = new THREE.Object3D();

    this.createArm();
  }

  //  Creation Methods
  createArm() {
    this.createClaw();
    this.createWristTwist();
    this.createForearmTwist();
    this.createElbow();
    this.createLowerArm();
    this.createBaseJoint();
  }
  createClaw() {
    let claw = new THREE.Object3D();
    let clawHeight = 9;
    let clawGeo = new THREE.BoxGeometry(4, clawHeight, 3);
    let clawMesh = new THREE.Mesh(clawGeo, matteBlackMat);
    clawMesh.position.y = clawHeight / 2;
    clawMesh.position.z = -1;
    clawMesh.rotateX(MathUtils.degToRad(-15));
    claw.add(clawMesh);

    this.claw = claw;
  }
  createWristTwist() {

    let wrist = new THREE.Object3D();
    let wristHeight = 5;
    let wristGeo = new THREE.CylinderGeometry(2.5, 2, wristHeight + 2);
    let wristMesh = new THREE.Mesh(wristGeo, matteBlackMat);
    wristMesh.position.y = wristHeight / 2;

    let bottomClawBaseGeo = new THREE.BoxGeometry(4, 3, 5);
    let bottomClawBaseMesh = new THREE.Mesh(bottomClawBaseGeo, matteBlackMat);
    bottomClawBaseMesh.position.y = wristHeight + 2;


    let bottomClawGeo = new THREE.BoxGeometry(4, 9, 3);
    let bottomClawMesh = new THREE.Mesh(bottomClawGeo, matteBlackMat);
    bottomClawMesh.position.y = wristHeight - 2
    bottomClawMesh.position.z = -4

    bottomClawBaseMesh.add(bottomClawMesh)
    bottomClawBaseMesh.position.y = wristHeight + 2;

    wrist.add(bottomClawBaseMesh);
    wrist.add(wristMesh);

    wrist.add(this.claw)
    this.claw.position.y = wristHeight + 2;
    this.claw.position.z = 1;

    this.claw.rotateX(MathUtils.degToRad(0));

    this.wristTwistJoint = wrist;
  }
  createForearmTwist() {
    let forearm = new THREE.Object3D();
    let forearmLength = 30;
    let forearmGeo = new THREE.CylinderGeometry(2, 3, forearmLength);
    let forearmMesh = new THREE.Mesh(forearmGeo, matteBlackMat);
    forearmMesh.position.y = forearmLength / 2;
    forearm.add(forearmMesh);

    forearm.add(this.wristTwistJoint);
    this.wristTwistJoint.position.y = forearmLength;

    this.forearmTwistJoint = forearm;
  }
  createElbow() {
    let elbow = new THREE.Group();
    let elbowHeight = 20;
    let elbowLower = new THREE.Object3D();
    let lowerElbowGeo = new THREE.BoxGeometry(10, elbowHeight, 6);
    let lowerElbowMesh = new THREE.Mesh(lowerElbowGeo, matteBlackMat);
    lowerElbowMesh.position.y = (elbowHeight / 2) - elbowHeight / 7;

    elbowLower.add(lowerElbowMesh);

    elbowLower.rotateX(MathUtils.degToRad(-120));


    let elbowUpper = new THREE.Object3D();
    let upperElbowGeo = new THREE.BoxGeometry(10, elbowHeight / 2, 6);
    let upperElbowMesh = new THREE.Mesh(upperElbowGeo, matteBlackMat);
    upperElbowMesh.position.y = -(elbowHeight / 2) - elbowHeight / 15
    upperElbowMesh.position.z = -(elbowHeight / 2) - elbowHeight / 6;

    elbowUpper.add(upperElbowMesh)

    elbow.add(elbowLower)
    elbow.add(elbowUpper)

    elbow.add(this.forearmTwistJoint);
    this.forearmTwistJoint.position.z = -(elbowHeight / 2) - elbowHeight / 6;
    this.forearmTwistJoint.position.y = -(elbowHeight / 2) - elbowHeight / 4
    this.forearmTwistJoint.rotateX(MathUtils.degToRad(180));

    this.elbow = elbow;
  }
  createLowerArm() {
    let lowerArm = new THREE.Object3D();

    let jointGeo = new THREE.CylinderGeometry(5, 3, 5);
    jointGeo.rotateZ(MathUtils.degToRad(90));
    let leftJointMesh = new THREE.Mesh(jointGeo, matteBlackMat);
    leftJointMesh.rotation.y = (MathUtils.degToRad(180));
    leftJointMesh.position.x = -7;
    let rightJointMesh = new THREE.Mesh(jointGeo, matteBlackMat);
    rightJointMesh.position.x = 7;

    let middleJointGeo = new THREE.CylinderGeometry(5, 5, 9);
    let middleJointMesh = new THREE.Mesh(middleJointGeo, matteBlackMat);
    middleJointMesh.rotation.z = (MathUtils.degToRad(90));

    lowerArm.add(middleJointMesh);

    lowerArm.add(leftJointMesh);
    lowerArm.add(rightJointMesh);

    let lowerArmLength = 40;

    let lowerArmGeo = new THREE.BoxGeometry(6, lowerArmLength, 6);
    let lowerArmMesh = new THREE.Mesh(lowerArmGeo, matteBlackMat);

    let lowerArmGeoDetail = new THREE.BoxGeometry(8, lowerArmLength / 2, 8);
    let lowerArmDetailMesh = new THREE.Mesh(lowerArmGeoDetail, matteBlackMat);
    lowerArmMesh.add(lowerArmDetailMesh);

    lowerArmMesh.position.y = (lowerArmLength / 2);
    lowerArm.add(lowerArmMesh);


    this.elbow.position.y = lowerArmLength;
    lowerArm.add(this.elbow)
    lowerArm.rotateX(MathUtils.degToRad(90));

    this.lowerArm = lowerArm;
  }
  createBaseJoint() {
    let jointHeight = 7;
    let jointGeo = new THREE.CylinderGeometry(8, 8, jointHeight);
    let jointMesh = new THREE.Mesh(jointGeo, matteBlackMat);
    jointMesh.add(this.lowerArm)
    this.lowerArm.position.y = jointHeight;

    this.baseJoint = jointMesh;
  }

  // movement methods
  rotateBase(deg) {
    this.baseJoint.rotation.y = (MathUtils.degToRad(deg));
  }

  extendLowerArm(deg) {
    this.lowerArm.rotation.x = (MathUtils.degToRad(deg));
  }

  extendElbow(deg) {
    this.elbow.rotation.x = ((MathUtils.degToRad(deg)));
  }

  rotateForearmTwist(deg) {
    this.forearmTwistJoint.rotation.y = (MathUtils.degToRad(deg));
  }

  rotateWristTwist(deg) {
    this.wristTwistJoint.rotation.y = (MathUtils.degToRad(deg));
  }

  extendWristTwist(deg) {
    this.wristTwistJoint.rotation.x = (MathUtils.degToRad(deg));
  }

  extendClaw(deg) {
    this.claw.rotation.x = (MathUtils.degToRad(deg));
  }
}

// Parent class for spot's legs and their movement methods
class Legs {
  constructor() {
    this.legsMesh = new THREE.Object3D();
    this.rightFrontLeg = new Leg();
    this.leftFrontLeg = new Leg();
    this.rightBackLeg = new Leg();
    this.leftBackLeg = new Leg();

    this.init()

    this.abductPrevValue = NaN;
  }

  init() {

    // change position legs
    this.rightFrontLeg.leg.position.x = 10;
    this.rightFrontLeg.leg.position.z = -2;

    this.leftFrontLeg.leg.position.x = -10;
    this.leftFrontLeg.leg.position.z = -2;

    this.rightBackLeg.leg.position.x = 9;
    this.rightBackLeg.leg.position.z = 65;

    this.leftBackLeg.leg.position.x = -9;
    this.leftBackLeg.leg.position.z = 65;

    // change rotation of legs
    this.rightFrontLeg.leg.rotation.y = MathUtils.degToRad(-90);
    this.leftFrontLeg.leg.rotation.y = MathUtils.degToRad(90);
    this.rightBackLeg.leg.rotation.y = MathUtils.degToRad(-90);
    this.leftBackLeg.leg.rotation.y = MathUtils.degToRad(90);


    this.legsMesh.add(this.rightFrontLeg.leg);
    this.legsMesh.add(this.leftFrontLeg.leg);
    this.legsMesh.add(this.rightBackLeg.leg);
    this.legsMesh.add(this.leftBackLeg.leg);

    this.leftBackLeg.knee.rotation.y = MathUtils.degToRad(180);
    this.leftFrontLeg.knee.rotation.y = MathUtils.degToRad(180);

    this.extendAllLegs(-50);
    this.extendAllKnees(-90);
    // this.abductAllLegs(30);


  }

  // movement methods

  extendAllKnees(deg) {
    this.rightFrontLeg.extendKnee(deg);
    this.leftFrontLeg.extendKnee(deg);
    this.rightBackLeg.extendKnee(deg);
    this.leftBackLeg.extendKnee(deg);
  }

  extendAllLegs(deg) {
    this.rightFrontLeg.extendLeg(-deg);
    this.leftFrontLeg.extendLeg(deg);
    this.rightBackLeg.extendLeg(-deg);
    this.leftBackLeg.extendLeg(deg);
  }

  abductAllLegs(deg) {
    if (this.abductPrevValue === deg) return;
    this.rightFrontLeg.abductLeg(deg);
    this.leftFrontLeg.abductLeg(deg);
    this.rightBackLeg.abductLeg(deg);
    this.leftBackLeg.abductLeg(deg);
    this.abductPrevValue = deg;
  }

  extendAllRightKnees(deg) {
    this.rightFrontLeg.extendKnee(deg);
    this.rightBackLeg.extendKnee(deg);
  }

  extendAllRightLegs(deg) {
    this.rightFrontLeg.extendLeg(-deg);
    this.rightBackLeg.extendLeg(-deg);
  }

  extendAllLeftKnees(deg) {
    this.leftFrontLeg.extendKnee(deg);
    this.leftBackLeg.extendKnee(deg);
  }

  extendAllLeftLegs(deg) {
    this.leftFrontLeg.extendLeg(deg);
    this.leftBackLeg.extendLeg(deg);
  }

  extendAllFrontKnees(deg) {
    this.rightFrontLeg.extendKnee(deg);
    this.leftFrontLeg.extendKnee(deg);
  }

  extendAllFrontLegs(deg) {
    this.rightFrontLeg.extendLeg(-deg);
    this.leftFrontLeg.extendLeg(deg);
  }

  extendAllBackKnees(deg) {
    this.rightBackLeg.extendKnee(deg);
    this.leftBackLeg.extendKnee(deg);
  }

  extendAllBackLegs(deg) {
    this.rightBackLeg.extendLeg(-deg);
    this.leftBackLeg.extendLeg(deg);
  }

  extendLeftStepKnees(deg) {
    this.leftFrontLeg.extendKnee(deg);
    this.rightBackLeg.extendKnee(deg);
  }

  extendLeftStepLegs(deg) {
    this.leftFrontLeg.extendLeg(deg);
    this.rightBackLeg.extendLeg(-deg);
  }

  extendRightStepKnees(deg) {
    this.rightFrontLeg.extendKnee(deg);
    this.leftBackLeg.extendKnee(deg);
  }

  extendRightStepLegs(deg) {
    this.rightFrontLeg.extendLeg(-deg);
    this.leftBackLeg.extendLeg(deg);
  }

}

// Class for individual legs for spot
class Leg {
  constructor() {
    this.leg = new THREE.Object3D();
    this.knee = new THREE.Object3D();

    this.createLeg();
  }

  // Leg class methods here
  createLeg() {
    this.createLowerLeg();
    this.createUpperLeg();
  }

  createLowerLeg() {
    // lower leg stuff
    let lowerLegHeight = 50;
    let lowerLeg = new THREE.Object3D();
    const lowerLegGeo = new THREE.BoxGeometry(1.3, lowerLegHeight, 1.0);
    let lowerLegMesh = new THREE.Mesh(lowerLegGeo, matteBlackMat);
    lowerLegMesh.position.y = -1 * (lowerLegHeight / 2 - 7);
    lowerLeg.add(lowerLegMesh);

    { // foot stuff
      let footObj = new THREE.Object3D();

      const wheelGeo = new THREE.CylinderGeometry(1, 1, 1, 10, 10, false, Math.PI, Math.PI);
      let wheel = new THREE.Mesh(wheelGeo, matteBlackMat);
      wheel.rotation.x = Math.PI * 0.5;
      wheel.rotation.y = Math.PI * 0.5;
      footObj.add(wheel);

      const femurGeo = new THREE.BoxGeometry(0.1, 2, 1);
      const femurPivot = new THREE.Group();
      let femurMesh = new THREE.Mesh(femurGeo, matteBlackMat);
      femurMesh.position.y = 0.9;
      femurPivot.add(femurMesh);
      femurPivot.position.set(0, 0, 0);
      femurPivot.rotation.z = Math.PI * -0.1;
      femurPivot.position.x = -0.90;
      footObj.add(femurPivot);


      const ankleGeo = new THREE.BoxGeometry(0.1, 2, 1);
      const anklePivot = new THREE.Group();
      let ankleMesh = new THREE.Mesh(ankleGeo, matteBlackMat);
      ankleMesh.position.y = 0.9;
      anklePivot.add(ankleMesh);
      anklePivot.position.set(0, 0, 0);
      anklePivot.rotation.z = Math.PI * 0.1;
      anklePivot.position.x = 0.90;
      footObj.add(anklePivot);

      footObj.scale.set(2, 2, 1);

      footObj.rotation.z = Math.PI * 0.1;
      footObj.position.x = 1.15
      footObj.position.y = -lowerLegHeight + 4;
      lowerLeg.add(footObj);

    }

    lowerLeg.scale.set(2, 1, 2);

    lowerLeg.position.z = -5;

    this.knee = lowerLeg;
  }

  createUpperLeg() // upper leg stuff
  {
    let upperLegHeight = 45;
    let upperLeg = new THREE.Object3D();
    let femurComplete = new THREE.Object3D();
    { // femur
      let femur = new THREE.Object3D();
      const upperLegGeo = new THREE.BoxGeometry(2.6, upperLegHeight, 2);
      let upperLegMesh = new THREE.Mesh(upperLegGeo, matteBlackMat);
      upperLegMesh.position.y = -upperLegHeight / 2;
      femur.add(upperLegMesh);


      const upperLegLiveryGeo = new THREE.CylinderGeometry(3, 3, upperLegHeight + 2, 10, 10, false, MathUtils.degToRad(20), MathUtils.degToRad(160));
      let upperLegLiveryMesh = new THREE.Mesh(upperLegLiveryGeo, matteYellowMat);
      upperLegLiveryMesh.position.y = -upperLegHeight / 2;
      femur.add(upperLegLiveryMesh);

      femur.scale.set(1.5, 1, 1.5);
      femur.position.x = 5;
      femur.position.y = 5;

      femurComplete.add(femur);
    }


    { // joints
      let joint = new THREE.Object3D();
      const jointBigGeo = new THREE.CylinderGeometry(5, 5, 3, 6, 6);
      const jointSmallGeo = new THREE.CylinderGeometry(3, 3, 2);
      let jointBigMesh = new THREE.Mesh(jointBigGeo, matteBlackMat);
      let jointSmallMesh = new THREE.Mesh(jointSmallGeo, matteBlackMat);
      joint.add(jointBigMesh);
      joint.add(jointSmallMesh);
      jointSmallMesh.position.y = 2.5;
      joint.scale.set(0.8, 0.8, 0.8);

      joint.rotation.z = MathUtils.degToRad(-90);

      femurComplete.add(joint);
    }

    femurComplete.rotation.y = MathUtils.degToRad(90);
    upperLeg.add(femurComplete);

    this.knee.position.y = -1 * (upperLegHeight - 10);
    upperLeg.add(this.knee);
    this.leg = upperLeg;
  }

  // movement Methods
  extendKnee(deg) {
    this.knee.rotation.z = (MathUtils.degToRad(deg));
  }

  extendLeg(deg) {
    this.leg.rotation.z = (MathUtils.degToRad(deg));
  }

  abductLeg(deg) {
    this.leg = this.leg.rotateX(MathUtils.degToRad(deg)); // have to use this cuz of gymbal lock
    // this.leg.rotation.x = ((MathUtils.degToRad(deg)));
  }
}

// Add Gui Controls to scene
function addGuiControls() {
  gui = new GUI();
  let armKeyFrames = {
    'rotateBase': 3,
    'extendLowerArm': 30,
    'extendElbow': 30,
    'rotateForearmTwist': 30,
    'extendWristTwist': 30,
    'rotateWristTwist': 30,
    'extendClaw': 30,
  }

  const jointControls = gui.addFolder('Joint Controls');

  const folderArm = jointControls.addFolder('Arm');
  for (const key in armKeyFrames) {
    if (armKeyFrames.hasOwnProperty(key)) {
      folderArm.add(armKeyFrames, key, 0, 360).onChange(value => {
        spot.arm[key](value);
      });
    }
  }

  const folderLegs = jointControls.addFolder('Legs');


  let leftBackLegKeyFrames = {
    'extendKnee': 30,
    'extendLeg': 30,
    'abductLeg': 30,
  }
  const leftBackfolderLegs = folderLegs.addFolder('Left Back');
  for (const key in leftBackLegKeyFrames) {
    if (leftBackLegKeyFrames.hasOwnProperty(key)) {
      leftBackfolderLegs.add(leftBackLegKeyFrames, key, 0, 360).onChange(value => {
        spot.legs.leftBackLeg[key](value);
      });
    }
  }

  let rightBackLegKeyFrames = {
    'extendKnee': 30,
    'extendLeg': 30,
    'abductLeg': 30,
  }
  const rightBackfolderLegs = folderLegs.addFolder('Right Back');
  for (const key in rightBackLegKeyFrames) {
    if (rightBackLegKeyFrames.hasOwnProperty(key)) {
      rightBackfolderLegs.add(rightBackLegKeyFrames, key, 0, 360).onChange(value => {
        spot.legs.rightBackLeg[key](value);
      });
    }
  }

  let leftFrontLegKeyFrames = {
    'extendKnee': 30,
    'extendLeg': 30,
    'abductLeg': 30,
  }
  const leftFrontfolderLegs = folderLegs.addFolder('Left Front');
  for (const key in leftFrontLegKeyFrames) {
    if (leftFrontLegKeyFrames.hasOwnProperty(key)) {
      leftFrontfolderLegs.add(leftFrontLegKeyFrames, key, 0, 360).onChange(value => {
        spot.legs.leftFrontLeg[key](value);
      });
    }
  }

  let rightFrontLegKeyFrames = {
    'extendKnee': 30,
    'extendLeg': 30,
    'abductLeg': 30,
  }
  const rightFrontfolderLegs = folderLegs.addFolder('Right Front');
  for (const key in rightFrontLegKeyFrames) {
    if (rightFrontLegKeyFrames.hasOwnProperty(key)) {
      rightFrontfolderLegs.add(rightFrontLegKeyFrames, key, 0, 360).onChange(value => {
        spot.legs.rightFrontLeg[key](value);
      });
    }
  }

  let allLegsKeyFrames = {
    'extendAllKnees': 30,
    'extendAllLegs': 30,
    'abductAllLegs': 30,
  }
  const folderLegsAll = jointControls.addFolder('Legs (Grouped)');
  for (const key in allLegsKeyFrames) {
    if (allLegsKeyFrames.hasOwnProperty(key)) {
      folderLegsAll.add(allLegsKeyFrames, key, 0, 360).onChange(value => {
        spot.legs[key](value);
      });
    }
  }
  jointControls.close()
  gui.close()


}

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.xr.enabled = true;
  document.body.appendChild(VRButton.createButton(renderer));

  // --------
  // Camera and Scene Setup
  // --------
  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 3000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  // camera.position.set(1000, 0, 50);
  camera.position.set(10, 1.6, -10);
  camera.lookAt(2, 1.4, 2);

  var controls = new FlyControls(camera, renderer.domElement);
  controls.dragToLook = true;
  controls.movementSpeed = 0.1;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x333333);

  textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('yellow.png');
  matteYellowMat = new THREE.MeshPhongMaterial({ map: texture });
  matteBlackMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
  debugMaterial = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });

  var axesHelper = new THREE.AxesHelper(100);
  scene.add(axesHelper);

  addGuiControls();

  // ----------
  // LIGHTING
  // ---------
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

  // Add Grid Helper
  const gridHelper = new THREE.GridHelper(200, 200);
  scene.add(gridHelper);

  // Spawn Spot
  let spot = new Spot();
  let spotInitPos = new THREE.Vector3(1, 0.65, 1);
  spot.mesh.position.set(spotInitPos.x, spotInitPos.y, spotInitPos.z);
  spot.mesh.scale.set(0.01, 0.01, 0.01);
  scene.add(spot.mesh);


  // ---------
  // ANIMATION 
  // ---------
  let animationParams = {
    "walkAnimationFlag": true,
    "runAnimationFlag": false,
    "armAnimationFlag": true,
    "flyAwayAnimationFlag": false,
    "followSpot": false,
    "animateWithMovement": true,
  }

  const folderAnimation = gui.addFolder('Animations', 0);
  for (const key in animationParams) {
    if (animationParams.hasOwnProperty(key)) {
      folderAnimation.add(animationParams, key).onChange(value => {
        spot.mesh.position.set(spotInitPos.x, spotInitPos.y, spotInitPos.z);
      });
    }
  }
  // Assuming `mesh` is your THREE.Mesh object
  let frame = 0;
  function animate() {

    frame++;
    // requestAnimationFrame(animate);

    if (animationParams.walkAnimationFlag)
      animateWalk(frame)
    if (animationParams.runAnimationFlag)
      animateRun(frame)
    if (animationParams.armAnimationFlag)
      animateArm(frame)
    if (animationParams.flyAwayAnimationFlag)
      flyAway(frame)

    renderer.render(scene, camera);

    function animateWalk(frame) {

      if (animationParams.animateWithMovement) {
        spot.mesh.position.z -= 0.01;
        if (spot.mesh.position.z < -25) {
          spot.mesh.position.z = 25;
        }
        spot.mesh.position.y = spotInitPos.y + 0.1 + Math.cos(frame / 15) / 40
      }

      if (animationParams.followSpot)
        camera.lookAt(spot.mesh.position)

      spot.legs.extendLeftStepKnees(290 + Math.sin(frame / 30) * 40);
      spot.legs.extendLeftStepLegs(300 + Math.cos(frame / 30) * 10);

      spot.legs.extendRightStepKnees(290 + Math.cos(frame / 30) * 40);
      spot.legs.extendRightStepLegs(300 + Math.sin(frame / 30) * 10);
    }

    function animateRun(frame) {

      if (animationParams.animateWithMovement) {
        spot.mesh.position.z -= 0.05;
        if (spot.mesh.position.z < -25) {
          spot.mesh.position.z = 25;
        }
        spot.mesh.position.y = spotInitPos.y + 0.1 + Math.cos(frame / 20) * 2 / 40
      }

      if (animationParams.followSpot)
        camera.lookAt(spot.mesh.position)

      spot.legs.extendAllBackKnees(300 + Math.sin(frame / 20) * 50);
      spot.legs.extendAllBackLegs(300 + Math.cos(frame / 20) * 20);

      spot.legs.extendAllFrontKnees(-325 + Math.cos(frame / 20) * 50);
      spot.legs.extendAllFrontLegs(-325 + Math.sin(frame / 20) * 20);
    }

    function animateArm(frame) {
      spot.arm.baseJoint.rotation.y = 6 + Math.sin(frame / 200);
      spot.arm.lowerArm.rotation.x = -150 + Math.sin(frame / 200) * 0.5;
      spot.arm.elbow.rotation.x = -150 + Math.sin(frame / 100) * 0.5;
      spot.arm.forearmTwistJoint.rotation.y = Math.sin(frame / 100);
      spot.arm.wristTwistJoint.rotation.y = Math.sin(frame / 50);
      spot.arm.wristTwistJoint.rotation.x = Math.sin(frame / 100);
      spot.arm.claw.rotation.x = -150 - Math.sin(frame / 30);
    }

    function flyAway(frame) {

      if (animationParams.animateWithMovement) {
        spot.mesh.position.z -= 0.1;
        spot.mesh.position.y += (0.5 + Math.cos(frame / 20) + Math.sin(frame / 100)) / 20;
      }
      if (spot.mesh.position.z < -50) {
        spot.mesh.position.z = 50;
        spot.mesh.position.y = 5;
      }

      if (animationParams.followSpot)
        camera.lookAt(spot.mesh.position)

      spot.legs.abductAllLegs(45);
      spot.legs.extendAllKnees(210 + Math.cos(frame / 50));

      spot.arm.elbow.rotation.x = (90);
      spot.arm.rotateBase(frame * 100);
    }
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


  function render() {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    controls.update(0.5); // only required if controls.enableDamping = true, or if controls.autoRotate = true

    animate();
    renderer.render(scene, camera);
    renderer.setAnimationLoop(render);
  }


  renderer.setAnimationLoop(render);
  // animate();
  // renderer.setAnimationLoop(animate);
  // requestAnimationFrame(render);
}




main();