// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Player from "./Player";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(Player)
    player: Player = null
    // onLoad () {}

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.node.name === 'Ground')
            this.player._isGrounded = true
    }

    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        if (other.node.name === 'Ground')
            this.player._isGrounded = true
    }

    onCollisionExit(other: cc.Collider, self: cc.Collider) {
        if (other.node.name === 'Ground')
            this.player._isGrounded = false
    }

}
