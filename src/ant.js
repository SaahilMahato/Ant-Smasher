/**
 * @param {number} x - the x-coordinate of the ball
 * @param {number} y - the y-coordinate of the ball
 * @param {number} length - the length of the ball
 * @param {number} dx - the x-direction of the ball
 * @param {number} dy - the y-direction of the ball
 * @param {number} speed - the speed of the ball
 * @param {CanvasRenderingContext2D} ctx - the context where the ant should be drawn
 */

class Ant {
    constructor (x, y, length, dx, dy, speed, ctx) {
        this.x = x;
        this.y = y;
        this.length = length;
        this.speed = speed;
        this.ctx = ctx;
        this.vx = dx * this.speed;
        this.vy = dy * this.speed;
        this.mass = this.length; // suppose mass is equal to length. looks realistic
        this.restitution = 0.99; // higher value = high energy retain after collision
        this.angle = 0;
        
        this.img1 = new Image();
        this.img1.src = './images/sprites/1.png'
        this.img2 = new Image();
        this.img2.src = './images/sprites/2.png'
        this.img3 = new Image();
        this.img3.src = './images/sprites/3.png'
        this.img4 = new Image();
        this.img4.src = './images/sprites/4.png'
        this.img5 = new Image();
        this.img5.src = './images/sprites/5.png'
        this.img6 = new Image();
        this.img6.src = './images/sprites/6.png'
        this.img7 = new Image();
        this.img7.src = './images/sprites/7.png'

        this.images = [
            this.img1,
            this.img2,
            this.img3,
            this.img4,
            this.img5,
            this.img6,
            this.img7
        ]
        this.counter = 0;

        this.img = this.images[0];
        setInterval(() => {
            if (this.counter === 6)
                this.counter = 1;
            else
                this.counter++;
            this.img = this.images[this.counter];
        }, this.speed * 20);
    }

    draw = () => {
        this.ctx.translate(this.x, this.y); // set point of rotation to center
        this.ctx.rotate(Math.PI / 180 * (this.angle + 90)); // rotate
        this.ctx.translate(-this.x, -this.y); // restore point of rotation
        this.ctx.drawImage(this.img, this.x, this.y, this.length, this.length); // draw image
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // restore transformation matrix
    }

    move = () => {
        this.x += this.vx;
        this.y += this.vy;
        let radians = Math.atan2(this.vy, this.vx); // formula to calculate angle in radians
        this.angle = 180 * radians / Math.PI; // convert to degrees
    }

    resolveBoxCollision = () => {
        /*
            abs() is used to correctly change direction based on the border it is close to
            velocity is multiplied by restitution to make the ball lose energy
            position is set to length to prevent border crossing
        */

        // for x coordinate
        if (this.x < this.length) {
            this.vx = Math.abs(this.vx) * this.restitution;
            this.x = this.length;
        }
        else if (this.x > this.ctx.canvas.width - this.length){
            this.vx = -Math.abs(this.vx) * this.restitution;
            this.x = this.ctx.canvas.width - this.length;
        }

        // for y coordinate
        if (this.y < this.length) {
            this.vy = Math.abs(this.vy) * this.restitution;
            this.y = this.length;
        }
        else if (this.y > this.ctx.canvas.height - this.length){
            this.vy = -Math.abs(this.vy) * this.restitution;
            this.y = this.ctx.canvas.height - this.length;
        }
    }

    checkAntCollision = (otherAnt) => {
        // rectangle collision
        return !(otherAnt.x > this.length + this.x ||
            this.x > otherAnt.length + otherAnt.x ||
            otherAnt.y > this.length + this.y ||
            this.y > otherAnt.length + otherAnt.y);
    }

    resolveAntCollision = (otherAnt) => {
        // use vector physics to calculate velocity. 
        // restitution is not physically accurate but it looks a bit realistic

        let vCollision = {x: otherAnt.x - this.x, y: otherAnt.y - this.y}; // vector of the direction of collision
        let distance = Math.sqrt((otherAnt.x - this.x)*(otherAnt.x - this.x) + (otherAnt.y - this.y)*(otherAnt.y - this.y)); // distance between balls. Need to calculate normal vector
        let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance}; // noraml vector. need to calculate relative velocity
        let vRelativeVelocity = {x: this.vx - otherAnt.vx, y: this.vy - otherAnt.vy}; // relative velocity. differece between the velocities
        let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y; // calucate speed. vector * normal gives scalar quantity
        if (speed < 0) return; // if speed is less than 0 dont change otherwise it overlaps
        let impulse = 2 * speed / (this.mass + otherAnt.mass); // impulse is the force that produces change in momemtum
        this.vx -= ((impulse * otherAnt.mass * vCollisionNorm.x) * this.restitution); // multpiply collision vector by impulse of the otherAnt
        this.vy -= ((impulse * otherAnt.mass * vCollisionNorm.y) * this.restitution); // multpiply collision vector by impulse of the otherAnt
        otherAnt.vx += ((impulse * this.mass * vCollisionNorm.x) * this.restitution); // multpiply collision vector by impulse of the otherAnt
        otherAnt.vy += ((impulse * this.mass * vCollisionNorm.y) * this.restitution); // multpiply collision vector by impulse of the otherAnt
    }
}
