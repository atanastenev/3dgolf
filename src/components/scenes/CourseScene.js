import * as Dat from 'dat.gui';
import * as THREE from 'three';
import { Scene, Color } from 'three';
// remove flower and land
import { Ball, Ground } from 'objects';
import { BasicLights } from 'lights';
import SPACE from '../textures/space.jpeg';
import SUNSET from '../textures/sunset.jpeg';
import OCEAN from '../textures/ocean.jpeg';


class CourseScene extends Scene {
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

        this.makeGui();

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // golf ball
        this.ball = new Ball(this, 0,2,0);
        // current floor with ugly texture lol
        // (x,y,z, xSquares,zSquares, xRotate, zRotate)
        const ground = new Ground(this, 0,0,0,     3,5,      -Math.PI*90/180,0,      1,1, true);
        // const ground = new Ground(this, -2,0,2, 3,7, -Math.PI*90/180,0);
        // idk why the shadows aren't working
        const lights = new BasicLights();
        // actually add to the scene
        this.add(lights, this.ball.ball, this.ball.line, ground.mesh);
        if(ground.hasHole){
            this.add(ground.hole.circle, ground.hole.flagStick, ground.hole.flagFlag);
        }

        // Populate GUI 
        // adapted from https://github.com/dreamworld-426/dreamworld/blob/master/src/components/scenes/SeedScene/SeedScene.js

        // stuff for stroke count and level
        // adapted from: https://github.com/cz10/thecakerybakery/blob/main/src/app.js
        let WIDTH = window.innerWidth;
        let HEIGHT = window.innerHeight;

        this.strokeCount = this.ball.strokeCount;
        this.level = level;
        
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

    makeGui() {
        this.state.gui = new Dat.GUI();
        let background = this.state.gui.addFolder('OPTIONS');
        background.add(this.state, 'backgroundTexture', ['Blue', 'Space', 'Sunset', 'Ocean']).name('Background Texture').onChange(() => this.updateBackgroundTexture());
        background.open();
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

    // adapted from https://github.com/dreamworld-426/dreamworld/blob/master/src/components/scenes/SeedScene/SeedScene.js
    updateBackgroundTexture(){
        if (this.state.backgroundTexture == 'Blue') {
            this.background = new Color(0x7ec0ee);
        }
        else if (this.state.backgroundTexture == 'Space') {
            let texture  = new THREE.TextureLoader().load(SPACE);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            this.background = texture;
            // this.fog = new THREE.Fog(0xA36DA1, 500, 1000);
            // this.background = new Color(0xffc0ee); 
    
        }
        else if (this.state.backgroundTexture == 'Sunset') {
            let texture  = new THREE.TextureLoader().load(SUNSET);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            this.background = texture;
            // this.fog = new THREE.Fog(0xA36DA1, 500, 1000);
            // this.background = new Color(0x7effee); 
        }
        else if (this.state.backgroundTexture == 'Ocean') {
            var texture  = new THREE.TextureLoader().load(OCEAN);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            this.background = texture;
            // this.fog = new THREE.Fog(0xA36DA1, 500, 1000);
            // this.background = new Color(0x7ec0ff); 
    
        }
    }

    update(timeStamp) {
        const { rotationSpeed, updateList, mainList, collisionList } = this.state;
        // rotates camera prob remove
        // this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        var pos = null;
        // var lastPos = null

        // Call update for each object in the updateList
        for (const obj of updateList) {
            pos = obj.ball.position;
            // lastPos = obj.lastPosition;

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

        return {pos:pos};
    }
}

export default CourseScene;
