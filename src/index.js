// setup canvas
const canvas = document.getElementById('box');
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 50;
canvas.style.border = 'solid 2px';

// get context
const ctx = canvas.getContext('2d');

// user controlled parameters 
const antCount = 20;
const minSpeed = 1;
const maxSpeed = 2;

// variables needed to create ants
let ants = [];
const possibleDirections = [-1, 1];
let x, y, length, dx, dy, speed;

// create the ants
for (let i=0; i<antCount; i++) {
    x = getRandomIntInclusive(0, canvas.width-25);
    y = getRandomIntInclusive(0, canvas.height-25);
    length = getRandomIntInclusive(20, 40);
    dx = possibleDirections[getRandomIntInclusive(0, possibleDirections.length - 1)];
    dy = possibleDirections[getRandomIntInclusive(0, possibleDirections.length - 1)];
    speed = getRandomIntInclusive(minSpeed, maxSpeed);
    ants.push(new Ant(x, y, length, dx, dy, speed, ctx));
}

// function to remove dead ant
const removeAnt = (deadAnt) => {
    let remainingAnts = ants.filter((ants, ant) => ant !== deadAnt);
    ants = remainingAnts;
}

// change cursor on canvas
canvas.addEventListener('mouseover', () => {
    canvas.style.cursor = 'pointer';
});

// check collision of clicked point and ant
canvas.addEventListener('click', event => {
    let x = event.offsetX;
    let y = event.offsetY;

    for (let i = 0; i < ants.length; i++) {
        // check if the point falls within a ant's rectangle hitbox
        if (x >= ants[i].x - ants[i].length &&         // right of the left edge (modified logic to optimize hitbox) AND
            x <= ants[i].x + ants[i].length &&    // left of the right edge AND
            y >= ants[i].y - ants[i].length &&         // below the top enge (modified logic to optimize hitbox) AND
            y <= ants[i].y + ants[i].length) // above the bottom edge
            removeAnt(i);
    }
});

// game loop
const gameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i=0; i<ants.length; i++) {
        ants[i].move();
        ants[i].draw();
        for (let j=i+1; j<ants.length; j++) {
            if (ants[i].checkAntCollision(ants[j])) {
                ants[i].resolveAntCollision(ants[j]);
            }
        }
        ants[i].resolveBoxCollision();
    }
    requestAnimationFrame(gameLoop);
}

gameLoop(); // call game loop
