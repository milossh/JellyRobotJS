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

var robotModel


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

    // LIGHTS

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

    // RENDERER

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
  var ThreeRobot = new THREE.Mesh(robotModel.geometry, robotModel.materials[0])
  ThreeRobot.position.set(robot.x, robot.y, robot.z);
  ThreeRobot.scale.set(40, 40, 40);
  scene.add(ThreeRobot);
  return ThreeRobot;
}

function initializePlayers(){
  //when server emits a connect event, make our own ThreeRobot
  // when server emits a PlayerAdded event, make their ThreeRobot
  // socket.on()
}

// local
var robots = []
export const animate = () => {
  // if the store has robots, and the local array doesn't -- we need to make new robots
    if (robots.length < Object.keys(store.getState().robotData).length > 0 ){
      var storeState = store.getState()
      var keys = Object.keys(storeState.robotData)

      for ( var i=0; i < keys.length; i++ ){

        robots[i] = buildRobot(storeState.robotData[keys[i]])
        // there's no reason for the storeState to have a "position" property, just X, Y, Z
      }
    // if the store has robots, AND our array has them, then we need to update their position
    } else if (Object.keys(store.getState().robotData).length > 0 && robots.length > 1){
      var storeState = store.getState()
      console.log("store:", Object.keys(store.getState().robotData).length, "robots: ", robots.length)
      var keys = Object.keys(storeState)

      for ( var i=0; i < keys.length;i++ ){
        robots[i].position.x = (storeState[keys[i]].position.x)
        robots[i].position.y = (storeState[keys[i]].position.y)
        robots[i].position.z = (storeState[keys[i]].position.z)

      }
    }
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
