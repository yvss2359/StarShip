/*Auteurs:
- Nadine SAADI
- Ilyas RACHEDI
- Anaïs Hubert
- Adrien Vanègue
*/

const UP = Symbol('up');
const DOWN = Symbol('down');
const NONE = Symbol('none');

/** Class that contains three instances that represent the direction of a Mobile's object movement
 * 
 */
export default class MoveState {
    /** represents a Mobile's object movement to the top. 
     * @return (MoveState) a move state to the top.
     */
    static get UP() {return UP;}

    /**represents a Mobile's object movement to the bottom. 
     * @return (MoveState) a move state to the bottom. 
     */
    static get DOWN() {return DOWN;}

    /**represents an immobile movement. 
     * @return (MoveState) an immobile move state.
     */
    static get NONE() {return NONE;}
}