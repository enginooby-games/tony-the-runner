// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Globals } from './Globals'
import { RunnerMode } from './Types';

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.SpriteFrame)
    untickedBoxSprite: cc.SpriteFrame = null

    @property(cc.SpriteFrame)
    tickedBoxSprite: cc.SpriteFrame = null

    @property(cc.Sprite)
    autoBox: cc.Sprite = null

    @property(cc.Sprite)
    manualBox: cc.Sprite = null

    @property(cc.Button)
    playButton: cc.Button = null

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.autoBox.node.on(cc.Node.EventType.TOUCH_START, () => {
            if (Globals.runnerMode === RunnerMode.AUTO) return

            this.autoBox.spriteFrame = this.tickedBoxSprite
            this.manualBox.spriteFrame = this.untickedBoxSprite
            Globals.runnerMode = RunnerMode.AUTO
        }, this)

        this.manualBox.node.on(cc.Node.EventType.TOUCH_START, () => {
            if (Globals.runnerMode === RunnerMode.MANUAL) return

            this.autoBox.spriteFrame = this.untickedBoxSprite
            this.manualBox.spriteFrame = this.tickedBoxSprite
            Globals.runnerMode = RunnerMode.MANUAL
        }, this)

        this.playButton.node.on(cc.Node.EventType.TOUCH_START, () => {
            const label: cc.Label = this.playButton.node.getComponentInChildren(cc.Label)
            label.fontSize = 30
            label.string = "Loading..."
            this.startGame()
        }, this)
    }

    start() {

    }

    startGame() {
        cc.director.loadScene('Level 1')
    }

    // update (dt) {}
}
