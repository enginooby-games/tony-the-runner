// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
const TILE_SIZE: number = 64;

@ccclass
export default class Platform extends cc.Component {
    @property(cc.Prefab)
    platformTile = null;

    _speed: number
    // onLoad () {}

    start() {
    }

    init(data: PlatformData) {
        this._speed = data.speed;
        this.node.setPosition(data.x, data.y);

        // create tiles
        for (let i = 0; i < data.tilesCount; i++) {
            const tile: cc.Node = cc.instantiate(this.platformTile);
            this.node.addChild(tile)
            tile.setPosition(i * tile.width, 0)
        }

        // update node size
        this.node.width = TILE_SIZE * data.tilesCount;
        this.node.height = TILE_SIZE;
    }

    update(dt) {
        // this.node.x -= 50 * dt;
        // this.node.children.forEach((child: cc.Node) => child.getComponent(cc.RigidBody).syncPosition(true))
        this.node.children.forEach((child: cc.Node) => child.x -= this._speed * dt)
    }
}
