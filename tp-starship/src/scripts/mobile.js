/*Auteurs:
- Nadine SAADI
- Ilyas RACHEDI
- Anaïs Hubert
- Adrien Vanègue
*/

/** Class that builds mobile objects that can move and that can be drawn in a context.
 * A mobile object is caracterised by its coordinates and speed on both x-axis and y-axis. A mobile object is also bound to an image that represents it.
 */
export default class Mobile {

    /** Builds a mobile object of coordinates (x,y) whose image is image. This mobile object's speed on the x-axis and y-axis will be deltaX and deltaY respectively.
     * 
     * @param {int} x - this mobile object's coordinate on the x-axis.
     * @param {int} y - this mobile object's coordinate on the y-axis.
     * @param {Image} image - this mobile object's image.
     * @param {int} deltaX - this mobile object's speed on the x-axis.
     * @param {int} deltaY - this mobile object's speed on the y-axis.
     */
    constructor(x, y, image, deltaX=0, deltaY=0) {
        this._x = x;
        this._y = y;
        this._image = image;
        this._deltaX = deltaX;
        this._deltaY = deltaY;
    }

    /** returns this mobile object's abscissa.
     * @return (int) this mobile object's abscissa in pixel.
     */
    get x () {return this._x;}

    /** returns this mobile object's ordinate.
     * @return (int) this mobile object's ordinate in pixel.
     */
    get y () {return this._y;}

    /** returns this mobile object's image.
     * @return (Image) this mobile object's image.
     */
    get image () {return this._image;}

    /** returns this mobile object's speed on the x-axis.
     * @return (int) this mobile object's speed on the x-axis in pixel.
     */
    get deltaX () {return this._deltaX;}

    /** returns this mobile object's speed on the y-axis.
     * @return (int) this mobile object's speed on the y-axis in pixel.
     */
    get deltaY () {return this._deltaY;}

    /** draws this mobile object's image at its coordinates (given at this object's construction) in context
     * 
     * @param {2DContext} context - the context that comes from the canvas this mobile object will be drawn in.
     */
    draw(context) {
        context.drawImage(this.image, this.x, this.y);
    }

    /** moves this mobile object once on each axis from as much pixels as its speed on each axis, even if it gets out of its context.
     * 
     */
    move() {
        this._x += this.deltaX;
        this._y += this._deltaY;
    }

    /** tells if this mobile object is still in box.
     * Here, a mobile object is considered in box IF AND ONLY IF its top left-hand corner is in the box. SO it doesn't matter here if a part of this object at the bottom or on the right is not in the box.
     * @param {Any object thats has a width and a height (canvas,...)} box - the box we test this mobile object is still in.
     * @return (boolean) true if this mobile object is still in box, false otherwise.
     */
    stillInBox(box) {
        return (!(this.y > box.height || this.x < 0 || this.x > box.width || this.y < 0));
    }
}