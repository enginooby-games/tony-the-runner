// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    _rigidBody: cc.RigidBody


    onLoad() {
        this._rigidBody = this.getComponent(cc.RigidBody)
        // this._rigidBody.linearVelocity = new cc.Vec2(1, 0)
    }

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsBoxCollider, otherCollider: cc.PhysicsBoxCollider) {
        // const worldManifold: cc.WorldManifold = contact.getWorldManifold();

        // if contact height is greater than top Y of the platform
        // if (worldManifold.points[0].y >= otherCollider.node.parent.y + 320
        //     && otherCollider.node.name != 'Dirt Tile') {
        //     this._isGrounded = true
        // }
        // this._rigidBody.enabled = false
    }

    move(minX: number, maxX: number) {

    }

    start() {

    }

    update(dt) {
        this.node.x -= 15 * dt
    }
}
