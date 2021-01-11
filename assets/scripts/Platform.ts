import { Globals } from './Globals'
import Helpers from './Helpers';
import { PlatformData, PlatformShape } from './Types'

const { ccclass, property } = cc._decorator;
const TILE_SIZE: number = 64;

@ccclass
export default class Platform extends cc.Component {
    @property(cc.Prefab)
    dirtGrassPrefab = null;
    @property(cc.Prefab)
    dirtPrefab = null;
    @property(cc.Prefab)
    spikePrefab = null
    @property({ type: [cc.Prefab] })
    diamondPrefabs: cc.Prefab[] = []
    @property({ type: [cc.Prefab] })
    treePrefabs: cc.Prefab[] = []
    @property({ type: [cc.Prefab] })
    enemyPrefabs: cc.Prefab[] = []

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
            let tile: cc.Node
            if (data.shape == PlatformShape.VERTICAL) {
                if (i == data.tilesCount - 1) {
                    tile = cc.instantiate(this.dirtGrassPrefab);
                } else {
                    tile = cc.instantiate(this.dirtPrefab);
                }
            } else {
                tile = cc.instantiate(this.dirtGrassPrefab);
            }

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

            this.node.addChild(tile)
            if (i == data.tilesCount - 1) tile.name = "lastTile"
        }

        this.populatePlatforms(data)


    }

    populatePlatforms(data: PlatformData) {
        this.node.children.forEach((tile: cc.Node) => {

            switch (data.shape) {
                case PlatformShape.HORIZONTAL:
                case PlatformShape.DIAGONAL_DOWN:
                case PlatformShape.DIAGONAL_UP:
                case PlatformShape.ZIC_ZAC:
                    this.populateTile(tile)
                    break
                case PlatformShape.VERTICAL:
                    if (tile.name === "lastTile") {
                        this.populateTile(tile)
                    }
                    break
            }

            // populate emeny
            const random: number = Math.random()
            // 50% on last tile of horizontal platform
            if (data.shape == PlatformShape.HORIZONTAL && tile.name === 'lastTile' && random < 0.5) {
                this.createEnemy(tile)
            }
            // 30% on last tile of horizontal platform
            if (data.shape == PlatformShape.DIAGONAL_UP && tile.name === 'lastTile' && random < 0.3) {
                this.createEnemy(tile)
            }

        })
    }

    populateTile(tile: cc.Node) {
        const random: number = Math.random()

        if (random <= 0.4) { // diamond occurrence: 40%
            if (Math.random() <= 0.3) this.createTree(tile) // tree occurence on diamond tile: 30% 
            this.createDiamond(tile)
        } else if (0.4 < random && random < 0.55) {  // spike occurence: 15%
            this.createSpike(tile)
        } else {
            if (Math.random() <= 0.5) this.createTree(tile) // tree occurence on empty tile: 50% 
        }

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

    createEnemy(tile: cc.Node) {
        const randomIndex = Helpers.randomIntBetween(0, this.enemyPrefabs.length - 1)
        const enemy: cc.Node = cc.instantiate(this.enemyPrefabs[randomIndex])
        enemy.setPosition(0, tile.height + enemy.height / 2 - enemy.height / 2) // pre-calculate position in prefabs to reduce calculations
        tile.addChild(enemy)
    }

    createSpike(tile: cc.Node) {
        const spike: cc.Node = cc.instantiate(this.spikePrefab)
        // spike.setPosition(0, tile.height + spike.height / 2 - tile.height / 2) // pre-calculate position in prefabs to reduce calculations
        tile.addChild(spike)

        const scaleX = Helpers.randomBetween(0.5, 1)
        const scaleY = Helpers.randomBetween(0.5, 1.5)
        spike.setScale(scaleX, scaleY)
        spike.setPosition(0, tile.height + (spike.height * scaleY) / 2 - tile.height / 2)
    }

    createTree(tile: cc.Node) {
        const randomIndex = Helpers.randomIntBetween(0, this.treePrefabs.length - 1)
        const tree: cc.Node = cc.instantiate(this.treePrefabs[randomIndex])
        tile.addChild(tree)

        const scaleX = Helpers.randomBetween(1, 1.75)
        const scaleY = Helpers.randomBetween(1, 1.75)
        tree.setScale(scaleX, scaleY)
        tree.setPosition(0, tile.height + (tree.height * scaleY) / 2 - tile.height / 2)
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
