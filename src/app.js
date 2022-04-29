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