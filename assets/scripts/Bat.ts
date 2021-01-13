// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import Helpers from "./Helpers";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.RigidBody)
    rigidBody: cc.RigidBody = null
    // LIFE-CYCLE CALLBACKS:
    _speed: number
    _scale: number
    // onLoad () {}

    start() {
    this._scale = Helpers.randomBetween(0.5, 1.2)
    this._speed = Helpers.randomBetween(10, 60)
    const xVel = Helpers.randomBetween(-30, -70)
    const yVel = Helpers.randomBetween(-50, 50)
    
    this.node.scale = this._scale
    this.rigidBody.linearVelocity = new cc.Vec2(xVel, yVel)
    }

    update(dt) {
        this.node.x -= this._speed * dt

    }
}
