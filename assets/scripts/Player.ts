// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ContinuousHeathBar from "./ContinuousHeathBar";
import { Globals } from "./Globals";
import Helpers from "./Helpers";
import { RunnerMode } from "./Types";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {
    @property
    maxHealth: number = 10
    @property
    jumpSpeed: cc.Vec2 = new cc.Vec2(0, 150)
    @property
    moveSpeed: number = 150
    @property
    maxJumpDistance: number = 300
    @property(cc.SpriteFrame)
    jumpSprite: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    idleSprite: cc.SpriteFrame = null

    @property(cc.Node)
    leftButton: cc.Node = null
    @property(cc.Node)
    rightButton: cc.Node = null
    @property(cc.Node)
    jumpButton: cc.Node = null
    @property(ContinuousHeathBar)
    healthBar: ContinuousHeathBar = null
    @property(cc.Node)
    sheildAura: cc.Node = null

    // @property
    // runnerMode: RunnerMode = RunnerMode.AUTO

    _heath: number
    _animation: cc.Animation
    _sprite: cc.Sprite
    _rigidBody: cc.RigidBody
    _jumpKeyPressing: boolean = false
    _leftKeyPressing: boolean = false
    _rightKeyPressing: boolean = false
    _isJumping: boolean = false
    _maxJumpDistanceReached: boolean
    _isGrounded: boolean = false
    _startJumpY: number
    _shieldDuration: number = 0

    onLoad() {
        this._heath = this.maxHealth
        this._animation = this.getComponent(cc.Animation)
        this._sprite = this.getComponent(cc.Sprite)
        this._rigidBody = this.getComponent(cc.RigidBody)

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this)
        // this.node.parent.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        // this.node.parent.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)

        const pressOpacity: number = 200
        const releaseOpacity: number = 80
        if (this.leftButton) {
            this.leftButton.on(cc.Node.EventType.TOUCH_START, () => {
                this._leftKeyPressing = true
                this._rightKeyPressing = false
                this.leftButton.opacity = pressOpacity
            }, this)
            this.leftButton.on(cc.Node.EventType.TOUCH_END, () => {
                this._leftKeyPressing = false
                this.leftButton.opacity = releaseOpacity
            }, this)
        }

        if (this.rightButton) {
            this.rightButton.on(cc.Node.EventType.TOUCH_START, () => {
                this._rightKeyPressing = true
                this._leftKeyPressing = false
                this.rightButton.opacity = pressOpacity
            }, this)
            this.rightButton.on(cc.Node.EventType.TOUCH_END, () => {
                this._rightKeyPressing = false
                this.rightButton.opacity = releaseOpacity
            }, this)
        }

        if (this.jumpButton) {
            this.jumpButton.on(cc.Node.EventType.TOUCH_START, () => {
                this._jumpKeyPressing = true
                this.jumpButton.opacity = pressOpacity
            }, this)
            this.jumpButton.on(cc.Node.EventType.TOUCH_END, () => {
                this._jumpKeyPressing = false
                this._isJumping = false
                this.jumpButton.opacity = releaseOpacity
            }, this)
        }
    }

    onKeyDown(event: cc.Event.EventCustom) {
        switch ((event as any).keyCode) {
            case cc.macro.KEY.space:
                this._jumpKeyPressing = true
                break;
            case cc.macro.KEY.left:
            case cc.macro.KEY.a:
                this._leftKeyPressing = true
                this._rightKeyPressing = false
                break;
            case cc.macro.KEY.right:
            case cc.macro.KEY.d:
                this._rightKeyPressing = true
                this._leftKeyPressing = false
                break;
        }
    }

    onKeyUp(event: cc.Event.EventCustom) {
        switch ((event as any).keyCode) {
            case cc.macro.KEY.space:
                this._jumpKeyPressing = false
                this._isJumping = false
                break;
            case cc.macro.KEY.left:
            case cc.macro.KEY.a:
                this._leftKeyPressing = false
                break;
            case cc.macro.KEY.right:
            case cc.macro.KEY.d:
                this._rightKeyPressing = false
                break;
        }
    }

    // onTouchStart() {
    //     this._jumpKeyPressing = true
    // }

    // onTouchEnd() {
    //     this._jumpKeyPressing = false
    //     this._isJumping = false
    // }

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsBoxCollider, otherCollider: cc.PhysicsBoxCollider) {
        // TODO: figure out the position of the collision

        // const worldManifold: cc.WorldManifold = contact.getWorldManifold();

        // // if contact height is greater than top Y of the platform
        // if (worldManifold.points[0].y >= otherCollider.node.parent.y + 320
        //     && otherCollider.node.name != 'Dirt Tile') {
        //     this._isGrounded = true
        // }

        // if (otherCollider.node.name === 'Spider') {
        //     this._isGrounded = true
        // }
        this._isGrounded = true
        // this.node.angle = cc.misc.lerp(this.node.angle, 0, 0.1)

    }

    onEndContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsBoxCollider, otherCollider: cc.PhysicsBoxCollider) {
        if (otherCollider.node.name === 'lastTile') {
            this._isGrounded = false
            this._rigidBody.fixedRotation = false
        }
    }

    _beingDamaged: boolean
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        switch (other.node.name) {
            case 'Diamond I':
                this.node.emit('score', 1)
                other.node.destroy()
                break
            case 'Diamond II':
                this.node.emit('score', 10)
                other.node.destroy()
                break
            case 'Diamond III':
                this.node.emit('score', 50)
                other.node.destroy()
                break
            case 'Spike':
                this._beingDamaged = true
                this.getDamaged(-1) // kick-off immediately
                const interval = setInterval(() => {
                    this.getDamaged(-1);
                    if (!this._beingDamaged) {
                        clearInterval(interval)
                    }
                }, 500);
                break
            case 'Heart':
                this.updateHealth(1)
                other.node.destroy()
                break
            case 'Shield':
                this.enableShield(7)
                this.schedule(this.countdownShield, 1)
                other.node.destroy()
                break
        }
    }

    onCollisionExit(other: cc.Collider, self: cc.Collider) {
        switch (other.node.name) {
            case 'Spike':
                this._beingDamaged = false
                break
        }
    }

    enableShield(duration: number) {
        this.sheildAura.active = true
        this._shieldDuration = duration
    }

    disableShield() {
        this.sheildAura.active = false
    }

    countdownShield() {
        this._shieldDuration--;
        if (this._shieldDuration === 0) {
            this.disableShield()
            this.unschedule(this.countdownShield)
        }
    }

    updateHealth(amount: number) {
        this._heath = Math.min(this._heath + amount, this.maxHealth)
        if (this._heath > 0) {
            const heathPercent = this._heath * 100 / this.maxHealth
            this.healthBar.updateOnChange(heathPercent)
        } else {
            this.node.emit('die')
        }
    }

    getDamaged(amount: number) {
        if (!this._beingDamaged || this._shieldDuration > 0) return
        const red: cc.Color = new cc.Color(255, 0, 0)
        Helpers.blink(this, red)
        this.updateHealth(amount)
    }

    start() {
    }

    animate() {
        if (this._isGrounded) {
            if (Globals.runnerMode == RunnerMode.AUTO) {
                if (!this._animation.getAnimationState('Player@walking').isPlaying) {
                    this._animation.play('Player@walking')
                }
            } else {
                if (this._rightKeyPressing || this._leftKeyPressing) {
                    if (!this._animation.getAnimationState('Player@walking').isPlaying) {
                        this._animation.play('Player@walking')
                    }
                } else {
                    if (this._animation.getAnimationState('Player@walking').isPlaying) {
                        this._animation.stop()
                    }

                    this._sprite.spriteFrame = this.idleSprite
                }
            }
        } else {
            if (this._animation.getAnimationState('Player@walking').isPlaying) {
                this._animation.stop()
            }

            this._sprite.spriteFrame = this.jumpSprite
        }
    }

    update(dt) {
       

        if (Globals.runnerMode == RunnerMode.MANUAL) {
            this.node.x -= Globals.speed * dt * 2
            this.moveSpeed = (Globals.speed + 20) * 2.3
        }

        if (this._jumpKeyPressing) {
            this.jump();
        }

        if (this._leftKeyPressing) {
            this.node.x -= this.moveSpeed * dt
        } else if (this._rightKeyPressing) {
            this.node.x += this.moveSpeed * dt
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
            if (jumpDistance < this.maxJumpDistance && this.node.y < cc.winSize.height / 2 - 70 + Globals.yExtra) { // top boumdary
                //  keep player's Y speed
                this._rigidBody.linearVelocity = this.jumpSpeed;
            } else {
                //  finish jump
                this._maxJumpDistanceReached = true;
            }
        }
    }
}
