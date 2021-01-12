// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ContinuousHeathBar extends cc.Component {

    @property(cc.Node)
    bar: cc.Node = null;

    maxWidth:number
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.maxWidth = this.bar.width
    }

    updateOnChange(percent: number) {
        this.bar.width = percent * this.maxWidth / 100
    }

    // update (dt) {}
}
