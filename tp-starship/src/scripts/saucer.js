import Mobile from './mobile.js';
import SaucerSrc from '../assets/images/flyingSaucer-petit.png';

/*Auteurs:
- Nadine SAADI
- Ilyas RACHEDI
- Anaïs Hubert
- Adrien Vanègue
*/

/** Class that builds the saucers that are mobile objects, which should be destroyed by the starship 
 * it is set with a predetermined width, height and image 
 * When the saucer is shot, it falls vertically till it disappears from the canvas
 * A saucer moves from right to left 
 * When a saucer gets out of the game from the left, it is deleted
 */
export default class Saucer extends Mobile {
    /**Source image of the saucer */
    static #SAUCER_SRC = SaucerSrc;
    /**the saucer's height in pixel. */
    static #SAUCER_HEIGHT = 36;
    /** returns the saucer's image height, in pixel
     * @return (int) the saucer's image height, in pixel.
     */
    static get SAUCER_HEIGHT () {return Saucer.#SAUCER_HEIGHT;}
    /**the saucer's width in pixel. */
    static #SAUCER_WIDTH = 48;
    /** returns the saucer's image width, in pixel
     * @return (int) the saucer's image width, in pixel.
     */
    static get SAUCER_WIDTH  () {return Saucer.#SAUCER_WIDTH;}
    /* the horizontal movement step of the saucer (px) */
    static #SAUCER_DX = -3;
    /* the vertical movement step of the saucer (px) */
    static #SAUCER_DY = 0;
    /* the saucer's speed on the x-axis while falling (px) */
    static #SAUCER_DX_WHEN_FALLING = 0;
    /**the star ship's speed on the y-axis while falling (px) */
    static #SAUCER_DY_WHEN_FALLING = 3;

    /* boolean that tells if the saucer is currently in the game*/
    #inGame; 
    /* boolean that tells if the saucer is currently falling */
    #inFall;

    /** creates an image of a saucer with the predetermined image's source, width and height.
     * @return (Image) an element representing saucer's image.
     */
    static createImage() {
        const saucerImg = new Image();
        saucerImg.height = Saucer.#SAUCER_HEIGHT;
        saucerImg.width = Saucer.#SAUCER_WIDTH;
        saucerImg.src = Saucer.#SAUCER_SRC;

        return saucerImg;
    }

    /** Builds a saucer at coordinates (x,y) in game with a predetermined image whose width is 48, whose height is 36. 
     * 
     * @param {int} x - this saucer's coordinate on the x-axis
     * @param {int} y - this saucer's coordinate of the y-axis
     */
    constructor(x, y) {
        super(x, y, Saucer.createImage(), Saucer.#SAUCER_DX, Saucer.#SAUCER_DY);
        this.#inGame = true;
        this.#inFall = false;
    }

    /** tells if this saucer is currently in the game or not.
     * @return (boolean) true if this saucer is in the game, false otherwise.
     */
    get inGame() {return this.#inGame;}
  
    /** tells if this saucer is currently falling or not.
     * @return (boolean) true if this saucer is currently falling, false otherwise.
     */
    get inFall() {return this.#inFall;}

    /** moves this saucer.
     * When the saucer gets out of the game from the left, it is automatically deleted from it
     * @see Mobile.move
     */
    move() {
        super.move();
        if(this.x < 0)
            this.#inGame = false;
    }

    /*Drops the saucer after being shot */
    isFalling() {
        this.#inFall = true;
        this._deltaX = Saucer.#SAUCER_DX_WHEN_FALLING;
        this._deltaY = Saucer.#SAUCER_DY_WHEN_FALLING;
    }

    /** tells if this saucer is still in the box. If the game has fallen completely to the bottom, this saucer now becomes out of the game.
     * @param box - the box we test this saucer is still in.
     * @return (boolean) true if this saucer is still in the box, false otherwise.
     */
    stillInBox(box) {
        if(this.y > box.height)
            this.#inGame = false;
        return super.stillInBox(box);
    }
}