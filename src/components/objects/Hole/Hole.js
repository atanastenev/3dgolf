import { Group, Color } from 'three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';

class Hole extends Group {
    constructor(parent, x, z, xRotation, zRotation) {
        // Call parent Group() constructor
        super();

        // actual hole
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

        // flag for decoration
        let points = [];
        points.push(this.circle.position);
        points.push(this.circle.position.clone().add(new THREE.Vector3(0,2,0)));
        // let lineGeometry = new THREE.BufferGeometry().setFromPoints( points );
        let tubeGeometry = new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3(points),
            500,    // segments
            0.03,   // radius
            10,     // radial segments
            true    // closed
          );
        let stickMaterial = new THREE.LineBasicMaterial( {color: 0xffffff,} );

        // flag stick
        this.flagStick = new THREE.Line(tubeGeometry, stickMaterial);

        // flag flag
        let points2 = [];
        for(let i = 1; i<9; i++){
            points2.push(this.circle.position.clone().add(new THREE.Vector3(0.06*i,1.575+0.025*i,0)));
            points2.push(this.circle.position.clone().add(new THREE.Vector3(0.06*i,2.025-0.025*i,0)));
        }
        let flagGeometry = new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3(points2),
            1000,    // segments
            0.03,   // radius
            10,     // radial segments
            true    // closed
          );
        let flagMaterial = new THREE.LineBasicMaterial( {color: 0xff0000,} );

        this.flagFlag = new THREE.Line(flagGeometry, flagMaterial);


    }

    updateColor(flagColor) {
        this.flagFlag.material.color = new Color(flagColor);
    }
}

export default Hole;
