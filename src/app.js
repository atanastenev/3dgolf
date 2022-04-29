/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CourseScene } from 'scenes';

// Initialize core ThreeJS components
const scene = new CourseScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

// Set up camera
camera.position.set(6, 3, -10);
camera.lookAt(new Vector3(0, 0, 0));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 16;
controls.update();

// citation: https://github.com/karenying/drivers-ed/blob/master/src/app.js

let instructionsContainer = document.createElement('div');
instructionsContainer.id = 'instructions-container';
// Set up intro screen
let beginContainer = document.createElement('div');
beginContainer.id = 'begin-container';
document.body.appendChild(beginContainer);

let beginContent = document.createElement('div');
beginContent.id = 'begin-content';
beginContainer.appendChild(beginContent);

let beginContentText = document.createElement('div');
beginContentText.id = 'begin-text';
beginContent.appendChild(beginContentText);

let beginContentTitleText = document.createElement('h1');
beginContentTitleText.innerText = "3D Golf";
beginContentText.appendChild(beginContentTitleText);

let beginContentDescription = document.createElement('p');
beginContentDescription.innerHTML =
    "Welcome to our little 3D mini-gold Game!";
beginContentText.appendChild(beginContentDescription);

let instructionsButton = document.createElement('div');
instructionsButton.id = 'instructions-button';
instructionsButton.innerHTML = 'INSTRUCTIONS';
beginContent.appendChild(instructionsButton);

// Set up instructions popup

let instructionsContent = document.createElement('div');
instructionsContent.id = 'instructions-content';
instructionsContainer.appendChild(instructionsContent);

let instructionsContentText = document.createElement('div');
instructionsContentText.id = 'instructions-text';
instructionsContent.appendChild(instructionsContentText);

let instructionsTitleText = document.createElement('h1');
instructionsTitleText.innerText = 'INSTRUCTIONS';
instructionsContentText.appendChild(instructionsTitleText);

let instructionsContentDescription = document.createElement('p');
instructionsContentDescription.innerHTML =
    "Avoid the obstacles, collect coins, consume coffee for boosts. Hit 3 obstacles and you're kicked out of the class!<br><br>" +
    'SPACE: stop/start<br>' +
    'LEFT: move left<br>' +
    'RIGHT: move right<br>' +
    'UP: speed up<br>' +
    'P: pause';
instructionsContentText.appendChild(instructionsContentDescription);

let backButton = document.createElement('div');
backButton.id = 'back-button';
backButton.innerHTML = 'BACK';
instructionsContent.appendChild(backButton);

backButton.onclick = function () {
    beginContainer.style.display = 'flex';
    instructionsContainer.style.display = 'none';
};

document.body.appendChild(instructionsContainer);

instructionsButton.onclick = function () {
    beginContainer.style.display = 'none';
    instructionsContainer.style.display = 'flex';
};

let beginContentButton = document.createElement('div');
beginContentButton.id = 'begin-button';
beginContentButton.innerHTML = 'BEGIN';
beginContent.appendChild(beginContentButton);

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);
