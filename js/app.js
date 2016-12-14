// Enemies our player must avoid
var Enemy = function(x,y,speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    //更新敌人位置
    this.x += this.speed * dt;

    //当敌人跑出边界后，反向移动
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

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x,y) {
    this.x = x;
    this.y = y;
    //玩家速度，用来控制玩家的移动方向
    this.dx = 0;
    this.dy = 0;
    this.sprite = 'images/char-boy.png';
};

//Update the player's position
Player.prototype.update = function() {

    //更新玩家当前位置
    this.x += this.dx;
    this.y += this.dy;

    //判断玩家是否越界，因为sprite图片周围有透明区域，所以要把所有透明区域排除在外
    if (this.x < -16) {
        this.x = -16;
    }
    if (this.x > 420) {
        this.x = 420;
    }
    if (this.y > 406) {
        this.y = 406;
    }
    if (this.y < 0) {//当玩家到达河岸，游戏重新开始，玩家回到初始位置
        this.x = 200;
        this.y = 380;
    }
};

//Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Handle with the user input
Player.prototype.handleInput = function(key) {

    //首先重置玩家运动速度为0
    this.dx = 0;
    this.dy = 0;

    //根据不同的按键，修改玩家移动方向
    switch(key) {
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

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(-101,60,80), new Enemy(-101,142,150), new Enemy(-101,224,200), new Enemy(-101,60,120), new Enemy(-101,142,280), new Enemy(-101,224,140)];//输入敌人初始位置和基础速度
var player = new Player(200,380);//输入玩家初始位置

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

//监听keyup事件，当松开方向键的时候，玩家停止运动
document.addEventListener('keyup', function(e) {
    player.dx = 0;
    player.dy = 0;
});