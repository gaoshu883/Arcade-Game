// Enemies our player must avoid
// @param {number} x - The x coordinate of enemy position
// @param {number} y - The y coordinate of enemy position
// @param {number} speed - The speed of enemy moves along the street
var Enemy = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// @param {number} dt - A time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;

    // When enemies run out of canvas, their speed direction will reversed.
    if (this.x > 555) {
        this.sprite = 'images/enemy-bug-r.png';
        this.speed = -this.speed;
    }
    if (this.x < -151) {
        this.sprite = 'images/enemy-bug.png';
        this.speed = -this.speed;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player in the game
// @param {number} x - The x coordinate of player initial position
// @param {number} y - The y coordinate of player initial position
var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.sprite = 'images/char-boy.png';
};

// Update the player's position
Player.prototype.update = function() {
    this.x += this.dx;
    this.y += this.dy;

    // Ensure that the player is within the valid area
    if (this.x < -16) {
        this.x = -16;
    }
    if (this.x > 420) {
        this.x = 420;
    }
    if (this.y > 356) {
        this.y = 356;
    }
};

// Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Handle with the user input
Player.prototype.handleInput = function(key) {
    // At first, reset the speed of player to zero
    this.dx = 0;
    this.dy = 0;

    // Switch the speed direction of player based on which key pressed
    switch (key) {
        case 'right':
            this.dx = 2;
            break;
        case 'left':
            this.dx = -2;
            break;
        case 'up':
            this.dy = -2;
            break;
        case 'down':
            this.dy = 2;
            break;
        default:
            break;
    }
};

// Button to start game
// @param {number} url - The url of button image
// @param {number} x - The x coordinate of button image
// @param {number} y - The y coordinate of button image
// @param {number} width - The width of button image
// @param {number} height - The height of button image
function Button(url, x, y, width, height) {
    this.sprite = url;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.activated = false;
}

// Draw the button on the screen
Button.prototype.render = function() {
    ctx.clearRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Instantiate enemies, player and buttons objects.
var allEnemies = [
    new Enemy(-101, 10, 200),
    new Enemy(-101, 92, 120),
    new Enemy(-101, 174, 320),
    new Enemy(-101, 10, 300),
    new Enemy(-101, 92, 180),
    new Enemy(-101, 174, 260),
    new Enemy(-101, 10, 260),
    new Enemy(-101, 174, 200)
];
var player = new Player(200, 330);

var startBtn = new Button('images/start-0.png', 178, 200, 149, 46);
var startBtnActivated = new Button('images/start-1.png', 178, 200, 149, 46);
var againBtn = new Button('images/again-0.png', 124, 320, 257, 53);
var againBtnActivated = new Button('images/again-1.png', 124, 320, 257, 53);

// This listens for key presses and sends the keys to your
// Player.handleInput() method.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Listen for key press and make the player stop
document.addEventListener('keyup', function(e) {
    player.dx = 0;
    player.dy = 0;
});
