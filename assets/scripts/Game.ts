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
    @property(cc.AudioClip)
    backgroundMusic: cc.AudioClip = null
    @property(cc.AudioClip)
    diamondSfx: cc.AudioClip = null
    @property
    accelerate: number = 0.015

    onLoad() {
        if (!cc.audioEngine.isMusicPlaying()) {
            cc.audioEngine.playMusic(this.backgroundMusic, true)
        }

        this.enablePhysics();
        this.player.on('score', (amount: number) => {
            cc.audioEngine.play(this.diamondSfx, false, 0.5)
            Globals.score += amount
            this.scoreLabel.string = Globals.score.toString()
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
        // cc.director.getCollisionManager().enabledDebugDraw = true;
        // cc.director.getCollisionManager().enabledDrawBoundingBox = true;
    }

    start() {

    }

    update(dt) {
        Globals.speed += this.accelerate
    }
}
