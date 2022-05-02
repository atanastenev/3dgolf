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
import { CourseScene, CourseScene2, SeedScene } from 'scenes';
import './instructions.css';
import INSTRUCTION_HTML from './instructions.html';
import CHANGELEVEL_HTML from './levelChange.html';

// Initialize core ThreeJS components
var scene = [new CourseScene(1), new CourseScene2(2)];
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

// variables
let currlevel = 0;

// Set up camera
var lastCamera = new Vector3(6, 3, -10);
camera.position.set(lastCamera.x,lastCamera.y,lastCamera.z);
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
controls.minDistance = 10;
controls.maxDistance = 13;
controls.maxPolarAngle = Math.PI/2.5;
controls.update();

/************* NOT USED? ******************/ 
// display number of shots and level
// adapted from: https://github.com/cz10/thecakerybakery/blob/main/src/app.js

// ideas from https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_pointerlock.html
// https://github.com/karenying/drivers-ed/blob/master/src/app.js
let instructionsContainer = document.createElement('div');
instructionsContainer.id = 'instructions-container';
instructionsContainer.innerHTML = INSTRUCTION_HTML;
document.body.appendChild(instructionsContainer);

// hide instruction on mouseclick
window.addEventListener('click', function () {
    hideInstructions()
} );

// // make the level chanage screen - don't append it yet to window
let levelChangeContainer = document.createElement('div');
levelChangeContainer.id = "levelChange-container";
levelChangeContainer.innerHTML = CHANGELEVEL_HTML;
levelChangeContainer.display = 'none';
levelChangeContainer.opacity = '0';
document.body.appendChild(levelChangeContainer);

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();

    if (scene[currlevel].getBallSuccess()){

        document.getElementById('currlevel').innerHTML = currlevel+2;
        currlevel++;
    }

    var ballPos = scene[currlevel].update && scene[currlevel].update(timeStamp);
    // var newCamera = ballPos.pos.clone().sub(ballPos.lastPos).add(lastCamera);

    // camera.position.set(newCamera.x, newCamera.y, newCamera.z);
    controls.target = ballPos.pos;
    // lastCamera = newCamera;

    renderer.render(scene[currlevel], camera);
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

// function hideLevelChange() {
//     let levelChangeContainer = document.getElementById('levelChange-container')
//     if (instructionsContainer.style.display !== 'none') {
//         instructionsContainer.style.opacity = '0'
//         setTimeout(() => {
//             instructionsContainer.style.display = 'none'
//         }, 2000)
//     }
// }
