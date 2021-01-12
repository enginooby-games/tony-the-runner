// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Globals } from "./Globals";
import Helpers from './Helpers';
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    update(dt) {
        Helpers.moveWithRigidChildrentX(this.node, -Globals.speed * 2 * dt)
        if (this.node.x <= - cc.winSize.width) {
            this.node.destroy()
        }
    }
}
