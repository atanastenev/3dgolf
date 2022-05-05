import * as Dat from 'dat.gui';
import * as THREE from 'three';
import { Scene, Color } from 'three';
// remove flower and land
import { Ball, Ground, Box } from 'objects';
import { BasicLights } from 'lights';
import SPACE from '../textures/space.jpeg';
import SUNSET from '../textures/sunset.jpeg';
import OCEAN from '../textures/ocean.jpeg';

class CourseScene2 extends Scene {
    constructor(level) {
        // Call parent Scene() constructor
        super();

        this.loader = new THREE.TextureLoader();

        // Init state
        this.state = {
            gui: null, // Create GUI for scene
            backgroundTexture: 'Blue',
            updateList: [],
            mainList: [],
            collisionList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // golf ball
        this.ball = new Ball(this, 0,2,7);

        // (x,y,z, xSquares,zSquares)
        this.box1 = new Box(this, -0,1,2,     1,1);
        this.box2 = new Box(this, -4,1,2,     1,1);
        // (x,y,z, xSquares,zSquares, xRotate, zRotate)
        this.ground = new Ground(this, -2,0,2,     3,7,      -Math.PI/2,0,      -2,-4);
        // const box = new Box(this, -2,0,5);
        // idk why the shadows aren't working
        const lights = new BasicLights();
        // actually add to the scene
        this.add(lights, this.ball.ball, this.ball.line, this.ground.mesh);
        if(this.ground.hasHole){
            this.add(this.ground.hole.circle, this.ground.hole.flagStick, this.ground.hole.flagFlag);
            this.holeGround = this.ground;
        }
        this.add(this.box2.mesh, this.box1.mesh);

        // Populate GUI

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
        this.stats_text.style.color = "#FFFFFF";
        this.stats_text.style.backgroundColor = "#000100";
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

    getShotCount(){
        return this.strokeCount;
    }

    // adapted from https://github.com/dreamworld-426/dreamworld/blob/master/src/components/scenes/SeedScene/SeedScene.js
    updateBackgroundTexture(value){
        if (value == 'Blue') {
            this.background = new Color(0x7ec0ee);
        }
        else if (value == 'Space') {
            let texture  = new THREE.TextureLoader().load(SPACE);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            this.background = texture;
            // this.fog = new THREE.Fog(0xA36DA1, 500, 1000);
            // this.background = new Color(0xffc0ee); 
    
        }
        else if (value == 'Sunset') {
            let texture  = new THREE.TextureLoader().load(SUNSET);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            this.background = texture;
            // this.fog = new THREE.Fog(0xA36DA1, 500, 1000);
            // this.background = new Color(0x7effee); 
        }
        else if (value == 'Ocean') {
            var texture  = new THREE.TextureLoader().load(OCEAN);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            this.background = texture;
            // this.fog = new THREE.Fog(0xA36DA1, 500, 1000);
            // this.background = new Color(0x7ec0ff); 
    
        }
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
