import * as PIXI from 'pixi.js'
import { type AnimatedSprite } from 'pixi.js'

export class Toriko extends PIXI.Container {
  app: PIXI.Application
  isWalking: boolean = false
  hasPresent: boolean = true
  private walkSprite!: AnimatedSprite
  private walkArmSprite!: AnimatedSprite
  private readonly baseSprite!: PIXI.Sprite
  private readonly rightArmSprite!: AnimatedSprite
  private readonly smileSprite!: PIXI.Sprite

  constructor (app: PIXI.Application, scale: number = 0.5) {
    super()
    this.app = app
    this.scale.set(scale)

    // arm
    const rightArmSrc = ['torikoArmRight1', 'torikoArmRight2', 'torikoArmRight3', 'torikoArmRight4']
    const rightArmTextures = rightArmSrc.map(src => PIXI.Texture.from(src))
    this.rightArmSprite = new PIXI.AnimatedSprite(rightArmTextures)
    this.rightArmSprite.name = 'torikoRightArm'
    this.rightArmSprite.loop = false
    this.rightArmSprite.animationSpeed = 0.1
    this.addChild(this.rightArmSprite)

    // base
    const standTexture = PIXI.Texture.from('torikoStand')
    this.baseSprite = new PIXI.Sprite(standTexture)
    this.baseSprite.name = 'torikoBase'

    // shadow
    const shadowGraphics = new PIXI.Graphics()
    shadowGraphics.beginFill(0x000000, 0.15)
    shadowGraphics.drawEllipse(0, 0, 150, 20)
    shadowGraphics.endFill()
    shadowGraphics.x = 420
    shadowGraphics.y = this.baseSprite.height - 10
    this.baseSprite.addChildAt(shadowGraphics, 0)
    this.addChild(this.baseSprite)

    // smile
    this.smileSprite = PIXI.Sprite.from('torikoSmile')
    this.smileSprite.name = 'smile'
    this.smileSprite.visible = false
    this.addChild(this.smileSprite)

    this.setWlakSprite()

    // position
    this.x = this.app.renderer.width - this.width
    this.y = this.app.renderer.height - 375

    // animation loop
    this.app.ticker.add(() => {
      if (this.x + this.width < 0) {
        this.x = app.renderer.width
      } else {
        if (this.isWalking) {
          this.x -= 6 * scale
        }
      }
    })
  }

  private setWlakSprite () {
    const walkSrc = ['torikoWalk1', 'torikoWalk2', 'torikoWalk3', 'torikoWalk4', 'torikoWalk5', 'torikoWalk6', 'torikoWalk7', 'torikoWalk8']
    const walkTextures = walkSrc.map(src => PIXI.Texture.from(src))
    this.walkSprite = new PIXI.AnimatedSprite(walkTextures)
    this.walkSprite.name = 'torikoWalk'
    this.walkSprite.animationSpeed = 0.1
    this.walkSprite.loop = true
    this.walkSprite.visible = false
    this.walkSprite.play()

    // shadow
    const shadowGraphics = new PIXI.Graphics()
    shadowGraphics.beginFill(0x000000, 0.15)
    shadowGraphics.drawEllipse(0, 0, 170, 20)
    shadowGraphics.endFill()
    shadowGraphics.x = 420
    shadowGraphics.y = this.baseSprite.height - 10
    this.walkSprite.addChildAt(shadowGraphics, 0)

    // arm
    const walkArmSpriteSrc = ['torikoWalkArm1', 'torikoWalkArm2', 'torikoWalkArm3', 'torikoWalkArm4', 'torikoWalkArm5', 'torikoWalkArm6', 'torikoWalkArm7', 'torikoWalkArm8']
    const walkArmTextures = walkArmSpriteSrc.map(src => PIXI.Texture.from(src))
    this.walkArmSprite = new PIXI.AnimatedSprite(walkArmTextures)
    this.walkArmSprite.name = 'torikoWalkArm'
    this.walkArmSprite.animationSpeed = 0.1
    this.walkArmSprite.loop = true
    this.walkArmSprite.visible = false
    this.walkArmSprite.play()

    // add
    this.addChild(this.walkArmSprite)
    this.addChild(this.walkSprite)
  }

  smile () {
    this.smileSprite.visible = !this.smileSprite.visible
    if (this.isWalking) {
      this.smileSprite.visible = false
    }
  }

  givePresent () {
    if (this.isWalking) {
      this.stop()
    }
    // this.children.forEach((child) => {
    //   child.visible = false
    // })
    this.rightArmSprite.visible = true
    this.rightArmSprite.gotoAndPlay(0)
    this.rightArmSprite.onComplete = () => {
      this.smile()
      this.hasPresent = false
    }
  }

  walk () {
    this.isWalking = true
    this.children.forEach((child) => {
      child.visible = false
    })
    this.walkSprite.visible = true
    this.walkArmSprite.visible = this.hasPresent
  }

  stop () {
    this.isWalking = false
    this.children.forEach((child) => {
      child.visible = false
    })
    this.rightArmSprite.visible = this.hasPresent
    this.baseSprite.visible = true
  }
}
