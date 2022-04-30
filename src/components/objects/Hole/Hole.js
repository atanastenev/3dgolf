import { Group } from 'three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';

class Hole extends Group {
    constructor(parent, x, z, xRotation, zRotation) {
        // Call parent Group() constructor
        super();

        this.radius = .15;

        let geometry = new THREE.CircleGeometry( this.radius, 32 );
        let material = new THREE.MeshBasicMaterial( { 
            color: 0x000000, 
            transparent: true,
            opacity: 1
        } );
        material.polygonOffset = true;
        material.polygonOffsetFactor = -0.1;
        this.circle = new THREE.Mesh( geometry, material );

        this.circle.position.x = x;
        this.circle.position.y = parent.mesh.position.y;
        this.circle.position.z = z;

        this.circle.rotation.x = xRotation;
        this.circle.rotation.z = zRotation;

    }
}

export default Hole;
