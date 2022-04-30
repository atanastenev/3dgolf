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
import './instructions.css';
import INSTRUCTION_HTML from './instructions.html';

// variables
let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

// Initialize core ThreeJS components
const scene = new CourseScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

// initialize shots, level, and lives components
let shots = 0;
let level = 1;
let lives = 3;

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

// display number of shots and level
// adapted from: https://github.com/cz10/thecakerybakery/blob/main/src/app.js
var shots_text = document.createElement('div');
shots_text.style.position = 'absolute';
shots_text.style.width = 100;
shots_text.style.height = 100;
shots_text.innerHTML = "Shots: " + shots;
shots_text.style.top = 0.09 * HEIGHT + 'px';
shots_text.style.left = 0.05 * WIDTH + 'px';
shots_text.style.fontFamily = 'Poppins, sans-serif';
shots_text.style.fontSize = 0.015 * WIDTH + 'px';
shots_text.style.color = "#000000";
shots_text.id = "shots_text"
document.body.appendChild(shots_text);

var level_text = document.createElement('div');
level_text.style.position = 'absolute';
level_text.style.width = 80;
level_text.style.height = 80;
level_text.innerHTML = "Level: " + level;
level_text.style.top = 0.12 * HEIGHT + 'px';
level_text.style.left = 0.05 * WIDTH + 'px';
level_text.style.fontFamily = 'Poppins, sans-serif';
level_text.style.fontSize = 0.015 * WIDTH + 'px';
level_text.style.color = "#000000";
level_text.id = "level_text"
document.body.appendChild(level_text);

var live_text = document.createElement('div');
live_text.style.position = 'absolute';
live_text.style.width = 100;
live_text.style.height = 100;
live_text.innerHTML = "Lives: " + lives;
live_text.style.top = 0.15 * HEIGHT + 'px';
live_text.style.left = 0.05 * WIDTH + 'px';
live_text.style.fontFamily = 'Poppins, sans-serif';
live_text.style.fontSize = 0.015 * WIDTH + 'px';
live_text.style.color = "#000000";
live_text.id = "live_text"
document.body.appendChild(live_text);

// ideas from https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_pointerlock.html
// https://github.com/karenying/drivers-ed/blob/master/src/app.js
let instructionsContainer = document.createElement('div');
instructionsContainer.id = 'instructions-container';
instructionsContainer.innerHTML = INSTRUCTION_HTML
document.body.appendChild(instructionsContainer)

// hide instruction on mouseclick
window.addEventListener( 'click', function () {
    hideInstructions()
} );

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

// adapted from: https://github.com/efyang/portal-0.5/blob/main/src/instructions.html
function hideInstructions() {
    let instructionsContainer = document.getElementById('instructions-container')
    if (instructionsContainer.style.display !== 'none') {
        instructionsContainer.style.opacity = '0'
        setTimeout(() => {
            instructionsContainer.style.display = 'none'
        }, 2000)
    }
}
