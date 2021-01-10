// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import {Globals} from './Globals'
const { ccclass, property } = cc._decorator;
const TILE_SIZE: number = 64;

@ccclass
export default class Platform extends cc.Component {
    @property(cc.Prefab)
    tilePrefab = null;
    @property(cc.Prefab)
    diamondPrefab = null
    @property(cc.Prefab)
    spikePrefab = null

    @property
    diamondOffsetMin: number = 100
    @property
    diamondOffsetMax: number = 200

    _speed: number
    _active: boolean // whether visible on the screen
    // onLoad () {}

    start() {
    }

    init(data: PlatformData) {
        this._speed = data.speed;
        this._active = true;
        this.node.removeAllChildren()
        this.node.setPosition(data.x, data.y);

        // create tiles
        for (let i = 0; i < data.tilesCount; i++) {
            const tile: cc.Node = cc.instantiate(this.tilePrefab);
            this.node.addChild(tile)
            tile.setPosition(i * tile.width, 0)

            if (i == 0) tile.name = "lastLeft"
            if (i == data.tilesCount - 1) tile.name = "lastRight"
        }

        // update node size
        this.node.width = TILE_SIZE * data.tilesCount;
        this.node.height = TILE_SIZE;

        this.createItems()
    }

    createItems() {
        this.node.children.forEach((tile: cc.Node) => {
            const random: number = Math.random()
            // diamond occurrence: 40%
            if (random <= 0.4) {
                const offsetY: number = this.diamondOffsetMin + Math.random() * (this.diamondOffsetMax - this.diamondOffsetMin)
                const diamond: cc.Node = cc.instantiate(this.diamondPrefab)
                diamond.setPosition(0, offsetY)
                tile.addChild(diamond)
                // spike occurence: 15%
            } else if (0.4 < random && random < 0.55) {
                const spike: cc.Node = cc.instantiate(this.spikePrefab)
                spike.setPosition(0, 48)
                tile.addChild(spike)
            }
        })
    }

    update(dt) {
        // this.node.x -= 50 * dt;
        // this.node.children.forEach((child: cc.Node) => child.getComponent(cc.RigidBody).syncPosition(true))
        this.node.children.forEach((child: cc.Node) => child.x -= Globals.speed * dt)
        if (this.node.x < 0 - this.node.width) {
            this._active = false
        }
    }
}
