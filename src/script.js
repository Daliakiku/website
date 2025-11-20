import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
console.log(GLTFLoader)

const audio = document.getElementById('background-music');

// Unmute the audio after the user interacts with the page
window.addEventListener('click', () => {
    audio.muted = false;
});


/**
 * Base
 */
// Debug
//const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


// Set the background color of the scene
scene.background = new THREE.Color(0xffffff); // Light blue color

/**
 * Floor
 */
// const floor = new THREE.Mesh(
//     new THREE.PlaneGeometry(10, 10),
//     new THREE.MeshStandardMaterial({
//         color: '#444444',
//         metalness: 0,
//         roughness: 0.5
//     })
// )
// floor.receiveShadow = true
// floor.rotation.x = - Math.PI * 0.5
// scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

let mixer = null;
// Create a loading manager
const loadingManager = new THREE.LoadingManager();

// Show a loading message
const loadingElement = document.createElement('div');
loadingElement.style.position = 'absolute';
loadingElement.style.top = '50%';
loadingElement.style.left = '50%';
loadingElement.style.transform = 'translate(-50%, -50%)';
loadingElement.style.color = 'darkgrey';
loadingElement.style.fontSize = '30px';
loadingElement.style.fontFamily = 'noto-sans, sans-serif';
//loadingElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
loadingElement.style.padding = '10px 20px';
//loadingElement.style.borderRadius = '5px';
loadingElement.innerText = 'LOADING...';
document.body.appendChild(loadingElement);

// Configure the loading manager
loadingManager.onLoad = () => {
    // Hide the loading message when the model is fully loaded
    loadingElement.style.display = 'none';
};

loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    // Update the loading message with progress
    loadingElement.innerText = `LOADING... (${itemsLoaded}/${itemsTotal})`;
};

loadingManager.onError = (url) => {
    console.error(`There was an error loading ${url}`);
};

// Use the loading manager with the GLTF loader
const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.load(
    //'models/Cone/gltf/traffic_cone.gltf', 
    'models/Mom.gltf', 
    function (gltf) {
        gltf.scene.scale.set(1, 1, 1);
        console.log(gltf);
        scene.add(gltf.scene);
    }
);


/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

       // Model animation
   if (mixer) { //if mixer has something inside it
        mixer.update(deltaTime)
    }


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()