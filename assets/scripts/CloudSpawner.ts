// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Globals } from './Globals'
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property
    poolSize: number = 6
    @property
    spawnInterval: number = 8
    @property({ type: [cc.Prefab] })
    cloudPrefabs: cc.Prefab[] = []

    count: number = 0
    cloudsPool: cc.Node[] = []

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    randomBetween(min: number, max: number): number {
        return min + Math.random() * (max - min)
    }

    randomIntBetween(min: number, max: number): number {
        return min + Math.floor(Math.random() * (max - min))
    }

    createCloud() {
        this.count++

        let cloud: cc.Node
        const index = this.randomIntBetween(0, this.cloudPrefabs.length - 1)

        if (this.count <= this.poolSize) {
            cloud = cc.instantiate(this.cloudPrefabs[index])
            this.node.addChild(cloud)
            this.cloudsPool.push(cloud)
        } else {
            cloud = this.cloudsPool[this.count % this.poolSize - 1]
        }

        this.randomizeCloud(cloud)
    }

    randomizeCloud(cloud: cc.Node) {
        const y = this.randomBetween(cc.winSize.height / 2 - cloud.height / 5, cc.winSize.height / 2 - cloud.height / 1.25)
        const scale = this.randomBetween(0.25, 0.5)
        const opacity = this.randomIntBetween(135, 235)
        cloud.setPosition(cc.winSize.width / 2 + cloud.width / 2, y)
        cloud.setScale(scale, scale)
        cloud.opacity = opacity
    }

    start() {
        this.schedule(function () {
            this.createCloud()
            cc.log(this.node.childrenCount)
            cc.log(this.cloudsPool.length)
        }, this.spawnInterval);
    }

    update(dt) {
        this.node.children.forEach((cloud: cc.Node) => {
            cloud.x -= Globals.speed * dt
        })
    }
}
