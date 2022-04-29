import * as Dat from 'dat.gui';
import * as THREE from 'three';
import { Scene, Color } from 'three';
// remove flower and land
import { Ball, Ground, Flower, Land } from 'objects';
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


        // Add meshes to scene
        // remove flower and land
        // const land = new Land();
        // const flower = new Flower(this);

        // golf ball
        const ball = new Ball(this);
        // current floor with ugly texture lol
        const ground = new Ground(this);
        // idk why the shadows aren't working
        const lights = new BasicLights();
        // actually add to the scene
        this.add(lights, ball.ball, ball.line);

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
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

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }

        // for each ball, handle collisions
        for (const main of mainList) {
            for (const col of collisionList) {
                main.handleCollision(col);
            }
        }

    }
}

export default CourseScene;
