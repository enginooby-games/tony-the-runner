// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
const tileSize: number = 64;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Prefab)
    platformTile = null;

    // onLoad () {}

    start() {
        this.init({tilesCount:4, x: 0, y: 0});
    }

    init(data: PlatformData) {
        this.node.setPosition(data.x, data.y);

        // create tiles
        for (let i = 0; i < data.tilesCount; i++) {
            const tile: cc.Node = cc.instantiate(this.platformTile);
            this.node.addChild(tile)
            tile.setPosition(i * tile.width, 0)
        }

        // update node size
        this.node.width = tileSize * data.tilesCount;
        this.node.height = tileSize;
    }

    // update (dt) {}
}
