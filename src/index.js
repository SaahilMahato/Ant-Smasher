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

const removeAnt = (deadAnt) => {
    let remainingAnts = ants.filter((ants, ant) => ant !== deadAnt);
    ants = remainingAnts;
}

canvas.addEventListener('mouseover', () => {
    canvas.style.cursor = 'pointer';
});

canvas.addEventListener('click', (event) => {
    let x = event.x;
    let y = event.y;

    for (let i = 0; i < ants.length; i++) {
        if (x >= ants[i].x &&         // right of the left edge AND
            x <= ants[i].x + ants[i].length &&    // left of the right edge AND
            y >= ants[i].y &&         // below the top enge AND
            y <= ants[i].y + ants[i].length) // above the bottom edge
            removeAnt(i);
    }
});

// game loop
const gameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i=0; i<ants.length; i++) {
        ants[i].draw(ctx);
        for (let j=i+1; j<ants.length; j++) {
            if (ants[i].checkAntCollision(ants[j])) {
                ants[i].resolveAntCollision(ants[j]);
                ants[i].move(ctx);
                ants[j].move(ctx);
            }
        }
        ants[i].resolveBoxCollision(ctx);
        ants[i].move(ctx);
    }
    requestAnimationFrame(gameLoop);
}

gameLoop(); // call game loop
