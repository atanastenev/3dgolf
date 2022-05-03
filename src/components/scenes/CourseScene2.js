import * as Dat from 'dat.gui';
import * as THREE from 'three';
import { Scene, Color } from 'three';
// remove flower and land
import { Ball, Ground, Box } from 'objects';
import { BasicLights } from 'lights';

class CourseScene2 extends Scene {
    constructor(level) {
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
        this.ball = new Ball(this, -2,2,5);
        // current floor with ugly texture lol
        // (x,y,z, xSquares,zSquares, xRotate, zRotate)
        // const ground2 = new Ground(this, 2,0,5,     4,2,      -Math.PI/2,0);
        // const ground = new Ground(this, -2,0,2,     2,5,      -Math.PI/2,0,      -2,-1);
        this.box1 = new Box(this, -.5,-3,1,     1,1,      -Math.PI/2,0);
        this.box2 = new Box(this, -3.5,-3,1,     1,1,      -Math.PI/2,0);
        this.ground = new Ground(this, -2,0,2,     3,7,      -Math.PI/2,0,      -2,-4);
        // const box = new Box(this, -2,0,5);
        // idk why the shadows aren't working
        const lights = new BasicLights();
        // actually add to the scene
        this.add(lights, this.ball.ball, this.ball.line, this.ground.mesh);
        if(this.ground.hasHole){
            this.add(this.ground.hole.circle, this.ground.hole.flagStick, this.ground.hole.flagFlag);
        }
        this.add(this.box2.mesh, this.box1.mesh);

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);

        // stuff for stroke count and level
        // adapted from: https://github.com/cz10/thecakerybakery/blob/main/src/app.js
        let WIDTH = window.innerWidth;
        let HEIGHT = window.innerHeight;

        this.strokeCount = this.ball.strokeCount;
        this.level = level;
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
        this.stats_text.id = "stats_text2"
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

    getBallSuccess(){
        return this.ball.getSuccess();
    }

    update(timeStamp) {
        const {rotationSpeed, updateList, mainList, collisionList } = this.state;
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
                if (col.index == 'plane') {
                    main.handleCollision(col.obj);
                }
                else if (col.index == 'box') {
                    main.handleBoxCollision(col.obj);
                }
            }
        }

        this.stats_text.innerHTML = "Shots: " + this.strokeCount + "<br>" + "Level: " + this.level;

        document.body.appendChild(this.stats_text);

        return {pos:pos, lastPos:lastPos};
    }
}

export default CourseScene2;
