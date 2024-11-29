const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Game variables
let fruits = [];
let score = 0;
const fruitImages = {
    1: { src: "fruit1.png", size: 30 }, // Smallest
    2: { src: "fruit2.png", size: 40 },
    3: { src: "fruit3.png", size: 50 },
    4: { src: "fruit4.png", size: 60 },
    5: { src: "fruit5.png", size: 70 }  // Largest
};

// Ground boundary (line above the score area)
const groundY = canvas.height - 100;

// Gravity speed
const gravity = 2;

// Touch to drop fruit
canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    dropFruit(x);
});

// Drop a new fruit at the specified x position
function dropFruit(x) {
    const size = getRandomFruitSize(); // Size is a number from 1 to 5
    const fruit = {
        x: x - fruitImages[size].size / 2, // Center the fruit
        y: 0,
        size: size, // 1 to 5, determining the image and size
        width: fruitImages[size].size,
        height: fruitImages[size].size,
        velocityY: gravity,
        resting: false
    };
    fruits.push(fruit);
}

// Get random fruit size (from smallest to largest)
function getRandomFruitSize() {
    return Math.floor(Math.random() * 5) + 1; // Returns a size between 1 and 5
}

// Update and draw fruits
function updateFruits() {
    for (let i = 0; i < fruits.length; i++) {
        const fruit = fruits[i];

        if (!fruit.resting) {
            fruit.y += fruit.velocityY; // Apply gravity

            // Stop the fruit if it hits the ground
            if (fruit.y + fruit.height >= groundY) {
                fruit.y = groundY - fruit.height; // Align it to the ground
                fruit.resting = true; // Mark it as resting
            }

            // Check for collision and merging with other fruits
            for (let j = 0; j < fruits.length; j++) {
                if (i !== j && isColliding(fruit, fruits[j]) && fruit.size === fruits[j].size) {
                    mergeFruits(fruit, fruits[j]);
                    break;
                }
            }
        }
    }
}

// Draw fruits
function drawFruits() {
    fruits.forEach(fruit => {
        const img = new Image();
        img.src = fruitImages[fruit.size].src;
        ctx.drawImage(img, fruit.x, fruit.y, fruit.width, fruit.height);
    });
}

// Merge two fruits
function mergeFruits(fruit1, fruit2) {
    // Ensure both fruits are at the same position before merging
    if (fruit1.resting && fruit2.resting) {
        // Increase the size of fruit1
        if (fruit1.size < 5) {
            fruit1.size += 1;
            fruit1.width = fruitImages[fruit1.size].size;
            fruit1.height = fruitImages[fruit1.size].size;
        }
        // Remove fruit2
        const index = fruits.indexOf(fruit2);
        if (index > -1) fruits.splice(index, 1);

        // Update score
        updateScore();
    }
}

// Check collision between two fruits
function isColliding(fruit1, fruit2) {
    return (
        fruit1.x < fruit2.x + fruit2.width &&
        fruit1.x + fruit1.width > fruit2.x &&
        fruit1.y + fruit1.height === fruit2.y + fruit2.height // Only merge if perfectly aligned
    );
}

// Draw the ground
function drawGround() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, groundY, canvas.width, 5); // Ground line
}

// Draw the score
function drawScore() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`Score: ${score}`, 10, canvas.height - 50);
}

// Update the score
function updateScore() {
    score += 10; // Add points for merging
    document.getElementById("score").innerText = `Score: ${score}`;
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    updateFruits();
    drawFruits();
    drawGround();
    drawScore();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
