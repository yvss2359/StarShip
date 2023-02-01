import Mobile from './mobile.js';
import shootSrc from '../assets/images/tir.png';

/*Auteurs:
- Nadine SAADI
- Ilyas RACHEDI
- Anaïs Hubert
- Adrien Vanègue
*/

/** Class that builds the shots that are mobile objects, which will be used to shoot the saucers */
export default class Shoot extends Mobile {
    /**Source image of the saucer */
    static #SHOOT_SRC = shootSrc;
    /**the saucer's width in pixel */
    static #SHOOT_WIDTH = 32;
    /**the saucer's height in pixel */
    static #SHOOT_HEIGHT = 8;
    /* the horizontal movement step of the shot (px) */
    static #SHOOT_DX = 8;
    /* the vertical movement step of the shot (px) */
    static #SHOOT_DY = 0;
    /** returns the shot's image height, in pixel
     * @return (int) the shot's image height, in pixel.
     */
    static get SHOOT_HEIGHT () {return Shoot.#SHOOT_HEIGHT;}

    /**the game this shot is in. */
    #game;

    /** creates an image of a shot with the predetermined image's source, width and height.
     * @return (Image) an element representing the shot's image.
     */
    static createImage() {
        const shootImg = new Image();
        shootImg.height = Shoot.#SHOOT_HEIGHT;
        shootImg.width = Shoot.#SHOOT_WIDTH;
        shootImg.src = Shoot.#SHOOT_SRC;

        return shootImg;
    }

    /** Builds a shot at coordinates (x,y) in game with a predetermined image whose width is 32, whose height is 8. 
     * 
     * @param {int} x - this shot's coordinate on the x-axis
     * @param {int} y - this shot's coordinate of the y-axis
     * @param {Game} game - the game this shot will appear in.
     */
    constructor(x, y, game) {
        super(x, y, Shoot.createImage(), Shoot.#SHOOT_DX, Shoot.#SHOOT_DY);
        this.#game = game;
    }

    /** tells if the shot is colliding with the param mobile or not
     * @param {Mobile} Mobile - the mobile object we're testing the collision on.
     * @return (Boolean) True if the shot is colliding with a mobile object, and false otherwise  */
    collidingWith(mobile) {
        return (Math.max(this.x, mobile.x) <= Math.min(this.x + Shoot.#SHOOT_WIDTH, mobile.x + mobile.image.width)
            && (Math.max(this.y, mobile.y) <= Math.min(this.y + Shoot.#SHOOT_HEIGHT, mobile.y + mobile.image.height)));
    }

    /** carries out the consequences of a collision
     * @param {Array.<Saucer>} saucers - The list of saucers we're testing the collisions with
     */
    afterCollision(saucers) {
        if(saucers.filter(saucer => this.collidingWith(saucer) && !saucer.inFall)[0] !== undefined)
            this.#game.handleCollisions(saucers.filter(saucer => this.collidingWith(saucer) && !saucer.inFall)[0], this);
    }
}