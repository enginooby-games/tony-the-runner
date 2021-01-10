import { Globals } from './Globals'
import { PlatformData, PlatformShape } from './Types'

const { ccclass, property } = cc._decorator;
const TILE_SIZE: number = 64;

@ccclass
export default class Platform extends cc.Component {
    @property(cc.Prefab)
    tilePrefab = null;
    @property({ type: [cc.Prefab] })
    diamondPrefabs: cc.Prefab[] = []
    @property(cc.Prefab)
    spikePrefab = null

    @property
    diamondOffsetMin: number = 100
    @property
    diamondOffsetMax: number = 200

    _active: boolean // whether visible on the screen
    // onLoad () {}

    start() {
    }

    init(data: PlatformData) {
        this._active = true;
        this.node.removeAllChildren()
        this.node.setPosition(data.x, data.y);

        // create tiles
        for (let i = 0; i < data.tilesCount; i++) {
            const tile: cc.Node = cc.instantiate(this.tilePrefab);
            this.node.addChild(tile)

            // if (i == 0) tile.name = "lastLeft"
            if (i == data.tilesCount - 1) tile.name = "lastTile"

            switch (data.shape) {
                case PlatformShape.HORIZONTAL:
                    tile.setPosition(i * tile.width, 0)
                    // update node size
                    this.node.width = TILE_SIZE * data.tilesCount;
                    this.node.height = TILE_SIZE;
                    break;
                case PlatformShape.VERTICAL:
                    tile.setPosition(tile.width, i * tile.height)
                    this.node.width = TILE_SIZE;
                    this.node.height = TILE_SIZE * data.tilesCount;
                    break;
                case PlatformShape.DIAGONAL_DOWN:
                    tile.setPosition(i * tile.width, (data.tilesCount - 1 - i) * tile.height)
                    this.node.width = TILE_SIZE * data.tilesCount;
                    this.node.height = TILE_SIZE * data.tilesCount;
                    tile.name = "lastTile"
                    break;
                case PlatformShape.DIAGONAL_UP:
                    tile.setPosition(i * tile.width, i * tile.height)
                    this.node.width = TILE_SIZE * data.tilesCount;
                    this.node.height = TILE_SIZE * data.tilesCount;
                    tile.name = "lastTile"
                    break;
                case PlatformShape.ZIC_ZAC:
                    tile.setPosition(i * tile.width, (i % 2) * tile.height)
                    this.node.width = TILE_SIZE * data.tilesCount;
                    this.node.height = TILE_SIZE * 2;
                    break;
            }

        }

        this.createItems(data)


    }

    createItems(data: PlatformData) {
        this.node.children.forEach((tile: cc.Node) => {
            const random: number = Math.random()

            switch (data.shape) {
                case PlatformShape.HORIZONTAL:
                case PlatformShape.DIAGONAL_DOWN:
                case PlatformShape.DIAGONAL_UP:
                case PlatformShape.ZIC_ZAC:
                    // diamond occurrence: 40%
                    if (random <= 0.4) {
                        this.createDiamond(tile)
                        // spike occurence: 15%
                    } else if (0.4 < random && random < 0.55) {
                        this.createSpike(tile)
                    }
                    break
                case PlatformShape.VERTICAL:
                    if (tile.name === "lastTile") {
                        // diamond occurrence: 40%
                        if (random <= 0.4) {
                            this.createDiamond(tile)
                            // spike occurence: 15%
                        } else if (0.4 < random && random < 0.55) {
                            this.createSpike(tile)
                        }
                    }
                    break
            }
        })
    }

    createDiamond(tile: cc.Node) {
        const random: number = Math.random()
        let diamondTypeIndex: number = null
        if (random <= 0.7) {    // diamond 1 probability: 70%
            diamondTypeIndex = 0
        } else if (0.7 < random && random < 0.95) {  // diamond 5 probability: 25%
            diamondTypeIndex = 1
        } else {    // diamond 10 probability: 5% 
            diamondTypeIndex = 2
        }

        const diamond: cc.Node = cc.instantiate(this.diamondPrefabs[diamondTypeIndex])

        const offsetY: number = this.diamondOffsetMin + Math.random() * (this.diamondOffsetMax - this.diamondOffsetMin)
        diamond.setPosition(0, offsetY)
        tile.addChild(diamond)
    }

    createSpike(tile: cc.Node) {
        const spike: cc.Node = cc.instantiate(this.spikePrefab)
        spike.setPosition(0, 48)
        tile.addChild(spike)
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
