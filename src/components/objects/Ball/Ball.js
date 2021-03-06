import { Group, Color } from 'three';
import * as THREE from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';


class Ball extends Group {
    constructor(parent, x, y, z) {
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
        let pos = new THREE.Vector3(x, y, z);
        this.saveSpot = new THREE.Vector3(x,y,z);

        // every time ball position updates, last position gets updated
        this.ball.position.copy(pos);
        this.lastPosition = new THREE.Vector3(x,y,z);

        this.velocity = new THREE.Vector3();

        this.isMoving = true;
        this.isFalling = true;
        this.startTime = null;

        this.mass = 10;
        this.netForce = new THREE.Vector3(0,-9.8*this.mass,0);

        // use for launching
        this.launchDirection = new THREE.Vector3(1,0,0);
        // implement later
        this.floorDirection = new THREE.Vector3(0,1,0);
        this.startLaunch = null;

        // launch line
        let points = [];
        points.push(this.ball.position);
        points.push(this.ball.position.clone().add(new THREE.Vector3( 1, 0.1, 0 )));
        let tubeGeometry = new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3(points),
            500,    // segments
            0.01,   // radius
            10,     // radial segments
            true    // closed
          );
        let lineMaterial = new THREE.LineBasicMaterial( {
             color: 0x000000,
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
        // adapted from: https://github.com/efyang/portal-0.5/blob/main/src/components/objects/Player/Player.js
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

    updateColor(ball,line) {
        // let hex = "0x"+this.state.color.toString(16);
        this.ball.material.color = new Color(ball);
        this.line.material.color = new Color(line);
    }

    update(timeStamp) {
        if(this.success) return;
        if(this.ball.position.y < -5){
            // this.lastPosition.copy(this.ball.position);
            this.ball.position.copy(this.saveSpot);
            this.velocity = new THREE.Vector3();
        }

        // value from assignment 5
        let dt = 18 / 1000;
        let newPosition = this.ball.position.clone();

        let gravity = new THREE.Vector3(0,-9.8*this.mass,0);

        // update the acceleration, velocity, and position
        const DRAG = 8
        const PROJ = 3
        if(this.velocity.lengthSq()>0){
            let friction = this.velocity.clone().multiplyScalar(-DRAG);
            let projGrav = gravity.clone().projectOnPlane(this.floorDirection).multiplyScalar(PROJ);
            this.setForce(gravity.add(projGrav).add(friction));
        }
        else{
            this.setForce(gravity);
        }

        // n-body integration method
        newPosition.addScaledVector(this.velocity,dt);
        this.velocity.addScaledVector(this.netForce,dt/this.mass);
        this.lastPosition.copy(this.ball.position);
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
        else if(this.isFalling || this.isMoving || this.ball.position.y < -0.5){
            this.startTime = null;
        }
        // both not moving and not falling for longer than 200ms
        if(!this.isFalling && !this.isMoving && timeStamp-this.startTime > 150 && this.startTime != null){
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
                true //closed
            );
            // start launch power for 
            if(this.controller["Space"].pressed && this.startLaunch ===null){
                this.startLaunch = timeStamp;
            }
            if(this.controller["Space"].pressed && this.startLaunch !==null){
                let power = 20
                let launchPower = -power*Math.cos(2*Math.PI*(timeStamp-this.startLaunch)/ 5000)+power+.1;
                let fraction = 100-100*launchPower/(2*power+.1);
                
                document.getElementsByClassName("innerBar")[0].style.width = fraction + "%";
            }
            // launch ball
            if(!this.controller["Space"].pressed && this.startLaunch !==null){
                let power = 20
                let launchPower = -power*Math.cos(2*Math.PI*(timeStamp-this.startLaunch)/ 5000)+power+.1;
                // let launchPower = 2;
                this.addVelocity(this.launchDirection.clone().multiplyScalar(launchPower));

                this.startLaunch = null;
                this.strokeCount +=1;

            }

        }
        else{
            this.line.material.opacity=0;
        }
        // console.log(this.isFalling)
    }

    handleBoxCollision(box){
        const EPS = 0.001;
        const checkEPS = 0.1;
        let boundingBox = box.boundingBox.clone();
        let boundingBoxSave = box.boundingBox.clone();
        boundingBox.expandByScalar(EPS);
        boundingBox.expandByScalar(this.radius);
        let position = this.ball.position.clone();
        // console.log('ball before box');
        // console.log(position);
        // console.log(boundingBox.min);
        // console.log(boundingBox.max);
        // console.log(-position.clone().z);

        if (boundingBox.min.x <= position.x && position.x <= boundingBox.max.x &&
        boundingBox.min.z <= position.z && position.z <= boundingBox.max.z) {
            //console.log('ball in box!');
            // console.log(position);
            // console.log(boundingBox.min);
            // console.log(boundingBox.max);
            let reflectVector = new THREE.Vector3(0,0,1);
            let sideCheck = [];
            let closestID = 2;
            let minDist = Infinity;
            sideCheck[0] = Math.abs(position.x - boundingBoxSave.min.x);
            sideCheck[1] = Math.abs(position.x - boundingBoxSave.max.x);
            sideCheck[2] = Math.abs(position.z - boundingBoxSave.min.z);
            sideCheck[3] = Math.abs(position.z - boundingBoxSave.max.z);
            for(let i = 0; i < sideCheck.length; i++){
                // if(sideCheck[i] < minDist) {
                //     minDist = sideCheck[i];
                //     closestID = i;
                // }
                if(i >= 2 && sideCheck[i] >= minDist - checkEPS && sideCheck[i] <= minDist + checkEPS) {
                    closestID = 5;
                    console.log('corner');
                }
                else if(sideCheck[i] < minDist) {
                    minDist = sideCheck[i];
                    closestID = i;
                }
            }
            if (closestID == 5) {
                reflectVector = new THREE.Vector3(1,0,1);
            }
            else if(closestID == 0 || closestID == 1) {
                reflectVector = new THREE.Vector3(1,0,0);
            }
            else {
                reflectVector = new THREE.Vector3(0,0,1);
            }

            // if ((position.x <= boundingBoxSave.min.x+checkEPS && position.x >= boundingBoxSave.min.x-checkEPS) ||
            // (position.x <= boundingBoxSave.max.x+checkEPS && position.x >= boundingBoxSave.max.x-checkEPS)) {
            //     reflectVector = new THREE.Vector3(1,0,0);

            //     // if ((position.z <= boundingBox.min.z+checkEPS && position.z >= boundingBox.min.z-checkEPS) ||
            //     // (position.z <= boundingBox.max.z+checkEPS && position.z >= boundingBox.max.z-checkEPS)) {
            //     //     reflectVector = new THREE.Vector3(1,0,1);
            //     // }
            // }
            this.velocity.reflect(reflectVector).multiplyScalar(.5);
            return;
        }
        else {
            return;
        }

    }

    // my floor collision from assignment 5 with some extra
    handleCollision(floor){

        // check if ball is on floor
        let outBounds = false;
        for (const triangle of floor.triangleBounds) {
            outBounds = (outBounds || triangle.containsPoint(this.ball.position))
        }
        if(!outBounds) return;

        // use equation of a plane
        let d = floor.normal.dot(floor.mesh.position);
        let floorPosition = (d-(this.ball.position.x*floor.normal.x+this.ball.position.z*floor.normal.z))/floor.normal.y;

        if(this.ball.position.y>floorPosition+3*this.radius){
            return;
        }

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
                    this.velocity.reflect(reflectVector).multiplyScalar(.7);
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
            // this.lastPosition.copy(this.ball.position);
            this.ball.position.copy(newPosition);

            // stops the infinite bouncing
            // the second condition helps with rolling on slopes without bouncing
            if(this.velocity.y**2<2){
                // this.velocity.projectOnPlane(floor.normal);
                this.velocity = new THREE.Vector3(this.velocity.x,0,this.velocity.z);
            }
            // factor of 100 should prob depend on the normal of the plane
            else if(!this.inHole){
                // fix bounce, should bounce in direction of plane
                this.velocity= new THREE.Vector3(this.velocity.x,this.velocity.y*-.7,this.velocity.z);
            }

            // stop the bouncing on slopes
            if(this.isMoving && !this.isFalling){
                this.velocity.projectOnPlane(floor.normal);
            }

            this.isFalling = false;
        }
        const EPS2 = 0.01
        if(this.ball.position.y>floorPosition+this.radius+EPS2){
            this.isFalling = true;
            // help project the aim line
            this.floorDirection = floor.normal;
        }
    }

    // helper functions
    setForce(force){
        this.netForce=force;
    }

    addVelocity(velocity){
        this.velocity.add(velocity);
    }
    getSuccess (){
        return this.success;
    }

}



export default Ball;
