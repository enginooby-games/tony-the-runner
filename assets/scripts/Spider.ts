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

    _speed: number
    _scale: number
    // onLoad () {}

    start() {
        this._scale = Helpers.randomBetween(0.3, 0.7)
        this._speed = Helpers.randomBetween(10, 40)

        this.node.scale = this._scale
    }

    update(dt) {
        this.node.x -= this._speed * dt
    }
}
