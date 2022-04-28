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
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);


        // Add meshes to scene
        // remove flower and land
        // const land = new Land();
        // const flower = new Flower(this);
        const ball = new Ball(this);
        const ground = new Ground(this);
        const lights = new BasicLights();
        this.add(lights, ball.mesh, ground.mesh);

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        // rotates camera
        // this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}

export default CourseScene;
