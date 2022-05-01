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
var stats_text = document.createElement('div');
stats_text.style.position = 'absolute';
stats_text.style.width = 100;
stats_text.style.height = 100;
stats_text.innerHTML = "Shots: " + shots + "<br>" + "Level: " + level +  "<br>" + "Lives: " + lives;
stats_text.style.top = 0.05 * HEIGHT + 'px';
stats_text.style.left = 0.05 * WIDTH + 'px';
stats_text.style.fontFamily = 'Poppins, sans-serif';
stats_text.style.fontSize = 0.015 * WIDTH + 'px';
stats_text.style.color = "#000000";
stats_text.id = "stats_text"
document.body.appendChild(stats_text);

// ideas from https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_pointerlock.html
// https://github.com/karenying/drivers-ed/blob/master/src/app.js
let instructionsContainer = document.createElement('div');
instructionsContainer.id = 'instructions-container';
instructionsContainer.innerHTML = INSTRUCTION_HTML
document.body.appendChild(instructionsContainer)

// hide instruction on mouseclick
window.addEventListener('click', function () {
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
    // move the game stats as the window moves ... sometimes off with the height
    document.getElementById('stats_text').style.top = 0.05 * innerHeight + 'px';
    document.getElementById('stats_text').style.left = 0.05 * innerWidth + 'px';
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);

// handler for changing the game stats
window.addEventListener('keydown', function (event) {
    if (event.key == ' '){
        shots++;
    }
    // if (scene.ball.isFalling == true){
    //     lives--;
    // }
    document.getElementById('stats_text').innerHTML = "Shots: " + shots + "<br>" + "Level: " + level +  "<br>" + "Lives: " + lives;
});

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
