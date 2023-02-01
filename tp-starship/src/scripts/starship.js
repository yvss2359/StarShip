import Mobile from './mobile.js';
import MoveState from './move_state.js';
import StarShipSrc from '../assets/images/vaisseau-ballon-petit.png';

/*Auteurs:
- Nadine SAADI
- Ilyas RACHEDI
- Anaïs Hubert
- Adrien Vanègue
*/

/** Class that builds star ships that are mobile objects set with a predetermined width, height and image. A star ship can move up or down.
 * A star ship cannot move beyond its canvas' dimensions in a game.
 */
export default class StarShip extends Mobile {
    /**Source image of the star ship */
    static #STARSHIP_SRC = StarShipSrc;
    /**the star ship's height in pixel. */
    static #STARSHIP_HEIGHT = 39;
    /** returns the star ship's image height, in pixel
     * @return (int) the star ship's image height, in pixel.
     */
    static get STARSHIP_HEIGHT () {return StarShip.#STARSHIP_HEIGHT;}

    /**the star ship's width in pixel. */
    static #STARSHIP_WIDTH = 48;
    /** returns the star ship's image width, in pixel
     * @return (int) the star ship's image width, in pixel.
     */
    static get STARSHIP_WIDTH () {return StarShip.#STARSHIP_WIDTH;}

    /**the star ship's speed on the x-axis. */
    static #STARSHIP_DX = 0;
    /**the star ship's speed on the y-axis. */
    static #STARSHIP_DY = 8;

    /**the game this star ship is in. */
    #game;

    /**the move state this star ship currently has. */
    #moving;

    /** creates an image of a star ship with the predetermined image's source, width and height.
     * @return (Image) an element representing star ship's image.
     */
    static createImage() {
        const starShipImg = new Image();
        starShipImg.height = StarShip.#STARSHIP_HEIGHT;
        starShipImg.width = StarShip.#STARSHIP_WIDTH;
        starShipImg.src = StarShip.#STARSHIP_SRC;
        return starShipImg;
    }

    /** Builds a star ship at coordinates (x,y) in game with a predetermined image whose width is 48, whose height is 39 and whose speed is 8 on the y-axis and 0 on the x-axis. 
     * 
     * @param {int} x - this star ship's coordinate on the x-axis
     * @param {int} y - this star ship's coordinate of the y-axis
     * @param {Game} game - this star ship's will appear in.
     */
    constructor(x, y, game) {
        super(x, y, StarShip.createImage(), StarShip.#STARSHIP_DX, StarShip.#STARSHIP_DY);
        this.#game = game;
    }

    /** returns this star ship's move state.
     * @return (MoveState) this star ship's move state.
     */
    get moving () {return this.#moving;}

    /** tells if this star ship's is currently moving to the top.
     * @return (boolean) true if this star ship is moving to the top. false otherwise.
     */
    get up () {
        return this.moving === MoveState.UP;
    }

    /** tells if this star ship's is currently moving to the bottom.
     * @return (boolean) true if this star ship is moving to the bottom. false otherwise.
     */
    get down () {
        return this.moving === MoveState.DOWN;
    }

    /** sets this star ship's move state and y-speed so that this star ship will now move to the top when the method move will be called.
     * 
     */
    moveUp() {
        this._deltaY = -Math.abs(this.deltaY);
        this.#moving = MoveState.UP;
    }

    /** sets this star ship's move state and y-speed so that this star ship will now move to the bottom when the method move will be called.
     * 
     */
    moveDown() {
        this._deltaY = Math.abs(this.deltaY);
        this.#moving = MoveState.DOWN;
    }

    /** sets this star ship's move state so that this star ship won't move at all when the method move will be called.
     * 
     */
    stopMoving() {
        this.#moving = MoveState.NONE;
    }

    /** moves this star ships if and only if its move state is not NONE and if its movement won't bring it outside the canvas.
     * @see Mobile.move
     */
    move () {
        if((this.up && (this.y + this.deltaY) >= 0) || (this.down && (this.y + this.deltaY + this.image.height <= this.#game.canvas.height)))
            super.move();
    }
}