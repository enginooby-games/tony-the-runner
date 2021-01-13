// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    player: cc.Node = null


    start() {

    }

    update(dt) {
        const currentPos = this.node.getPosition()
        const playerPos = this.player.getPosition()

        playerPos.y = cc.misc.clampf(playerPos.y, 0, 100)
        currentPos.lerp(playerPos, 0.1, currentPos)

        this.node.y = currentPos.y
        // this.node.setPosition(currentPos)
    }
}
