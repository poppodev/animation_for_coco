import * as PIXI from 'pixi.js'
import { type AnimatedSprite } from 'pixi.js'

export class Toriko extends PIXI.Container {
  app: PIXI.Application
  isWalking: boolean = false
  private walkSprite!: AnimatedSprite
  private readonly baseSprite!: PIXI.Sprite
  private readonly rightArmSprite!: AnimatedSprite

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

    this.setWlakSprite()

    // position
    this.x = this.app.renderer.width - this.width
    this.y = this.app.renderer.height - this.height * 1.1 - 5

    // animation loop
    this.app.ticker.add(() => {
      if (this.x + this.width * scale < 0) {
        this.stop()
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

    this.addChild(this.walkSprite)
  }

  smile () {
    let smileSprite = this.getChildByName('smile')
    if (smileSprite === null) {
      smileSprite = PIXI.Sprite.from('torikoSmile')
      smileSprite.name = 'smile'
      smileSprite.visible = false
      this.addChild(smileSprite)
    }
    smileSprite.visible = !smileSprite.visible
  }

  givePresent () {
    this.rightArmSprite.gotoAndPlay(0)
    this.rightArmSprite.onComplete = () => {
      this.smile()
    }
  }

  walk () {
    this.isWalking = true
    this.rightArmSprite.visible = false
    this.walkSprite.visible = true
    this.baseSprite.visible = false
  }

  stop () {
    this.rightArmSprite.visible = true
    this.walkSprite.visible = false
    this.baseSprite.visible = true
    this.isWalking = false
  }
}
