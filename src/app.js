/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, Audio, AudioListener,  AudioLoader} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CourseScene, CourseScene2, CourseScene3, CourseScene4 } from 'scenes';
import './instructions.css';
import INSTRUCTION_HTML from './instructions.html';
import CHANGELEVEL_HTML from './levelChange.html';
import ENDGAME_HTML from './endGame.html';
import './powerBar.css';
import POWERBAR from './powerBar.html';
import MUSIC from './background.mp3';
import * as Dat from 'dat.gui';

// window dimensions
let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

// Initialize core ThreeJS components
var scene = [new CourseScene(1), new CourseScene2(2), new CourseScene3(3), new CourseScene4(4)];
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });


// create GUI
var state = {backgroundTexture: 'Blue',ballColor: 0xff0000, lineColor: 0x000000, flagColor: 0xff0000, music: false};

state.gui = new Dat.GUI();
let background = state.gui.addFolder('OPTIONS');
background.add(state, 'backgroundTexture', ['Blue', 'Space', 'Sunset', 'Ocean']).name('Background Texture').onChange(() => {
    for(const currScene of scene){
        currScene.updateBackgroundTexture(state.backgroundTexture);
    }
});
background.open();

let folder = state.gui.addFolder('COLOR');
folder.addColor(state, 'ballColor').name("Ball Color").onChange(() =>{
    for(const currScene of scene){
        currScene.ball.updateColor(state.ballColor,state.lineColor);
    }
});
folder.addColor(state, 'lineColor').name("Line Color").onChange(() =>{
    for(const currScene of scene){
        currScene.ball.updateColor(state.ballColor,state.lineColor);
    }
});
folder.addColor(state, 'flagColor').name("Flag Color").onChange(() =>{
    for(const currScene of scene){
        currScene.holeGround.hole.updateColor(state.flagColor);
    }
});
folder.open();
/* END GUI*/

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

// Adding Background Audio for the Game: https://threejs.org/docs/#api/en/audio/Audio
// create an AudioListener and add it to the camera
const listener = new AudioListener();
camera.add( listener );

// create a global audio source
const sound = new Audio( listener );

// load a sound and set it as the Audio object's buffer
const audioLoader = new AudioLoader();
audioLoader.load( MUSIC , function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.1 );
	sound.play();
});

// gui toggle to pause music
let musicpause = state.gui.addFolder('MUSIC');
musicpause.add(state, 'music').name('Music Pause').onChange(() => {
    if (state.music){
        sound.pause();
    }else {
        sound.play();
    }
});
musicpause.open();

// add a toggle to turn off music??

/************* NOT USED? ******************/ 
// display number of shots and level
// adapted from: https://github.com/cz10/thecakerybakery/blob/main/src/app.js

let powerBar = document.createElement('div');
powerBar.className = 'outerBar';
powerBar.innerHTML = "POWER BAR"
powerBar.innerHTML = POWERBAR;
document.body.appendChild(powerBar);

// power bar text display
let powerBartxt = document.createElement('div');
powerBartxt.style.position = 'absolute';
powerBartxt.style.width = 110;
powerBartxt.style.height = 110;
powerBartxt.style.top = 0.475 * HEIGHT + 'px';
powerBartxt.style.left = 0.925 * WIDTH + 'px';
powerBartxt.style.fontFamily = 'Poppins, sans-serif';
powerBartxt.style.fontSize = 0.015 * WIDTH + 'px';
powerBartxt.style.textAlign = "center";
powerBartxt.style.color = "#FFFFFF";
powerBartxt.style.backgroundColor = "#000100";
powerBartxt.id = "powerbartxt";
powerBartxt.innerHTML = "Power <br> Bar";
document.body.appendChild(powerBartxt);

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

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();

    // change scenes and display the level change instructions or the win game instructions
    if (scene[currlevel].getBallSuccess()){

        if (currlevel+1 < scene.length){

            let levelChangeContainer1 = document.getElementById('instructions-container');
            levelChangeContainer1.innerHTML = CHANGELEVEL_HTML;
            levelChangeContainer1.style.display = 'block';
            levelChangeContainer1.style.opacity = '1';
            document.getElementById('currlevel').innerHTML = currlevel+2;
            for(let i = 0; i < currlevel+1; i++ ){
                let scoreforlevel = scene[i].getShotCount();
                let scorelabel = "scorecourse" + (i+1);
                document.getElementById(scorelabel).innerHTML = scoreforlevel;
            }
            var stat = "stats_text";
            if (currlevel > 0 ){
                stat += currlevel+1;
            }
            document.body.removeChild(document.getElementById(stat));
            currlevel++;
        }
        else{
            let finishedGameDisplay = document.getElementById('instructions-container');
            finishedGameDisplay.innerHTML = ENDGAME_HTML;
            for(let i = 0; i < currlevel+1; i++ ){
                let scoreforlevel = scene[i].getShotCount();
                let scorelabel = "scorecourse" + (i+1);
                console.log(scorelabel);
                document.getElementById(scorelabel).innerHTML = scoreforlevel;
            }
            finishedGameDisplay.style.display = 'block';
            finishedGameDisplay.style.opacity = '1';
        }
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
    document.getElementById('powerbartxt').style.top = 0.475 * innerHeight + 'px';
    document.getElementById('powerbartxt').style.left = 0.925 * innerWidth + 'px';
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
