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
    @property(cc.Label)
    bestScoreLabel: cc.Label = null

    onLoad() {
    }

    restart() {
        Globals.score = 0
        Globals.speed = 50
        cc.director.loadScene('Level 1')
    }

    start() {
        Globals.bestScore = Math.max(Globals.score, Globals.bestScore)
        this.scoreLabel.string = `Score: ${Globals.score}`
        this.bestScoreLabel.string = `Best: ${Globals.bestScore}`
    }

    // update (dt) {}
}
