// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import Platform from "./Platform";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Prefab)
    platform = null;

    // onLoad () {}

    start() {
        this.createPlatform({ tilesCount: 4, x: 0, y: 0 })
    }

    createPlatform(data: PlatformData) {
        const platformNode: cc.Node = cc.instantiate(this.platform);
        this.node.addChild(platformNode)
        const platformComponent: Platform = platformNode.getComponent(Platform.name);
        platformComponent.init(data);
    }

    update(dt) {
    }
}
