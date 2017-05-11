// import Detector and OrbitControls

import store from "../../store"
import * as THREE from 'three';
var OrbitControls = require('three-orbit-controls')(THREE)
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

//attach everything to the DOM
export var camera = new THREE.PerspectiveCamera(40, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
export var scene = new THREE.Scene();
export var renderer = new THREE.WebGLRenderer({
    antialias: true
});

var robotModel;

export const init = () => {
    camera.position.set(700, 200, -500);

    var loader = new THREE.JSONLoader()
    robotModel = loader.parse(Window.robotjelly);

    renderer.setPixelRatio(window.devicePixelRatio);

    var container = document.createElement('div');
    document.body.appendChild(container);
    container.appendChild(renderer.domElement);

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

    var stats;
    var clock = new THREE.Clock();
    var controls = new OrbitControls(camera);
    controls.maxPolarAngle = 0.9 * Math.PI / 2;
    controls.enableZoom = false;

    var light = new THREE.DirectionalLight(0xaabbff, 0.3);
    light.position.x = 300;
    light.position.y = 250;
    light.position.z = -500;
    scene.add(light);

    var ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);

    // SKYDOME

    var vertexShader = document.getElementById('vertexShader').textContent;
    var fragmentShader = document.getElementById('fragmentShader').textContent;
    var uniforms = {
        topColor: {
            type: "c",
            value: new THREE.Color(0x0077ff)
        },
        bottomColor: {
            type: "c",
            value: new THREE.Color(0xffffff)
        },
        offset: {
            type: "f",
            value: 400
        },
        exponent: {
            type: "f",
            value: 0.6
        }
    };
    uniforms.topColor.value.copy(light.color);

    var skyGeo = new THREE.SphereGeometry(4000, 32, 15);
    var skyMat = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.BackSide
    });

    var sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);

    // STATS
    stats = new Stats();
    container.appendChild(stats.dom);

    // MODEL
    loader.load("obj/lightmap/lightmap.js", function(geometry, materials) {
        for (var i = 0; i < materials.length; i++) {
            materials[i].lightMapIntensity = 0.1;
        }

        var mesh = new THREE.Mesh(geometry, materials);
        mesh.scale.multiplyScalar(100);
        scene.add(mesh);
    });

    var ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);
    //
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function buildRobot(robot){
  var ThreeRobot = new THREE.Mesh(robotModel.geometry, robotModel.materials)
  ThreeRobot.position.set(robot.x, robot.y, robot.z);
  ThreeRobot.scale.set(40, 40, 40);
  window.robot = ThreeRobot
  scene.add(ThreeRobot);
  console.log(ThreeRobot, 'is this in the scene?')
  return ThreeRobot;
}


function makeProjectile(projectile){
    var geo = new THREE.SphereGeometry( 5, 32, 32 );
    var mat = new THREE.MeshBasicMaterial( {color: "rgb(132, 6, 0)"} );
    var practiceSphere = new THREE.Mesh( geo, mat );
    practiceSphere.position.set(projectile.x, 60 ,projectile.z);
    practiceSphere.scale.set(3, 3, 3);
    scene.add(practiceSphere)
    return practiceSphere
}

// function removeProjectile(projectile) {
//   //poor garbage collection - might need to also remove materials and geometries
// }

//SW: keep game loop in mind - can affect future performance
//SW: but don't pre optimize
var projectiles = {}
var robots = {}

export const animate = () => {
    var storeState = store.getState()
    //IF NOT ENOUGH ROBOTS - ADD ROBOTS
    if (storeState.gameData.robots) {
      if (Object.keys(robots).length < Object.keys(store.getState().gameData.robots).length) {
        var keys = Object.keys(store.getState().gameData.robots)

        for (var i = 0; i < keys.length; i++) {
          if (!robots[keys[i]]) {
            robots[keys[i]] = buildRobot(store.getState().gameData.robots[keys[i]])
          }
        }
      } // IF ENOUGH ROBOTS - UPDATE ROBOT POSITION
      else if (Object.keys(store.getState().gameData.robots).length) {
        var robotState = store.getState().gameData.robots
        var projectileState = store.getState().gameData.projectiles
        for (var key in robotState) {
          robots[key].position.x = robotState[key].x
          robots[key].position.z = robotState[key].z
          robots[key].rotation.y = robotState[key].theta
        }
      }
    }

    for( var individualProjectile in projectiles){
      if(!store.getState().gameData.projectiles[individualProjectile]){
        scene.remove(projectiles[individualProjectile])
        delete projectiles[individualProjectile]
      }
    }

    for(var storeProjectile in store.getState().gameData.projectiles){
      if(!projectiles[storeProjectile]){
        projectiles[storeProjectile] = makeProjectile(storeProjectile)
      }
    }

    for(var projKey in projectiles) {
      console.log('projectiles', projectiles)
      projectiles && projectiles[projKey] && (projectiles[projKey].position.x = projectileState[projKey].x)
      projectiles && projectiles[projKey] && (projectiles[projKey].position.z = projectileState[projKey].z)
    }
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}




// // If there are more projectiles in store than local obj... make them
// if (Object.keys(projectiles).length < Object.keys(store.getState().gameData.projectiles).length) {
//   var projKeys = Object.keys(store.getState().gameData.projectiles)
//   for (var j = 0; j < projKeys.length; j++) {
//     if (!projectiles[projKeys[j]]) {
//
//       projectiles[projKeys[j]] = makeProjectile(storeState.gameData.projectiles[projKeys[j]])
//     }
//   }
// // vice versa, delete them
// } else if (Object.keys(projectiles).length > Object.keys(store.getState().gameData.projectiles).length){
//   var projectileState = store.getState().gameData.projectiles
//   for (var projKey in projectiles) {
//     var temp = projKey
//     if (!projectileState[temp]) {
//       removeProjectile(projectiles[projKey])
//       delete projectiles[projKey]
//     }
//   }
// }
// // if they are the same length, just move them
// else if (Object.keys(store.getState().gameData.projectiles).length) {
//   var projectileState = store.getState().gameData.projectiles
//   for (var projKey in projectiles) {
//     console.log('PROJKEY', projKey)
//     console.log('projectiles', projectiles)
//     console.log('projectilesState[projKey]', projectileState[projKey])
//     projectiles[projKey] && (projectiles[projKey].position.x = projectileState[projKey].x)
//     projectiles[projKey] && (projectiles[projKey].position.z = projectileState[projKey].z)
//   }
// }