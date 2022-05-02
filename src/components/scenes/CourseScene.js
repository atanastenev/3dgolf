import * as Dat from 'dat.gui';
import * as THREE from 'three';
import { Scene, Color } from 'three';
// remove flower and land
import { Ball, Ground } from 'objects';
import { BasicLights } from 'lights';

class CourseScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        this.loader = new THREE.TextureLoader();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
            mainList: [],
            collisionList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // golf ball
        const ball = new Ball(this, 0,2,0);
        // current floor with ugly texture lol
        // (x,y,z, xSquares,zSquares, xRotate, zRotate)
        const ground = new Ground(this, 0,0,0,     3,5,      -Math.PI*90/180,0,      1,1);
        // idk why the shadows aren't working
        const lights = new BasicLights();
        // actually add to the scene
        this.add(lights, ball.ball, ball.line, ground.mesh);
        if(ground.hasHole){
            this.add(ground.hole.circle, ground.hole.flagStick, ground.hole.flagFlag);
        }

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);

        // stuff for stroke count and level
        // adapted from: https://github.com/cz10/thecakerybakery/blob/main/src/app.js
        let WIDTH = window.innerWidth;
        let HEIGHT = window.innerHeight;

        this.strokeCount = ball.strokeCount;
        this.level = 1;
        let lives = 3;
        
        this.stats_text = document.createElement('div');
        this.stats_text.style.position = 'absolute';
        this.stats_text.style.width = 100;
        this.stats_text.style.height = 100;
        this.stats_text.style.top = 0.05 * HEIGHT + 'px';
        this.stats_text.style.left = 0.05 * WIDTH + 'px';
        this.stats_text.style.fontFamily = 'Poppins, sans-serif';
        this.stats_text.style.fontSize = 0.015 * WIDTH + 'px';
        this.stats_text.style.color = "#000000";
        this.stats_text.id = "stats_text"
        document.body.appendChild(this.stats_text);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    addToMainList(object) {
        this.state.mainList.push(object);
    }

    addToCollisionList(object) {
        this.state.collisionList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList, mainList, collisionList } = this.state;
        // rotates camera prob remove
        // this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        var pos = null;
        var lastPos = null

        // Call update for each object in the updateList
        for (const obj of updateList) {
            pos = obj.ball.position;
            lastPos = obj.lastPosition;

            obj.update(timeStamp);
        }

        // for each ball, handle collisions
        for (const main of mainList) {
            this.strokeCount = main.strokeCount;
            for (const col of collisionList) {
                main.handleCollision(col);
            }
        }

        this.stats_text.innerHTML = "Shots: " + this.strokeCount + "<br>" + "Level: " + this.level +  "<br>" + "Lives: " + "3";

        document.body.appendChild(this.stats_text);

        return {pos:pos, lastPos:lastPos};
    }
}

export default CourseScene;
