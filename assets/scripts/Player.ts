// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {
    @property
    jumpSpeed: cc.Vec2 = new cc.Vec2(0, 300)
    @property
    maxJumpDistance: number = 300
    @property(cc.SpriteFrame)
    jumpSprite: cc.SpriteFrame = null

    _animation: cc.Animation
    _sprite: cc.Sprite
    _rigidBody: cc.RigidBody
    _jumpKeyPressing: boolean = false
    _isJumping: boolean = false
    _maxJumpDistanceReached: boolean
    _isGrounded: boolean = false
    _startJumpY: number

    onLoad() {
        this._animation = this.getComponent(cc.Animation)
        this._sprite = this.getComponent(cc.Sprite)
        this._rigidBody = this.getComponent(cc.RigidBody)

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this)
        this.node.parent.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.parent.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
    }

    onKeyDown(event: cc.Event.EventCustom) {
        switch ((event as any).keyCode) {
            case cc.macro.KEY.space:
                this._jumpKeyPressing = true
                break;
            case cc.macro.KEY.left:
                break;
            case cc.macro.KEY.right:
                break;
        }
    }

    onKeyUp(event: cc.Event.EventCustom) {
        switch ((event as any).keyCode) {
            case cc.macro.KEY.space:
                this._jumpKeyPressing = false
                this._isJumping = false
                break;
        }
    }

    onTouchStart() {
        this._jumpKeyPressing = true

    }

    onTouchEnd() {
        this._jumpKeyPressing = false
        this._isJumping = false
    }

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsBoxCollider, otherCollider: cc.PhysicsBoxCollider) {
        const worldManifold: cc.WorldManifold = contact.getWorldManifold();

        // if contact height is greater than top Y of the platform
        if (worldManifold.points[0].y >= otherCollider.node.parent.y + 320) {
            this._isGrounded = true
        }
    }

    onEndContact() {
        // this._isGrounded = false
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.node.name === 'Diamond') {
            other.node.destroy()
            this.node.emit('score')
        }
    }

    start() {


    }

    animate() {
        if (this._isGrounded) {
            if (!this._animation.getAnimationState('Player@walking').isPlaying) {
                this._animation.play('Player@walking')
            }
        } else {
            if (this._animation.getAnimationState('Player@walking').isPlaying) {
                this._animation.stop()
            }

            this._sprite.spriteFrame = this.jumpSprite
        }
    }

    update(dt) {
        if (this._jumpKeyPressing) {
            this.jump();
        }

        this.animate()

        if (this.node.y < -cc.winSize.height / 2) {
            this.node.emit('die')
        }
    }

    jump() {
        //if player is touching the ground
        if (this._isGrounded) {
            //  remember hero's start position
            this._startJumpY = this.node.y;
            //  set jump is not finished
            this._maxJumpDistanceReached = false;
            //  set jump is started
            this._isJumping = true;
            //  set hero's speed on Y axis
            this._rigidBody.linearVelocity = this.jumpSpeed;
            this._isGrounded = false;
            //else if player is jumping and jump is not finished
        } else if (this._isJumping && !this._maxJumpDistanceReached) {
            const jumpDistance = this.node.y - this._startJumpY;
            //  if jump distance is not maximum
            if (jumpDistance < this.maxJumpDistance && this.node.y < cc.winSize.height / 2 - this.node.height * 2.5) {
                //  keep player's Y speed
                this._rigidBody.linearVelocity = this.jumpSpeed;
            } else {
                //  finish jump
                this._maxJumpDistanceReached = true;
            }
        }
    }
}
