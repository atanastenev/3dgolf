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
        this.strokeCount = 0;
        this.success = false;

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
        this.saveSpot = new THREE.Vector3(0,2,0);
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

        // use for launching
        this.launchDirection = new THREE.Vector3(1,0,0);
        // implement later
        this.floorDirection = new THREE.Vector3(0,1,0);
        this.startLaunch = null;

        let points = [];
        points.push(this.ball.position);
        points.push(this.ball.position.clone().add(new THREE.Vector3( 1, 0.1, 0 )));
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

        // aim line
        this.line = new THREE.Line(tubeGeometry, lineMaterial);
        
        // hole test
        this.inHole = false;

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
        if(this.success) return;

        if(this.ball.position.y < -10){
            this.ball.position.copy(this.saveSpot);
            this.velocity = new THREE.Vector3();
        }

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
            this.launchDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.0872665/2);
            // this is extra to make things look nice (makes launch on the plane)
            this.launchDirection.projectOnPlane(this.floorDirection).normalize();
        }
        if (this.controller["KeyD"].pressed){
            this.launchDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), -0.0872665/2);
            // this is extra to make things look nice (makes launch on the plane)
            this.launchDirection.projectOnPlane(this.floorDirection).normalize();
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
        // both not moving and not falling for longer than 200ms
        if(!this.isFalling && !this.isMoving && timeStamp-this.startTime > 150){
            // save location
            this.saveSpot.copy(this.ball.position).add(new THREE.Vector3(0,0.05,0));
            // check if in hole!
            if(this.inHole){
                this.success = true;
                return;
            }
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
            // start launch power for 
            if(this.controller["Space"].pressed && this.startLaunch ===null){
                this.startLaunch = timeStamp;
            }
            // launch ball
            if(!this.controller["Space"].pressed && this.startLaunch !==null){
                // let launchPower = -5*Math.cos(2*Math.PI*(timeStamp-this.startLaunch)/ 5000)+5.1;
                let launchPower = 2;
                this.addVelocity(this.launchDirection.clone().multiplyScalar(launchPower));

                this.startLaunch = null;
                this.strokeCount +=1;
            }

        }
        else{
            this.line.material.opacity=0;
        }


    }

    // my floor collision from assignment 5 with some extra
    handleCollision(floor){
        // old iteration of floor position
        // let floorPosition = floor.mesh.position.y;

        if(!floor.triangleBounds[0].containsPoint(this.ball.position) && !floor.triangleBounds[1].containsPoint(this.ball.position)){
            return;
        }

        // use equation of a plane
        let d = floor.normal.dot(floor.mesh.position);
        let floorPosition = (d-(this.ball.position.x*floor.normal.x+this.ball.position.z*floor.normal.z))/floor.normal.y;

        // try to make hole test
        const EPShole = 0.001
        if(floor.hasHole){
            if(this.inHole){
                floorPosition -=.2;
            }
            // check if ball ontop of hole
            if((this.ball.position.y-floor.hole.circle.position.y)**2<=(this.radius+.2)**2+EPShole){
                if((this.ball.position.x-floor.hole.circle.position.x)**2+(this.ball.position.z-floor.hole.circle.position.z)**2
                    <(floor.hole.radius+EPShole)**2){     
                        if(!this.inHole) floorPosition -= .2;
                        this.inHole = true;
                }
                else if (this.inHole){
                    this.inHole = false;
                    let reflectVector = floor.hole.circle.position.clone().sub(this.ball.position).normalize();
                    this.velocity.reflect(reflectVector);
                }
            }
            else{
                this.inHole = false;
            }
        }

        // let ball fall to infinity
        if(this.ball.position.y<floorPosition-this.radius){
            return;
        }

        const EPS = 0.001;
        // in floor
        if(this.ball.position.y<floorPosition+this.radius+EPS){
            // maybe add later
            this.floorDirection = floor.normal;
            let newPosition = new THREE.Vector3(this.ball.position.x,floorPosition+this.radius+EPS,this.ball.position.z)
            this.ball.position.copy(newPosition);

            // stops the infinite bouncing
            // the second condition helps with rolling on slopes without bouncing
            if(this.velocity.y**2<2){
                // this.velocity.projectOnPlane(floor.normal);
                this.velocity = new THREE.Vector3(this.velocity.x,0,this.velocity.z);
            }
            // factor of 100 should prob depend on the normal of the plane
            else if (this.isFalling){
                // fix bounce, should bounce in direction of plane
                this.velocity= new THREE.Vector3(this.velocity.x,this.velocity.y*-.7,this.velocity.z);
            }

            if(this.isMoving){
                this.velocity.projectOnPlane(floor.normal);
            }

            this.isFalling = false;
        }
        const EPS2 = 0.01
        if(this.ball.position.y>floorPosition+this.radius+EPS2){
            this.isFalling = true;
            this.floorDirection = new THREE.Vector3(0,1,0);
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
