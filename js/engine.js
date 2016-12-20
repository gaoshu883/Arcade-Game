/* engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 */

/* Predefine the variables that will be used globally, and add the canvas
 * element to the DOM.
 */
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var gameStart = false; // Keep track of game state (start or not)

canvas.width = 505;
canvas.height = 498;
document.body.appendChild(canvas);

/* This function serves as the game loop state. It's called when
 * player clicks to start the game.
 */
function engine() {
    // Set the lastTime variable that is required for the game loop.
    var lastTime = Date.now();
    main();

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation.
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         * When player reaches the water, the loop stops, we enter the
         * winning state and player goes back to the initial position.
         */
        if (player.y > -50) {
            window.requestAnimationFrame(main);
        } else {
            win();
            player.x = 200;
            player.y = 330;
        }
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data and implement
     * collision detection.
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
    }

    /* This is called by the update function and loops through all of the
     * objects within allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for
     * player object.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    /* This function is called to detect the collision between player and
     * enemies. The game resets when the player is collided.
     */
    function checkCollisions() {
        for (var i = 0; i < allEnemies.length; i++) {
            if (boundingBoxCollide(player, allEnemies[i])) {
                player.x = 200;
                player.y = 330;
            }
        }
    }

    // This function serves as collision detection algorithm.
    function boundingBoxCollide(player, enemy) {
        //Player bounding box
        var left1 = player.x + 36;
        var right1 = player.x + 68;
        var top1 = player.y + 123;
        var bottom1 = player.y + 136;
        //Enemy bounding box
        var left2 = enemy.x + 3;
        var right2 = enemy.x + 97;
        var top2 = enemy.y + 78;
        var bottom2 = enemy.y + 143;

        if (bottom1 < top2) {
            return false;
        }
        if (top1 > bottom2) {
            return false;
        }
        if (right1 < left2) {
            return false;
        }
        if (left1 > right2) {
            return false;
        }
        return true;
    }

    /* This function initially draws the 'game level', it will then call
     * the renderEntities function.
     */
    function render() {
        //Clear out
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png', // Top row is water
                'images/stone-block.png', // Row 1 of 3 of stone
                'images/stone-block.png', // Row 2 of 3 of stone
                'images/stone-block.png', // Row 3 of 3 of stone
                'images/grass-block.png', // Row 1 of 2 of grass
                'images/grass-block.png' // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the 'grid'
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83 - 50);
            }
        }

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick.
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }
}

/* This function serves as the game start state. It draws game
 * intrduction text on the canvas. It's only called once
 * by loading or refreshing the webpage.
 */
function start() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw game leading information
    ctx.fillStyle = '#363636';
    ctx.font = '20px Impact';
    ctx.textAlign = 'center';
    ctx.fillText('You are in danger...', canvas.width / 2, 50);
    ctx.fillText('Only escape the enemies and cross the street', canvas.width / 2, 80);
    ctx.fillText('to the water, you can be saved...', canvas.width / 2, 110);

    // Draw start button
    startBtn.render();

    howToPlay(115, 380, 20);

    ctx.drawImage(Resources.get(player.sprite), 300, 320);

    /* It draws the how-to-play part of the game introduction.
     * @param {number} x - The x coordinate of starting position
     * @param {number} y - The y coordinate of starting position
     * @param {number} c - The base length of triangle
     */
    function howToPlay(x, y, c) {
        ctx.beginPath();
        ctx.font = '16px Impact';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#363636';
        ctx.fillText('HOW TO PLAY:', x - 40, y - 50);
        ctx.fillText('Click to start the game', x - 40, y - 30);
        ctx.fillText('Use arrow keys to help the player escape the enemies', x - 40, y - 10);
        drawArrowKey(x, y, c);
    }

    /* It draws the arrow key on the canvas
     * @param {number} x - The x coordinate of starting position
     * @param {number} y - The y coordinate of starting position
     * @param {number} c - The base length of triangle
     */
    function drawArrowKey(x, y, c) {
        ctx.beginPath();
        ctx.moveTo(x + 2.5 * c, y);
        ctx.lineTo(x + 3 * c, y + c);
        ctx.lineTo(x + 2 * c, y + c);
        ctx.closePath();

        ctx.moveTo(x + 4 * c, y + 1.5 * c);
        ctx.lineTo(x + 5 * c, y + 2 * c);
        ctx.lineTo(x + 4 * c, y + 2.5 * c);
        ctx.closePath();

        ctx.moveTo(x + 3 * c, y + 3 * c);
        ctx.lineTo(x + 2.5 * c, y + 4 * c);
        ctx.lineTo(x + 2 * c, y + 3 * c);
        ctx.closePath();

        ctx.moveTo(x + c, y + 2.5 * c);
        ctx.lineTo(x + c, y + 1.5 * c);
        ctx.lineTo(x, y + 2 * c);
        ctx.closePath();

        ctx.fillStyle = '#5b5';
        ctx.fill();
    }
}

/* This function serves as the player win state (game is over). It's called when
 * player reaches the water.
 */
function win() {
    // Game is over, the gameStart variable is reset to false, waiting for next start.
    gameStart = false;

    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 48px Impact';
    ctx.fillStyle = '#5b5';
    ctx.lineWidth = 3;
    ctx.textAlign = 'center';
    ctx.fillText('CONGRATULATIONS!', canvas.width / 2, 170);
    ctx.strokeText('CONGRATULATIONS!', canvas.width / 2, 170);
    ctx.fillText('YOU WIN!', canvas.width / 2, 250);
    ctx.strokeText('YOU WIN!', canvas.width / 2, 250);

    // Draw play-again button
    againBtn.render();
}

/* Load all of the images which are needed in this game. When all of
 * these images are properly loaded our game will start.
 */
Resources.load([
    'images/stone-block.png',
    'images/water-block.png',
    'images/grass-block.png',
    'images/enemy-bug.png',
    'images/enemy-bug-r.png',
    'images/char-boy.png',
    'images/start-0.png',
    'images/start-1.png',
    'images/again-0.png',
    'images/again-1.png'
]);
Resources.onReady(function() {
    start();
});

/* Listen to the mousemove event on the canvas object. When mouse moves within
 * the range of button, the button will be on focus and be redrawed.
 */
canvas.addEventListener('mousemove', function(e) {
    // Point the real position of mouse on canvas object
    var x = event.pageX - canvas.offsetLeft;
    var y = event.pageY - canvas.offsetTop;

    // If game does not start and start button is not activated,
    // start button will become focused.
    // If game is over and play-again botton is not activated,
    // play-again will become focused.
    // If conditions above are not satisfied, there is no focus on the canvas.
    if (gameStart === false && startBtn.activated === false) {
        if ((x > startBtn.x && x < startBtn.x + startBtn.width) && (y > startBtn.y && y < startBtn.y + startBtn.height)) {
            canvas.classList.add('focused');
            if (Resources.isReady()) {
                startBtnActivated.render();
            }
        } else {
            canvas.classList.remove('focused');
            if (Resources.isReady()) {
                startBtn.render();
            }
        }
    } else if (gameStart === false && againBtn.activated === false) {
        if ((x > againBtn.x && x < againBtn.x + againBtn.width) && (y > againBtn.y && y < againBtn.y + againBtn.height)) {
            canvas.classList.add('focused');
            againBtnActivated.render();
        } else {
            canvas.classList.remove('focused');
            againBtn.render();
        }
    }
});

/* Listen to the click event on the canvas object. When player clicks within
 * the canvas, if game does not start, engine function will work. Condition
 * statement can avoid repeated call with click in succession.
 */
canvas.addEventListener('click', function(e) {
    if (canvas.classList.contains('focused') === true && gameStart === false) {
        gameStart = true;
        startBtn.activated = true;
        engine();
        canvas.classList.remove('focused');
    }
});
