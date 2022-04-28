import { Group } from 'three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
// import MODEL from './flower.gltf'; 

class Ground extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        let material = new THREE.MeshStandardMaterial({
            color: 0x32a852, //0x3c3c3c,
            // specular: 0x404761, //0x3c3c3c//,
            // metalness: 0.9,
        });
    
        // ground mesh
        let geometry = new THREE.PlaneBufferGeometry(100, 100)
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.y = 0;
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.receiveShadow = true;

        let texture = parent.loader.load( "assets/textures/grasslight-big.jpg" );

        material.map = texture;
        parent.addToCollisionList(this);
    }
}

export default Ground;
