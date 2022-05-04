import { Group } from 'three';
import * as THREE from 'three';
import {Hole} from 'objects'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';

class Box extends Group {
    constructor(parent, x, y, z, xSquares, zSquares) {
        // Call parent Group() constructor
        super();

        // size of square
        let squareSize = 2;
        //let z = 2;
        // checkerboard color, testcolor is gray for box
        let materialEven = new THREE.MeshBasicMaterial({color: 0x32a852,});
        let materialOdd = new THREE.MeshBasicMaterial({color: 0x1c802c,});
        let materialTest = new THREE.MeshBasicMaterial({color: 0x808080,});
        let materials = [materialEven,materialOdd,materialTest];

        let boxGeometry = new THREE.PlaneGeometry(squareSize,squareSize,zSquares,xSquares);

        // make the checkerboard
        for(let j = 0; j < zSquares; j++){
            for(let i = 0; i < xSquares; i++){
                let index = 2*(i+j*xSquares);
                boxGeometry.faces[index].materialIndex = 2
                boxGeometry.faces[index+1].materialIndex = 2
            }
        }

        // normal of plane (initially in z direction, will be rotated accordingly)
        this.normal = new THREE.Vector3(0,0,1);
        //this.mesh1 = new THREE.Mesh(geometry, materials);
        this.box1 = new THREE.Mesh(boxGeometry, materials);
        this.box2 = new THREE.Mesh(boxGeometry, materials);
        this.box3 = new THREE.Mesh(boxGeometry, materials);
        this.box4 = new THREE.Mesh(boxGeometry, materials);
        this.box5 = new THREE.Mesh(boxGeometry, materials);

        // set position of each plane of the box
        this.box1.position.x = x-1;
        this.box1.position.y = y;
        this.box1.position.z = z;
        this.box2.position.x = x;
        this.box2.position.y = y;
        this.box2.position.z = z+1;
        this.box3.position.x = x+1;
        this.box3.position.y = y;
        this.box3.position.z = z;
        this.box4.position.x = x;
        this.box4.position.y = y+1;
        this.box4.position.z = z;
        this.box5.position.x = x;
        this.box5.position.y = y;
        this.box5.position.z = z-1;

        this.box1.rotation.y = -Math.PI/2;
        this.box3.rotation.y = Math.PI/2;
        this.box4.rotation.x = Math.PI/2;
        this.box4.rotation.y = -Math.PI;
        //this.box5.rotation.x = -Math.PI;
        this.box5.rotation.y = -Math.PI;
        this.box5.rotation.z = Math.PI/2;
        //this.box3.rotation.x += -Math.PI/2;
        //this.box2.rotation.y = -Math.PI/2;

        var fullGeometry = new THREE.Geometry();

        // this.mesh1.updateMatrix();
        // singleGeometry.merge(this.mesh1.geometry, this.mesh1.matrix);
        this.box1.updateMatrix();
        fullGeometry.merge(this.box1.geometry, this.box1.matrix);
        this.box2.updateMatrix();
        fullGeometry.merge(this.box2.geometry, this.box2.matrix);
        this.box3.updateMatrix();
        fullGeometry.merge(this.box3.geometry, this.box3.matrix);
        this.box4.updateMatrix();
        fullGeometry.merge(this.box4.geometry, this.box4.matrix);
        this.box5.updateMatrix();
        fullGeometry.merge(this.box5.geometry, this.box5.matrix);

        this.mesh = new THREE.Mesh(fullGeometry, materials);

        //calculate the bounding box for collisons
        let boundingBox = new THREE.Box3();
        boundingBox.min = new THREE.Vector3(x-1,y-1,z-1);
        boundingBox.max = new THREE.Vector3(x+1,y+1,z+1);
        this.boundingBox = boundingBox;
        
        this.mesh.receiveShadow = true;

        parent.addToCollisionList({obj:this, index:'box'});
    }
}

export default Box;
