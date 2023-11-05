import * as PIXI from 'pixi.js'
import { AnimatedSprite } from 'pixi.js'
import { type Komatsu } from './komatsu'
import * as Common from '../common'

export class Coco extends PIXI.Container {
  app: PIXI.Application
  isWalking: boolean = false
  isRunning: boolean = false
  isDown: boolean = false
  hasReaction: boolean = false
  manual: boolean = false
  onMoving: boolean = false
  orirentation: 'left' | 'right' = 'left'
  readonly walkSpeedDefault: number = 6
  walkSpeed: number = this.walkSpeedDefault
  private readonly baseSprite!: PIXI.Sprite
  private reverseWalkPatchSprite!: PIXI.Sprite
  private faceUpSprite!: PIXI.Sprite
  private reverseFaceUpSprite!: PIXI.Sprite
  private surpriseSprite!: PIXI.Sprite
  private smileSprite!: PIXI.Sprite
  private walkSprite!: AnimatedSprite
  private runSprite!: AnimatedSprite
  private downSprite!: AnimatedSprite
  private standUpSprite!: AnimatedSprite
  private turnLeftSprite!: AnimatedSprite
  private reverseTurnPatchSprite!: AnimatedSprite
  private reverseRunPatchSprite!: AnimatedSprite
  private reverseDownPatchSprite!: AnimatedSprite
  private eyeCloseSprite!: AnimatedSprite
  private eyeBlinkSprite!: AnimatedSprite
  private downSmileSprite!: AnimatedSprite
  private removeCoverSprite!: PIXI.AnimatedSprite
  private appendCoverSprite!: PIXI.AnimatedSprite
  private reactionSprite!: PIXI.Sprite
  private readonly turnMargin = 50

  constructor (app: PIXI.Application, scale: number = 0.5, manual: boolean = false) {
    super()
    this.app = app
    this.scale.set(scale)
    this.manual = manual

    // basesprite
    this.baseSprite = PIXI.Sprite.from('cocoStand')
    this.baseSprite.name = 'cocoBase'
    this.baseSprite.addChildAt(this.shadowGraphics(100, this.baseSprite.width / 2, this.baseSprite.height - 30), 0)
    this.addChild(this.baseSprite)

    // initial position
    if (this.manual) {
      this.x = this.app.renderer.width / 2
    } else {
      this.x = this.app.renderer.width
      0
    }
    this.y = this.app.renderer.height - 350

    // animated sprites
    this.setWalkSprite()
    this.setRunSprite()
    this.setDownSprite()
    this.setTurnLeftSprite()

    // parts sprites
    this.setPatchSprites()

    // reation
    this.setReactionSprite()

    // animation loop
    this.app.ticker.add(() => {
      // turn
      if (this.manual) {
        const originallyRunning = this.isRunning
        const originallyWalking = this.isWalking
        if ((this.isWalking || this.isRunning) && this.isReachEdge()) {
          this.turn().then(() => {
            if (originallyWalking) {
              this.walk()
            } else if (originallyRunning) {
              this.run()
            }
          })
        }
      }

      // walk or run
      const direction = this.orirentation === 'left' ? 1 : -1
      if (this.isWalking) {
        this.x += -this.walkSpeed * scale * direction
      } else if (this.isRunning) {
        this.x += -15 * scale * direction
      }

      // blink
      const random = Math.random()
      if (random > 0.995 && !this.eyeCloseSprite.visible) {
        this.blink()
      }
    })
  }

  isReachEdge () {
    const isTurn =
    (
      ((this.orirentation === 'left') && (this.x + this.width * this.scale.x < 0 + this.turnMargin * this.scale.x)) ||
      ((this.orirentation === 'right') && (this.x > this.app.renderer.width - this.width / 2 - this.turnMargin))
    )
    return isTurn
  }

  private setWalkSprite () {
    const walkSrcs = [
      'cocoWalk1',
      'cocoWalk2',
      'cocoWalk3',
      'cocoWalk4',
      'cocoWalk5',
      'cocoWalk6',
      'cocoWalk7',
      'cocoWalk8'
    ]
    const walkTextures = walkSrcs.map(src => PIXI.Texture.from(src))

    this.walkSprite = new AnimatedSprite(walkTextures)
    this.walkSprite.visible = false
    this.walkSprite.animationSpeed = 0.1
    this.walkSprite.play()
    this.walkSprite.name = 'cocoWalk'

    // shadow
    const shadowGraphics = this.shadowGraphics(170, this.baseSprite.width / 2 + 20, this.baseSprite.height - 30)
    this.walkSprite.addChildAt(shadowGraphics, 0)

    this.addChild(this.walkSprite)
  }

  private setRunSprite () {
    const runSrcs = [
      'cocoRun1',
      'cocoRun2',
      'cocoRun3',
      'cocoRun4',
      'cocoRun5',
      'cocoRun6',
      'cocoRun7',
      'cocoRun8'
    ]
    const runTextures = runSrcs.map(src => PIXI.Texture.from(src))
    this.runSprite = new AnimatedSprite(runTextures)
    this.runSprite.visible = false
    this.runSprite.animationSpeed = 0.18
    this.runSprite.play()
    this.runSprite.name = 'cocoRun'

    const shadowGraphics = this.shadowGraphics(220, this.baseSprite.width / 2 + 20, this.baseSprite.height - 30)
    this.runSprite.addChildAt(shadowGraphics, 0)
    this.addChild(this.runSprite)
  }

  private setDownSprite () {
    // downsprite
    const srcDowns = [
      'cocoDown1',
      'cocoDown2',
      'cocoDown3',
      'cocoDown4',
      'cocoDown5'
    ]
    const downTextures = srcDowns.map(src => PIXI.Texture.from(src))
    this.downSprite = new AnimatedSprite(downTextures)
    this.downSprite.animationSpeed = 0.15
    this.downSprite.name = 'cocoDown'
    this.downSprite.loop = false
    this.downSprite.visible = false
    this.downSprite.addChildAt(this.shadowGraphics(200, this.baseSprite.width / 2, this.baseSprite.height - 30), 0)
    this.addChild(this.downSprite)

    // cover remove
    const removeCoverSrcs = ['cocoRemoveCakeCover1', 'cocoRemoveCakeCover2', 'cocoRemoveCakeCover3', 'cocoRemoveCakeCover4']
    this.removeCoverSprite = new AnimatedSprite(removeCoverSrcs.map(src => PIXI.Texture.from(src)))
    this.removeCoverSprite.animationSpeed = 0.08
    this.removeCoverSprite.loop = false
    this.removeCoverSprite.visible = false
    this.removeCoverSprite.name = 'removeCover'
    this.removeCoverSprite.addChildAt(this.shadowGraphics(200, this.baseSprite.width / 2, this.baseSprite.height - 30), 0)
    this.addChild(this.removeCoverSprite)

    // cover append
    const appendCoverSrcs = removeCoverSrcs.reverse()
    this.appendCoverSprite = new AnimatedSprite(appendCoverSrcs.map(src => PIXI.Texture.from(src)))
    this.appendCoverSprite.animationSpeed = 0.08
    this.appendCoverSprite.loop = false
    this.appendCoverSprite.visible = false
    this.appendCoverSprite.name = 'appendCover'
    this.appendCoverSprite.addChildAt(this.shadowGraphics(200, this.baseSprite.width / 2, this.baseSprite.height - 30), 0)
    this.addChild(this.appendCoverSprite)

    // stand up
    const srcStandUps = srcDowns.reverse()
    const standUpTextures = srcStandUps.map(src => PIXI.Texture.from(src))
    this.standUpSprite = new AnimatedSprite(standUpTextures)
    this.standUpSprite.animationSpeed = 0.15
    this.standUpSprite.name = 'cocoStandUp'
    this.standUpSprite.loop = false
    this.standUpSprite.visible = false
    this.standUpSprite.addChildAt(this.shadowGraphics(200, this.baseSprite.width / 2, this.baseSprite.height - 30), 0)
    this.addChild(this.standUpSprite)
  }

  private shadowGraphics (width: number, positionX: number, positionY: number): PIXI.Graphics {
    const shadow = new PIXI.Graphics()
    shadow.beginFill(0x000000, 0.15)
    shadow.drawEllipse(0, 0, width, 20)
    shadow.endFill()
    shadow.x = positionX
    shadow.y = positionY
    return shadow
  }

  private setTurnLeftSprite () {
    const srcTurnLefts = [
      'cocoTurnLeft1',
      'cocoTurnLeft2',
      'cocoTurnLeft3',
      'cocoTurnLeft4',
      'cocoTurnLeft5',
      'cocoTurnLeft6',
      'cocoTurnLeft7'
    ]
    const turnLeftTextures = srcTurnLefts.map(src => PIXI.Texture.from(src))
    this.turnLeftSprite = new AnimatedSprite(turnLeftTextures)
    this.turnLeftSprite.animationSpeed = 0.2
    this.turnLeftSprite.name = 'cocoTurnLeft'
    this.turnLeftSprite.loop = false
    this.turnLeftSprite.visible = false
    this.turnLeftSprite.addChildAt(this.shadowGraphics(200, this.baseSprite.width / 2, this.baseSprite.height - 30), 0)

    this.addChild(this.turnLeftSprite)
  }

  private setPatchSprites () {
    // walk reverse patch
    const reverseTexture = PIXI.Texture.from('cocoWalkReversePatch')
    const reverseSprite = new PIXI.Sprite(reverseTexture)
    reverseSprite.name = 'walkReversePatch'
    this.addChild(reverseSprite)
    this.reverseWalkPatchSprite = reverseSprite
    this.reverseWalkPatchSprite.visible = false

    // turn reverse animation
    const srcTurnReverse = [
      'cocoTurnReverse1',
      'cocoTurnReverse2',
      'cocoTurnReverse3',
      'cocoTurnReverse4',
      'cocoTurnReverse5',
      'cocoTurnReverse6',
      'cocoTurnReverse7'
    ]
    const turnReverseTextures = srcTurnReverse.map(src => PIXI.Texture.from(src))
    const turnReverseSprite = new AnimatedSprite(turnReverseTextures)
    turnReverseSprite.animationSpeed = 0.2
    turnReverseSprite.name = 'turnReverse'
    turnReverseSprite.loop = false
    turnReverseSprite.visible = false
    this.addChild(turnReverseSprite)
    this.reverseTurnPatchSprite = turnReverseSprite

    // run reverse animation
    const srcRunReverse = [
      'cocoRunReverse1',
      'cocoRunReverse2',
      'cocoRunReverse3',
      'cocoRunReverse4',
      'cocoRunReverse5',
      'cocoRunReverse6',
      'cocoRunReverse7',
      'cocoRunReverse8'
    ]
    const runReverseTextures = srcRunReverse.map(src => PIXI.Texture.from(src))
    const runReverseSprite = new AnimatedSprite(runReverseTextures)
    runReverseSprite.animationSpeed = 0.18
    runReverseSprite.name = 'runReverse'
    runReverseSprite.visible = false
    this.addChild(runReverseSprite)
    this.reverseRunPatchSprite = runReverseSprite

    // down reverse animation
    const srcDownReverse = [
      'cocoDownReverse1',
      'cocoDownReverse2',
      'cocoDownReverse3',
      'cocoDownReverse4',
      'cocoDownReverse5'
    ]
    const downReverseTextures = srcDownReverse.map(src => PIXI.Texture.from(src))
    const downReverseSprite = new AnimatedSprite(downReverseTextures)
    downReverseSprite.animationSpeed = 0.15
    downReverseSprite.name = 'downReverse'
    downReverseSprite.loop = false
    downReverseSprite.visible = false
    this.addChild(downReverseSprite)
    this.reverseDownPatchSprite = downReverseSprite

    // eye close animation
    const srcEyeClose = ['cocoEyeOpen', 'cocoEyeHalf', 'cocoEyeClose']
    const eyeCloseTextures = srcEyeClose.map(src => PIXI.Texture.from(src))
    const eyeCloseSprite = new AnimatedSprite(eyeCloseTextures)
    eyeCloseSprite.animationSpeed = 0.1
    eyeCloseSprite.name = 'eyeClose'
    eyeCloseSprite.loop = false
    eyeCloseSprite.visible = false
    this.eyeCloseSprite = eyeCloseSprite
    this.addChild(eyeCloseSprite)

    // eye blink animation
    const srcEyeBlink = ['cocoEyeOpen', 'cocoEyeHalf', 'cocoEyeClose', 'cocoEyeHalf', 'cocoEyeOpen']
    const eyeBlinkTextures = srcEyeBlink.map(src => PIXI.Texture.from(src))
    const eyeBlinkSprite = new AnimatedSprite(eyeBlinkTextures)
    eyeBlinkSprite.animationSpeed = 0.3
    eyeBlinkSprite.name = 'eyeBlink'
    eyeBlinkSprite.loop = false
    eyeBlinkSprite.visible = false
    this.addChild(eyeBlinkSprite)
    this.eyeBlinkSprite = eyeBlinkSprite

    // down smile animation
    const srcDownSmile = ['cocoDownSmile1', 'cocoDownSmile2', 'cocoDownSmile3']
    const downSmileTextures = srcDownSmile.map(src => PIXI.Texture.from(src))
    const downSmileSprite = new AnimatedSprite(downSmileTextures)
    downSmileSprite.animationSpeed = 0.3
    downSmileSprite.name = 'downSmile'
    downSmileSprite.loop = false
    downSmileSprite.visible = false
    this.addChild(downSmileSprite)
    this.downSmileSprite = downSmileSprite

    // face up sprite
    this.faceUpSprite = PIXI.Sprite.from('cocoFaceUp')
    this.faceUpSprite.visible = false
    this.faceUpSprite.addChildAt(this.shadowGraphics(100, this.baseSprite.width / 2, this.baseSprite.height - 30), 0)
    this.addChild(this.faceUpSprite)
    this.reverseFaceUpSprite = PIXI.Sprite.from('cocoFaceUpReverse')
    this.reverseFaceUpSprite.visible = false
    this.addChild(this.reverseFaceUpSprite)

    // smile sprite
    this.smileSprite = PIXI.Sprite.from('cocoEyeSmile')
    this.smileSprite.name = 'smile'
    this.smileSprite.visible = false
    this.addChild(this.smileSprite)

    // surprise sprite
    this.surpriseSprite = PIXI.Sprite.from('cocoEyeSurprised')
    this.surpriseSprite.visible = false
    const surpriseMouse = new PIXI.Sprite(PIXI.Texture.from('cocoMouseSurprised'))
    this.surpriseSprite.addChild(surpriseMouse)
    this.addChild(this.surpriseSprite)
  }

  private setReactionSprite () {
    this.reactionSprite = new PIXI.Sprite(PIXI.Texture.from('popup'))
    this.reactionSprite.visible = false
    this.reactionSprite.y = -150
    this.addChild(this.reactionSprite)
  }

  walk () {
    this.onMoving = true
    this.isWalking = true
    this.isRunning = false
    this.isDown = false
    this.children.forEach((child) => {
      child.visible = false
    })
    this.reactionSprite.visible = this.hasReaction
    this.walkSprite.gotoAndPlay(0)
    this.walkSprite.visible = true
    this.eyeBlinkSprite.visible = true
    this.reverseWalkPatchSprite.visible = this.orirentation === 'right'
  }

  async walkTo (stopPointX: number): Promise<void> {
    await this.moveTo(stopPointX, true)
  }

  async runTo (stopPointX: number): Promise<void> {
    await this.moveTo(stopPointX, false)
  }

  private async moveTo (stopPointX: number, walk: boolean): Promise<void> {
    this.onMoving = true
    this.isDown = false
    if (stopPointX < this.x) {
      this.orirentation == 'left'
    } else {
      this.orirentation == 'right'
    }
    if (walk) {
      this.walk()
    } else {
      this.run()
    }
    const ticker = new PIXI.Ticker()
    await new Promise<void>((resolve) => {
      ticker.add(() => {
        if ((this.orirentation == 'left' && this.x < stopPointX) ||
        (this.orirentation == 'right' && this.x + this.width > stopPointX)) {
          this.stop()
          ticker.destroy()
          resolve()
        }
      })
      ticker.start()
    })
  }

  run () {
    this.onMoving = true
    this.isDown = false
    this.isWalking = false
    this.isRunning = true
    this.children.forEach((child) => {
      child.visible = false
    })
    this.reactionSprite.visible = this.hasReaction
    this.runSprite.visible = true
    this.runSprite.gotoAndPlay(0)
    this.reverseRunPatchSprite.gotoAndPlay(0)
    this.reverseRunPatchSprite.visible = this.orirentation === 'right'
  }

  stop () {
    this.onMoving = false
    this.isWalking = false
    this.isRunning = false
    this.children.forEach((child) => {
      child.visible = false
    })
    this.reverseWalkPatchSprite.visible = this.orirentation === 'right'
    this.baseSprite.visible = true
    this.reactionSprite.visible = this.hasReaction
  }

  async down (): Promise<void> {
    this.onMoving = true
    this.isWalking = false
    this.isRunning = false
    this.isDown = true
    this.children.forEach((child) => {
      child.visible = false
    })
    if (this.orirentation === 'right') {
      this.reverseDownPatchSprite.visible = true
    }
    this.downSprite.visible = true
    this.reactionSprite.visible = this.hasReaction
    this.downSprite.gotoAndPlay(0)
    this.reverseDownPatchSprite.gotoAndPlay(0)
    await new Promise<void>((resolve) => {
      this.downSprite.onComplete = () => {
        this.onMoving = false
        resolve()
      }
    })
  }

  async standUp (): Promise<void> {
    this.onMoving = true
    this.isWalking = false
    this.isRunning = false
    this.isDown = false
    this.children.forEach((child) => {
      child.visible = false
    })
    this.standUpSprite.visible = true
    this.standUpSprite.gotoAndPlay(0)
    await new Promise<void>((resolve) => {
      this.standUpSprite.onComplete = () => {
        this.onMoving = false
        resolve()
      }
    })
  }

  async turn (): Promise<void> {
    this.onMoving = true
    this.isDown = false
    const originallyRunning = this.isRunning
    const originallyWalking = this.isWalking
    this.isWalking = false
    this.isRunning = false
    this.children.forEach((child) => {
      child.visible = false
    })
    this.turnLeftSprite.visible = true
    this.reactionSprite.visible = this.hasReaction
    this.turnLeftSprite.gotoAndPlay(0)
    if (this.orirentation === 'right') {
      this.reverseTurnPatchSprite.visible = true
      this.reverseTurnPatchSprite.gotoAndPlay(0)
    }
    await new Promise<void>((resolve) => {
      this.turnLeftSprite.onComplete = () => {
        this.onMoving = false
        this.reverseTurnPatchSprite.visible = false
        this.orirentation = this.orirentation === 'right' ? 'left' : 'right'
        this.turnLeftSprite.visible = false
        this.baseSprite.visible = true
        this.reverseWalkPatchSprite.visible = (this.orirentation === 'right')

        this.scale.x *= -1
        this.x -= this.width
        if (originallyRunning) {
          this.reverseRunPatchSprite.visible = this.orirentation === 'right'
        }
        if (originallyWalking) {
          this.reverseWalkPatchSprite.visible = this.orirentation === 'right'
        }
        resolve()
      }
    })
  }

  blink () {
    if (this.isWalking || this.baseSprite.visible) {
      this.eyeBlinkSprite.visible = true
      this.eyeBlinkSprite.gotoAndPlay(0)
      this.eyeBlinkSprite.onComplete = () => {
        this.eyeBlinkSprite.visible = false
      }
    }
  }

  async smile (on: boolean = true) {
    this.surpriseSprite.visible = false
    await new Promise<void>((resolve) => {
      if (on) {
        if (this.isDown) {
          this.smileSprite.visible = false
          this.downSmileSprite.visible = true
          this.downSmileSprite.gotoAndPlay(0)
          this.downSmileSprite.onComplete = () => {
            resolve()
          }
        } else if (this.baseSprite.visible || this.walkSprite.visible) {
          this.smileSprite.visible = true
          this.smileSprite.rotation = 0
          this.smileSprite.x = 0
          this.smileSprite.y = 0
          resolve()
        } else if (this.faceUpSprite.visible) {
          this.smileSprite.visible = true
          this.smileSprite.angle = 12
          this.smileSprite.x = 49
          this.smileSprite.y = -88
          resolve()
        } else {
          resolve()
        }
      } else {
        this.smileSprite.visible = false
        this.downSmileSprite.visible = false
        resolve()
      }
    })
  }

  faceUp (on: boolean = true) {
    if (this.isRunning || this.isWalking) {
      this.stop()
    }
    this.children.forEach((child) => {
      child.visible = false
    })
    if (on) {
      this.faceUpSprite.visible = true
      this.reverseFaceUpSprite.visible = this.orirentation === 'right'
    } else {
      this.baseSprite.visible = true
    }
  }

  surprised () {
    this.smileSprite.visible = false
    this.downSmileSprite.visible = false
    if (this.isRunning) {
      this.stop()
    }
    this.surpriseSprite.visible = true
    if (this.isDown) {
      this.surpriseSprite.x = -20
      this.surpriseSprite.y = 100
    } else if (this.faceUpSprite.visible) {
      this.surpriseSprite.visible = true
      this.surpriseSprite.angle = 12
      this.surpriseSprite.x = 49
      this.surpriseSprite.y = -88
    } else {
      this.surpriseSprite.y = 0
      this.surpriseSprite.x = 0
    }
  }

  async removeCover (komatsu: Komatsu): Promise<void> {
    if (!this.isDown) {
      return
    }
    this.onMoving = true
    this.children.forEach((child) => {
      child.visible = false
    })
    this.removeCoverSprite.visible = true
    if (komatsu != null) {
      this.removeCoverSprite.onFrameChange = () => {
        if (this.removeCoverSprite.currentFrame === 1) {
          komatsu.removeCakeCover()
        }
      }
    }
    this.removeCoverSprite.gotoAndPlay(0)
    await new Promise<void>((resolve) => {
      this.removeCoverSprite.onComplete = () => {
        this.onMoving = false
        resolve()
      }
    })
  }

  async appendCover (komatsu: Komatsu): Promise<void> {
    if (!this.isDown) {
      return
    }
    this.onMoving = true
    this.children.forEach((child) => {
      child.visible = false
    })
    this.appendCoverSprite.visible = true
    if (komatsu != null) {
      this.appendCoverSprite.onFrameChange = () => {
        if (this.appendCoverSprite.currentFrame === 2) {
          komatsu.appendCakeCover()
        }
      }
    }
    this.appendCoverSprite.gotoAndPlay(0)
    await new Promise<void>((resolve) => {
      this.appendCoverSprite.onComplete = () => {
        this.onMoving = false
        resolve()
      }
    })
  }

  async reaction (): Promise<void> {
    this.hasReaction = true
    this.reactionSprite.visible = true
    this.reactionSprite.alpha = 1
    const direction = this.orirentation === 'left' ? 1 : -1
    this.reactionSprite.x = direction * this.width + 20

    const messageTicker = new PIXI.Ticker()
    let waitCount = 40
    await new Promise<void>((resolve) => {
      messageTicker.add(() => {
        waitCount -= 1
        if (this.reactionSprite.alpha > 0 && waitCount <= 0) {
          this.reactionSprite.alpha -= 0.05
          this.reactionSprite.y -= 2
        }
        if (this.reactionSprite.alpha <= 0) {
          messageTicker.destroy()
          this.hasReaction = false
          resolve()
        }
      })
      messageTicker.start()
    })
  }

  setWalkSpeed (_walkSpeed: number = 6) {
    this.walkSpeed = _walkSpeed
    this.walkSprite.animationSpeed = _walkSpeed / 60
  }

  async getFlower (): Promise<void> {
    // TODO getFlower関数
    await Common.sleep(2000)
  }

  async getGiftBag (): Promise<void> {
    // TODO torikoからのプレゼントをもらう
    // TODO 退場時のアニメーション　腕を変形
    await Common.sleep(2000)
  }
}
