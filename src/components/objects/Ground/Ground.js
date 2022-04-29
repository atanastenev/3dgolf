import { Group } from 'three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
// import MODEL from './flower.gltf'; 

class Ground extends Group {
    constructor(parent, x, y, z, xSquares, zSquares, xRotation, zRotation) {
        // Call parent Group() constructor
        super();

        // size of square
        let squareSize = 2;
        // checkerboard color
        let materialEven = new THREE.MeshBasicMaterial({color: 0x32a852,});
        let materialOdd = new THREE.MeshBasicMaterial({color: 0x1c802c,});
        let materials = [materialEven,materialOdd];

        // ground mesh
        let geometry = new THREE.PlaneGeometry(xSquares*squareSize,zSquares*squareSize,xSquares,zSquares);

        // make the checkerboard
        for(let j = 0; j < zSquares; j++){
            for(let i = 0; i < xSquares; i++){
                let index = 2*(i+j*xSquares);
                geometry.faces[index].materialIndex = (i+j)%2
                geometry.faces[index+1].materialIndex = (i+j)%2
            }
        }

        // normal of plane (initially in z direction, will be rotated accordingly)
        this.normal = new THREE.Vector3(0,0,1);
        this.mesh = new THREE.Mesh(geometry, materials);

        // set position
        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;

        // get the corners of plane used to bound
        let corners = []
        corners.push(new THREE.Vector3(x-xSquares*squareSize/2,y-zSquares*squareSize/2,0))
        corners.push(new THREE.Vector3(x-xSquares*squareSize/2,y+zSquares*squareSize/2,0))
        corners.push(new THREE.Vector3(x+xSquares*squareSize/2,y-zSquares*squareSize/2,0))
        corners.push(new THREE.Vector3(x+xSquares*squareSize/2,y+zSquares*squareSize/2,0))


        // rotate plane
        this.mesh.rotation.x = xRotation;
        this.mesh.rotation.z = zRotation;

        // get the new normal
        let xAxis = new THREE.Vector3(1,0,0);
        let zAxis = new THREE.Vector3(0,0,1);
        this.normal.applyAxisAngle(xAxis,xRotation);
        zAxis.applyAxisAngle(xAxis,xRotation);
        this.normal.applyAxisAngle(zAxis,zRotation);

        for(let corner of corners){
            corner.applyAxisAngle(xAxis,xRotation);
            corner.applyAxisAngle(zAxis,zRotation);
        }

        this.boundary = {minX:Infinity,maxX:-Infinity,minZ:Infinity,maxZ:-Infinity};

        
        this.mesh.receiveShadow = true;

        parent.addToCollisionList(this);
    }
}

export default Ground;
