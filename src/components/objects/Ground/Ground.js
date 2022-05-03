import { Group } from 'three';
import * as THREE from 'three';
import {Hole} from 'objects'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';

class Ground extends Group {
    constructor(parent, x, y, z, xSquares, zSquares, xRotation, zRotation, holeX=null, holeZ=null) {
        // Call parent Group() constructor
        super();

        if(holeX ===null || holeZ ===null){
            this.hasHole=false;
        }
        else{
            this.hasHole=true;
        }

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
        // corners.push(new THREE.Vector3(x-xSquares*squareSize/2,y-zSquares*squareSize/2,0))
        // corners.push(new THREE.Vector3(x-xSquares*squareSize/2,y+zSquares*squareSize/2,0))
        // corners.push(new THREE.Vector3(x+xSquares*squareSize/2,y-zSquares*squareSize/2,0))
        // corners.push(new THREE.Vector3(x+xSquares*squareSize/2,y+zSquares*squareSize/2,0))

        corners.push(new THREE.Vector3(-xSquares*squareSize/2,-zSquares*squareSize/2,0))
        corners.push(new THREE.Vector3(-xSquares*squareSize/2,zSquares*squareSize/2,0))
        corners.push(new THREE.Vector3(xSquares*squareSize/2,-zSquares*squareSize/2,0))
        corners.push(new THREE.Vector3(xSquares*squareSize/2,zSquares*squareSize/2,0))


        // rotate plane
        this.mesh.rotation.x = xRotation;
        this.mesh.rotation.z = zRotation;

        // get the new normal
        let xAxis = new THREE.Vector3(1,0,0);
        let zAxis = new THREE.Vector3(0,0,1);
        this.normal.applyAxisAngle(xAxis,xRotation);
        zAxis.applyAxisAngle(xAxis,xRotation);
        this.normal.applyAxisAngle(zAxis,zRotation);

        // get the bounding quad
        let quadBound = [];
        for(let corner of corners){
            corner.applyAxisAngle(xAxis,xRotation);
            corner.applyAxisAngle(zAxis,zRotation);
            quadBound.push(new THREE.Vector3(corner.x+x,0,corner.z+z));
        }

        this.triangleBounds = [];
        this.triangleBounds.push(new THREE.Triangle(quadBound[0],quadBound[1],quadBound[2]));
        this.triangleBounds.push(new THREE.Triangle(quadBound[1],quadBound[2],quadBound[3]));

        
        this.mesh.receiveShadow = true;

        if(this.hasHole){
            this.hole = new Hole(this,holeX,holeZ,xRotation,zRotation);
        }

        parent.addToCollisionList(this);
    }
}

export default Ground;
