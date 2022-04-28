import { Group } from 'three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
// import MODEL from './flower.gltf'; 

class Ball extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();
        // name? idk what for
        this.name = 'Ball';

        // size of ball
        this.radius = .1;
        // create sphere
        let geometry = new THREE.SphereGeometry(this.radius, 20, 20);
        let material = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide,
            transparent: true,
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        // position, velocity, force
        let pos = new THREE.Vector3(0, 2, 0);
        this.mesh.position.copy(pos);
        this.position.copy(pos);

        this.velocity = new THREE.Vector3();

        this.mass = 10;
        this.netForce = new THREE.Vector3(0,-9.8*this.mass,0);

        // dk if this is necessary
        // let gravity = new THREE.Vector3(0,-9.8*this.mass,0);
        // this.addForce(gravity)

        // used to handle collisions
        parent.addToUpdateList(this);
        parent.addToMainList(this);

        // courtesy of the portal code
        this.controller = {
            "KeyW": {pressed: false},
            "KeyS": {pressed: false},
            "KeyA": {pressed: false},
            "KeyD": {pressed: false},
            "Space": {pressed: false},
        }

        // handlers to detect movement using WASD
        window.addEventListener("keydown", (e) => {
            if(this.controller[e.code]){
                this.controller[e.code].pressed = true;
            }
        })
        window.addEventListener("keyup", (e) => {
            if(this.controller[e.code]){
                this.controller[e.code].pressed = false;
            }
        })

    }

    update(timeStamp) {
        // value from assignment 5
        let dt = 18 / 1000;
        let newPosition = this.position.clone();

        // n-body integration method
        newPosition.addScaledVector(this.velocity,dt);
        this.position.copy(newPosition);
        this.velocity.addScaledVector(this.netForce,dt/this.mass);

        // change velocity with wasd
        if (this.controller["KeyA"].pressed){
            this.addVelocity(new THREE.Vector3(.1,0,0));
        }
        if (this.controller["KeyD"].pressed){
            this.addVelocity(new THREE.Vector3(-.1,0,0));
        }
        if (this.controller["KeyW"].pressed){
            this.addVelocity(new THREE.Vector3(0,0,.1));
        }
        if (this.controller["KeyS"].pressed){
            this.addVelocity(new THREE.Vector3(0,0,-.1));
        }

        this.mesh.position.copy(this.position);
    }

    // my floor collision from assignment 5 with some extra
    handleCollision(floor){
        let floorPosition = floor.mesh.position.y;
        const EPS = .001;
        if(this.position.y<floorPosition+this.radius+EPS){
            let newPosition = new THREE.Vector3(this.position.x,floorPosition+this.radius+EPS,this.position.z)
            this.position.copy(newPosition);
            this.mesh.position.copy(this.position);
            if(this.velocity.lengthSq()<.5){
                this.velocity= new THREE.Vector3(this.velocity.x,0,this.velocity.z);
            }
            else{
                this.velocity= new THREE.Vector3(this.velocity.x,this.velocity.y*-.5,this.velocity.z);
            }
            
        }
    }

    // helper functions
    addForce(force){
        this.netForce.add(force);
    }

    addVelocity(velocity){
        this.velocity.add(velocity);
    }

}



export default Ball;
