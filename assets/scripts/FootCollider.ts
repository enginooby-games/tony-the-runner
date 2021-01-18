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
        this.setIsGrounded(other, true)
    }

    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        this.setIsGrounded(other, true)
    }

    onCollisionExit(other: cc.Collider, self: cc.Collider) {
        this.setIsGrounded(other, false)
    }

    setIsGrounded(collider: cc.Collider, enabled: boolean) {
        switch (collider.node.name) {
            case 'Ground':
            case 'Bat':
            case 'Spider':
                this.player._isGrounded = enabled
                break
        }
    }
}
