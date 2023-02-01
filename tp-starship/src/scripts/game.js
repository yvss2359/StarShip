import StarShip from './starship.js';
import Saucer from './saucer.js';
import Shoot from './shoot.js';

/*Auteurs:
- Nadine SAADI
- Ilyas RACHEDI
- Anaïs Hubert
- Adrien Vanègue
*/

/** returns a random integer between 0 and n.
 * 
 * @param {int} n - the upper bound (included) for the random number that will be returned. n should be positive.
 * @return (int) a random integer between 0 and n included.
 */
const alea = n => Math.ceil(Math.random() * n);

/** Class that builds star ships game.
 * In this game, the player can control a star ship that can move up or down. The goal is to shoot saucers that are coming from the right side of the screen to make them fall in order to earn points.
 * If saucers leave the game from the left, the player loses points. Beware: your counter can be negative!
 */
class Game {

    /**Number of points earned by the player when he shots a saucer successfully. */
    static #POINTS_IF_SAUCER_SHOT = 200;
    /**Number of points earned by the player when a saucer passes through. */
    static #POINTS_IF_SAUCER_NOT_SHOT = -1000;

    /**The canvas in which this game is drawn. */
    #canvas;
    /**The context that is bound to this game's canvas. */
    #context;
    /**The player's ship. */
    #ship;
    /**The list of saucers currently in the game. */
    #saucers;
    /**The player's score. */
    #score;
    /**The request animation frame, used to move and draw every object in the canvas. */
    #raf;
    /**The shoots that are currently in the canvas. */
    #shoots;
    /**A counter modulo 2 used to know if saucers must be added automatically.*/
    #intervalOn;
    /**The most recent interval id that was used to add saucers automatically. */
    #interval;

    /** Builds and initialises a star ship game:
     * The canvas used to draw this game is the canvas of id 'stars'.
     * The players's ship is placed in the middle of the left side of the canvas.
     * There aren't any saucer or shoot in the game yet.
     * The player's score is 0 at the beginning.
     * Saucers aren't added automatically at the beginning.
     */
    constructor() {
        this.#canvas = document.getElementById('stars');
        this.#context = this.#canvas.getContext('2d');
        this.#ship = new StarShip(40, (this.#canvas.height - StarShip.STARSHIP_HEIGHT)/2, this);
        this.#saucers = [];
        this.#shoots = [];
        this.#score = 0;
        this.#raf = null;
        this.#intervalOn = 0;
    }

    /** returns this game's canvas.
     * @return (Canvas) the canvas this game is drawn in.
     */
    get canvas ()  {return this.#canvas;}
    
    /** returns this game's rendering context.
     * @return (Context) the rendering context bound to this game's canvas.
     */
    get context () {return this.#context;}

    /** returns this game's ship
     * @return (StarShip) the player's star ship.
     */
    get ship () {return this.#ship;}

    /** returns the player's score
     * @return (int) the player's score.
     */
    get score () {return this.#score;}

    /** returns this game's animation request frame.
     * @return (Object) this game's animation request frame.
     */
    get raf () {return this.#raf;}

    /** Method that clears the canvas, moves all objects in the canvas, tests if collisions exists between them to possibly erase them and draw every remaining object in the canvas.
     * For each shoot and saucer in collision, consequences are carried out by the Game.handleCollisions method.
     * Then the ship and every remaining shot and saucer move.
     * Then, the shots and saucers that aren't in the canvas anymore are deleted and for each saucer that escaped from the left, the player loses 1000 points.
     * Then, the ship and every remaining shot and saucer are drawn in this game's canvas' rendering context.
     * Finally, the animation request frame calls this method again. 
     */
    moveAndDraw() {
        this.#context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.#shoots.filter(shoot => this.#saucers.some(saucer => shoot.collidingWith(saucer)))
                    .forEach(shoot => shoot.afterCollision(this.#saucers));
        
        this.#shoots.forEach(shoot => shoot.move());
        this.#saucers.forEach(saucer => saucer.move());
        this.#ship.move();
        
        this.#shoots = this.#shoots.filter(shoot => shoot.stillInBox(this.canvas));
        this.#saucers.filter(saucer => !saucer.inGame && !saucer.inFall).forEach(() => {
                                                                                            this.#score += Game.#POINTS_IF_SAUCER_NOT_SHOT;
                                                                                            this.updateScore();
                                                                                        }
                                                                                );
        this.#saucers = this.#saucers.filter(saucer => saucer.stillInBox(this.canvas));

        this.#shoots.forEach(shoot => shoot.draw(this.#context));
        this.#ship.draw(this.#context);
        this.#saucers.forEach(saucer => saucer.draw(this.#context));

        this.#raf = window.requestAnimationFrame(() => this.moveAndDraw());
    }

    /** Method that launches the request animation frame to draw the player's ship and then to call the Game.moveAndDraw method
     * 
     */
    start() {this.#raf = window.requestAnimationFrame(
        () => {
            this.#ship.draw(this.context);
            this.moveAndDraw();
        })
    }

    /** moves the player's ship up or down according to which key is down: ArrowUp to move up and ArrowDown to move down.
     * 
     * @param {KeyDownEvent} event - the key down event.
     */
    keyDownActionHandler(event) {
        switch (event.key) {
            case "ArrowUp":
            case "Up":
                this.#ship.moveUp();
                break;
            case "ArrowDown":
            case "Down":
                this.#ship.moveDown();
                break;
            default: return;
        }
        event.preventDefault();
        this.#ship.move();
    }

    /** the player's ship stops moving when the ArrowUp or ArrowDown key is up. If the space bar key is up, it allows the player to shoot once.
     * 
     * @param {KeyUpEvent} event - the key up event.
     */
    keyUpActionHandler(event) {
        switch (event.key) {
            case "ArrowUp":
            case "Up":
            case "ArrowDown":
            case "Down":
                this.#ship.stopMoving();
                break;
            case " ":
                this.shoot();
                break;
            default: return;
        }
        event.preventDefault();
    }

    /**Adds a new saucer to this game. The new saucer spawns on the right, outside the canvas, at a random ordinate. */
    addSaucer() {
        this.#saucers.push(new Saucer(this.canvas.width, alea(this.canvas.height - Saucer.SAUCER_HEIGHT)));
    }

    /**Adds and draws a new shoot to this game, just at the right of the player's ship. */
    shoot() {
        const shoot = new Shoot(this.#ship.x + StarShip.STARSHIP_WIDTH, (this.#ship.y + (StarShip.STARSHIP_HEIGHT - Shoot.SHOOT_HEIGHT)/2), this);
        this.#shoots.push(shoot);
        shoot.draw(this.#context);
    }

    /**Handles the collision between saucer and shoot, which means: 
     * - The shot is deleted from the game.
     * - The player earns 200 points.
     * - The saucer will now fall to the bottom.
     * @param {Saucer} saucer - the saucer colliding with shoot.
     * @param {Shoot} shoot - the shot colliding with saucer.
     */
    handleCollisions(saucer, shoot) {
        this.#shoots.splice(this.#shoots.indexOf(shoot), 1);
        this.#score += Game.#POINTS_IF_SAUCER_SHOT;
        this.updateScore();
        saucer.isFalling();
    }

    /**Updates the view of the player'score in the HTML element of id 'score'.*/
    updateScore() {
        document.getElementById('score').textContent = this.#score;
    }

    /**Adds a saucer randomly to this game with a probability of 1/2 */
    addSaucerRandomly() {
        if(alea(2) <= 1)
            this.addSaucer();
    }

    /**If no interval has been set yet, a new interval will be created and call Game.addSaucerRandomly every 750 ms, which randomly adds a saucer to this game with a probability of 1/2. Otherwise, the existing interval will be cleared. */
    startOrStopAddingSaucerRandomly() {
        this.#intervalOn % 2 === 0 ? this.#interval = window.setInterval(() => this.addSaucerRandomly(), 750) : window.clearInterval(this.#interval);
        this.#intervalOn++;
    }
}


// crée et exporte l'instance unique de Game
const theGame = new Game();
export default theGame;
