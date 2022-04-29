import { Group } from 'three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
// import MODEL from './flower.gltf'; 

class Ground extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        let segments = 5

        let materialEven = new THREE.MeshBasicMaterial({color: 0x32a852,});
        let materialOdd = new THREE.MeshBasicMaterial({color: 0x000000,});
    
        let materials = [materialEven,materialOdd];

        // ground mesh
        let geometry = new THREE.PlaneGeometry(segments*2,segments*2,segments,segments);

        for(let i = 0; i < segments; i++){
            for(let j = 0; j < segments; j++){
                let index = 2*(i*segments+j);
                geometry.faces[index].materialIndex = (i+j)%2
                geometry.faces[index+1].materialIndex = (i+j)%2
            }
        }
        // geometry.faces[1].materialIndex = 0;


        this.mesh = new THREE.Mesh(geometry, materials);
        this.mesh.position.y = 0;
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.receiveShadow = true;

        parent.addToCollisionList(this);
    }
}

export default Ground;
