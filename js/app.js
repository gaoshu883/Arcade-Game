// Entity - superclass
// @param {number} x - The x coordinate of entity
// @param {number} y - The y coordinate of entity
// @param {number} sprite - The image url of entity
var Entity = function(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
};

// Draw entity on the screen
Entity.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemies - subclass - our player must avoid
// Inherit some properties from entity
// @param {number} x - The x coordinate of enemy position
// @param {number} y - The y coordinate of enemy position
// @param {number} sprite - The image url of enemy
// @param {number} speed - The speed of enemy moves along the street
var Enemy = function(x, y, sprite, speed) {
    Entity.call(this, x, y, sprite);
    this.speed = speed;
};

// Inherit render method from entity
Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Enemy;

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

// Player - subclass
// Inherit some properties from entity
// @param {number} x - The x coordinate of player initial position
// @param {number} y - The y coordinate of player initial position
// @param {number} sprite - The image url of player
var Player = function(x, y, sprite) {
    Entity.call(this, x, y, sprite);
    this.dx = 0;
    this.dy = 0;
};

// Inherit render method from entity
Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;

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

// Button - subclass - interact with canvas
// Inherit some properties from Entity
// @param {number} x - The x coordinate of button
// @param {number} y - The y coordinate of button
// @param {number} sprite - The url of button image
// @param {number} width - The width of button image
// @param {number} height - The height of button image
function Button(x, y, sprite, width, height) {
    Entity.call(this, x, y, sprite);
    this.width = width;
    this.height = height;
    this.activated = false;
}

// Inherit render method from Entity
Button.prototype = Object.create(Entity.prototype);
Button.prototype.constructor = Button;

// Instantiate enemies, player and buttons objects.
var allEnemies = [
    new Enemy(-101, 10, 'images/enemy-bug.png', 200),
    new Enemy(-101, 92, 'images/enemy-bug.png', 120),
    new Enemy(-101, 174, 'images/enemy-bug.png', 320),
    new Enemy(-101, 10, 'images/enemy-bug.png', 300),
    new Enemy(-101, 92, 'images/enemy-bug.png', 180),
    new Enemy(-101, 174, 'images/enemy-bug.png', 260),
    new Enemy(-101, 10, 'images/enemy-bug.png', 260),
    new Enemy(-101, 174, 'images/enemy-bug.png', 200)
];
var player = new Player(200, 330, 'images/char-boy.png');

var startBtn = new Button(178, 200, 'images/start-0.png', 149, 46);
var startBtnActivated = new Button(178, 200, 'images/start-1.png', 149, 46);
var againBtn = new Button(124, 320, 'images/again-0.png', 257, 53);
var againBtnActivated = new Button(124, 320, 'images/again-1.png', 257, 53);

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
