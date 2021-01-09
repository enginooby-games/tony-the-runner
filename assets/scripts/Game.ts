// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Globals } from './Globals'
const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    @property(cc.Node)
    player = null
    @property(cc.Label)
    scoreLabel: cc.Label = null

    onLoad() {
        this.enablePhysics();
        this.player.on('score', () => {
            this.scoreLabel.string = (++Globals.score).toString()
        })
        this.player.once('die', () => {
            cc.director.loadScene('Game Over')
        })
    }

    enablePhysics() {
        const physicsManager: cc.PhysicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;
        physicsManager.debugDrawFlags = 0;

        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = false;
        cc.director.getCollisionManager().enabledDrawBoundingBox = false;
    }

    start() {

    }

    // update (dt) {}
}
