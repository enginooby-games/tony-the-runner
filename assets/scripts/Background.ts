// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import { Globals } from "./Globals";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property
    speed: number = 100

    start() {

    }

    move(node, offset) {
        // find the X coord of the right edge of the current sprite
        const spriteRightX = node.x + node.width / 2;
        // find the X coord of the left edge of the screen
        const screenLeftX = -cc.winSize.width / 2;

        // if the right X of the sprite is less than left X of the screen
        if (spriteRightX <= screenLeftX) {
            // swap the images
            node.x += node.width * 2 - offset;
        } else {
            // else shift current node with the specified offset
            node.x -= offset;
        }
    }

    update(dt) {
        this.node.children.forEach(node => {
            this.move(node, Globals.speed * dt / 1.5);
        });
    }
}
