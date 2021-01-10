// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import { Globals } from "./Globals";
import { PlatformShape, PlatformData } from './Types'
import Platform from "./Platform";
const { ccclass, property } = cc._decorator;
let SCREEN_TOP_Y: number
let SCREEN_BOTTOM_Y: number
let SCREEN_RIGHT_X: number
const TILE_SIZE: number = 64;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Prefab)
    platformPrefab = null;

    @property
    xOffsetMin: number = 60
    @property
    xOffsetMax: number = 200
    @property
    yOffsetMin: number = -120
    @property
    yOffsetMax: number = 200
    @property
    tilesCountMin: number = 1
    @property
    tilesCountMax: number = 5

    _currentPlatform: cc.Node = null
    _platformPool: cc.Node[] = []

    onLoad() {
        SCREEN_TOP_Y = cc.winSize.height / 2
        SCREEN_BOTTOM_Y = -cc.winSize.height / 2
        SCREEN_RIGHT_X = cc.winSize.width / 2
        // SCREEN_TOP_Y = this.node.parent.height / 2
        // SCREEN_BOTTOM_Y = -this.node.parent.height / 2
        // SCREEN_RIGHT_X = this.node.parent.width / 2
    }

    start() {
        this.createPlatform()
    }

    // for next platform base on current platform
    generateRandomPlatformData(): PlatformData {
        let data: PlatformData = {
            shape: this.randomEnum(PlatformShape),
            tilesCount: 0,
            x: 0,
            y: 0
        }

        const xOffset: number = this.xOffsetMin + Math.random() * (this.xOffsetMax - this.xOffsetMin)
        const yOffset: number = this.yOffsetMin + Math.random() * (this.yOffsetMax - this.yOffsetMin)

        let tempY: number = this._currentPlatform.y + yOffset
        tempY = Math.min(tempY, SCREEN_TOP_Y - 64 * 2)
        tempY = Math.max(tempY, SCREEN_BOTTOM_Y + 64 / 2)

        // data.x = this._currentPlatform.node.x + xOffset
        data.x = SCREEN_RIGHT_X
        data.y = tempY

        data.tilesCount = this.tilesCountMin + Math.floor(Math.random() * (this.tilesCountMax - this.tilesCountMin))

        return data
    }

    randomEnum<T>(anEnum: T): T[keyof T] {
        const enumValues = Object.keys(anEnum)
            .map(n => Number.parseInt(n))
            .filter(n => !Number.isNaN(n)) as unknown as T[keyof T][]
        const randomIndex = Math.floor(Math.random() * enumValues.length)
        const randomEnumValue = enumValues[randomIndex]
        return randomEnumValue;
    }

    createPlatform() {
        // pool system: reuse last inactive platform to init new platform
        const lastInactivePlatform: cc.Node = this._platformPool.find(
            (thePlatform: cc.Node) => !(thePlatform.getComponent("Platform") as Platform)._active)

        if (lastInactivePlatform) {
            this._currentPlatform = lastInactivePlatform;
        } else {
            this._currentPlatform = cc.instantiate(this.platformPrefab);
            this.node.addChild(this._currentPlatform)
            this._platformPool.push(this._currentPlatform)
        }

        const platformComponent = this._currentPlatform.getComponent("Platform");
        platformComponent.init(this.generateRandomPlatformData());
    }

    update(dt) {
        this.node.children.forEach((child: cc.Node) => child.x -= Globals.speed * dt)

        const currentPlatformRightX = this._currentPlatform.x + this._currentPlatform.width

        // create new platform when the lasted generated flatform is fully visible on the screen
        if (currentPlatformRightX < SCREEN_RIGHT_X) {
            this.createPlatform()
        }

    }
}
