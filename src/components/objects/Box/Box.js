import { Group } from 'three';
import * as THREE from 'three';
import {Hole} from 'objects'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';

class Box extends Group {
    constructor(parent, x, y, z, xRotation, zRotation) {
        // Call parent Group() constructor
        super();

        // color
        let material = new THREE.MeshBasicMaterial({color: 0x000000,});
        let materials = [material];

        // ground mesh
        // const geometry = new THREE.BufferGeometry();
        // let firstGrass = new THREE.PlaneGeometry(xSquares*squareSize,zSquares*squareSize,xSquares,zSquares);
        // geometry.addGroup(firstGrass);
        let geometry = new THREE.BoxGeometry();

        for (let i = 0; i < geometry.faces.length; i++) {
            geometry.faces[i].materialIndex = 0;
        }

        // normal of plane (initially in z direction, will be rotated accordingly)
        this.normal = new THREE.Vector3(0,0,0);
        this.mesh = new THREE.Mesh(geometry, materials);

        // set position
        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;


        // rotate plane
        this.mesh.rotation.x = xRotation;
        this.mesh.rotation.z = zRotation;

        // get the new normal
        let xAxis = new THREE.Vector3(1,0,0);
        let zAxis = new THREE.Vector3(0,0,1);
        this.normal.applyAxisAngle(xAxis,xRotation);
        zAxis.applyAxisAngle(xAxis,xRotation);
        this.normal.applyAxisAngle(zAxis,zRotation);
        
        this.mesh.receiveShadow = true;

        //parent.addToCollisionList(this);
    }
}

export default Box;
