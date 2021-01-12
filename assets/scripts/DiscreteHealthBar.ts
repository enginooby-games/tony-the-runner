

const { ccclass, property } = cc._decorator;

@ccclass
export default class DiscreteHealthBar extends cc.Component {
    @property(cc.Prefab)
    heartPrefab = null

    init(health: number) {
        this.node.removeAllChildren()
        for (let i = 0; i < health; i++) {
            this.addHeart(234 - 40 * i)
        }
    }

    addHeart(y: number) {
        const heart: cc.Node = cc.instantiate(this.heartPrefab)
        this.node.addChild(heart)
        heart.setPosition(-455, y)
    }

    increase() {
        this.addHeart(234 - 40 * this.node.childrenCount)
    }

    decrease() {
        this.node.removeChild(this.node.children[this.node.childrenCount - 1])
    }
    // onLoad () {}

    start() {
    }

    // update (dt) {}
}
