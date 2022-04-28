import { Group } from 'three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
// import MODEL from './flower.gltf'; 

class Ball extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        this.name = 'Ball';

        let geometry = new THREE.SphereGeometry(.1, 20, 20);
        let material = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide,
            transparent: true,
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        let pos = new THREE.Vector3(0, 1, 0);
        this.mesh.position.copy(pos);

        this.position.copy(pos);
        this.velocity = new THREE.Vector3();

        this.mass = 100;
        this.force = new THREE.Vector3(0,-9.8,0);

        parent.addToUpdateList(this);
    }

    update(timeStamp) {
        let newPosition = this.position.clone();
        newPosition.addScaledVector(this.velocity,timeStamp/10000000);
        this.position.copy(newPosition);
        this.velocity.addScaledVector(this.force,timeStamp/this.mass);
        this.mesh.position.copy(this.position);
    }
}



export default Ball;
