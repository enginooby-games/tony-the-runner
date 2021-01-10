// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Globals } from './Globals'
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Label)
    scoreLabel: cc.Label = null

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.restart, this)
    }

    restart() {
        Globals.score = 0
        Globals.speed = 50
        cc.director.loadScene('Level 1')
    }

    start() {
        this.scoreLabel.string = `Score: ${Globals.score}`
    }

    // update (dt) {}
}
