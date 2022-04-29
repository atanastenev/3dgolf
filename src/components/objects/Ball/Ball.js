import { Group } from 'three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';


class Ball extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // name? idk what for
        this.name = 'Ball';

        // size of ball
        this.radius = .1;
        // create sphere
        let ballGeometry = new THREE.SphereGeometry(this.radius, 20, 20);
        let ballMaterial = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide,
            transparent: false,
        });
        this.ball = new THREE.Mesh(ballGeometry, ballMaterial);
        this.ball.castShadow = true;
        this.ball.receiveShadow = true;

        // position, velocity, force
        let pos = new THREE.Vector3(0, 2, 0);
        this.ball.position.copy(pos);

        this.velocity = new THREE.Vector3();

        this.isMoving = true;
        this.isFalling = true;
        this.startTime = null;

        this.mass = 10;
        this.netForce = new THREE.Vector3(0,-9.8*this.mass,0);

        // dk if this is necessary
        // let gravity = new THREE.Vector3(0,-9.8*this.mass,0);
        // this.setForce(gravity)

        this.launchDirection = new THREE.Vector3(1,0,0);
        this.launchPower = 0.1;

        let points = [];
        points.push(this.ball.position);
        points.push( new THREE.Vector3( 1, 0.1, 0 ) );
        // let lineGeometry = new THREE.BufferGeometry().setFromPoints( points );
        let tubeGeometry = new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3(points),
            500,// path segments
            0.01,// THICKNESS
            10, //Roundness of Tube
            false //closed
          );
        let lineMaterial = new THREE.LineBasicMaterial( {
             color: 0xff00ff,
             transparent: true,
             opacity: 0
        } );

        this.line = new THREE.Line(tubeGeometry, lineMaterial);

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
        let newPosition = this.ball.position.clone();

        let gravity = new THREE.Vector3(0,-9.8*this.mass,0);

        // update the acceleration, velocity, and position
        const DRAG = 8
        if(this.velocity.lengthSq()>0){
            let friction = this.velocity.clone().multiplyScalar(-DRAG);
            this.setForce(gravity.add(friction));
        }
        else{
            this.setForce(gravity);
        }

        // n-body integration method
        newPosition.addScaledVector(this.velocity,dt);
        this.velocity.addScaledVector(this.netForce,dt/this.mass);
        this.ball.position.copy(newPosition);


        // change velocity with wasd
        // prob set the angle with constant
        if (this.controller["KeyA"].pressed){
            // this.velocity.add(new THREE.Vector3(.5, 0, 0));
            this.launchDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.0872665);
        }
        if (this.controller["KeyD"].pressed){
            this.launchDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), -0.0872665);
        }
        if (this.controller["KeyW"].pressed){
            this.launchPower+=.1;
        }
        if (this.controller["KeyS"].pressed){
            this.launchPower-=.1;
        }
        // add a counter for number of strokes, only allow when ball has stopped moving
        // maybe do a press and hold for the power
        // wrong location, shouldn't be checking every timeStamp
        if(this.controller["Space"].pressed){
            console.log(this.launchDirection);
            console.log(this.launchPower);
            this.addVelocity(this.launchDirection.multiplyScalar(this.launchPower));
            this.launchDirection = new THREE.Vector3(1, 0, 0);
            this.launchPower = 0.1;
        }

        // check if moving
        if(this.velocity.x**2+this.velocity.z**2 > 0.0005){
            this.isMoving = true;
        }
        else{
            this.isMoving = false;
        }

        // timer to make sure its stopped for longer than 200ms
        if(!this.isFalling && !this.isMoving && this.startTime === null){
            this.startTime = timeStamp;
        }
        else if(this.isFalling || this.isMoving){
            this.startTime = null;
        }

        // both not moving and not falling
        if(!this.isFalling && !this.isMoving && timeStamp-this.startTime > 200){
            this.line.material.opacity=1;
            let newpoints = [];
            newpoints.push(this.ball.position);
            newpoints.push(this.ball.position.clone().add(this.launchDirection));
            this.line.geometry = new THREE.TubeGeometry(
                new THREE.CatmullRomCurve3(newpoints),
                500,// path segments
                0.01,// THICKNESS
                10, //Roundness of Tube
                false //closed
            );
        }
        else{
            this.line.material.opacity=0;
        }

    }

    // my floor collision from assignment 5 with some extra
    handleCollision(floor){
        let floorPosition = floor.mesh.position.y;
        const EPS = .001;
        // in floor
        if(this.ball.position.y<floorPosition+this.radius+EPS){
            this.isFalling = false;
            let newPosition = new THREE.Vector3(this.ball.position.x,floorPosition+this.radius+EPS,this.ball.position.z)
            this.ball.position.copy(newPosition);

            // stops the infinite bouncing
            if(this.velocity.y**2<.85){
                this.velocity= new THREE.Vector3(this.velocity.x,0,this.velocity.z);
            }
            else{
                this.velocity= new THREE.Vector3(this.velocity.x,this.velocity.y*-.7,this.velocity.z);
            }
            
        }
        if(this.ball.position.y>floorPosition+this.radius+EPS){
            this.isFalling = true;
        }
    }

    // helper functions
    setForce(force){
        this.netForce=force;
    }

    addVelocity(velocity){
        this.velocity.add(velocity);
    }

}



export default Ball;
