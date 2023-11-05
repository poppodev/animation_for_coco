import * as PIXI from 'pixi.js'
import * as Common from '../common'
import { AnimatedSprite } from 'pixi.js'
import '@pixi/filter-blur'

export class Komatsu extends PIXI.Container {
  app: PIXI.Application
  isWalking: boolean = false
  manual: boolean = false
  orirentation: 'left' | 'right' = 'right'
  walkSpeed: number = 4
  cakeDefaultX: number = 220
  cakeDefaultY: number = 318
  private walkSprite!: AnimatedSprite
  private readonly baseSprite!: PIXI.Sprite
  private readonly armPushSprite!: PIXI.Sprite
  private readonly shadowGraphics!: PIXI.Graphics
  private cakeSprite!: PIXI.Sprite
  private cakeCoverSprite!: PIXI.Sprite

  constructor (app: PIXI.Application, scale: number = 0.5, manual: boolean = false) {
    super()
    this.app = app
    this.scale.set(scale)
    this.manual = manual

    // baseSprite
    const standTexture = PIXI.Texture.from('komatsuStand')
    this.baseSprite = new PIXI.Sprite(standTexture)
    this.baseSprite.name = 'komatsuBase'
    this.addChild(this.baseSprite)

    // shadow
    this.shadowGraphics = new PIXI.Graphics()
    this.shadowGraphics.beginFill(0x000000, 0.15)
    this.shadowGraphics.drawEllipse(260, 0, 180, 20)
    this.shadowGraphics.endFill()
    this.shadowGraphics.x = 0
    this.shadowGraphics.y = this.baseSprite.height - 30
    this.addChildAt(this.shadowGraphics, 0)

    // armPushSprite
    const armPushTexture = PIXI.Texture.from('komatsuArmPush')
    this.armPushSprite = new PIXI.Sprite(armPushTexture)
    this.armPushSprite.name = 'komatsuArmPush'
    this.armPushSprite.visible = false
    this.addChild(this.armPushSprite)

    this.x = 0
    this.y = this.app.renderer.height - 350

    // sprites
    this.setWalkSprite()
    this.setCakeSprite()

    // default
    this.reset()

    // animation loop
    this.app.ticker.add((delta) => {
      // auto turn
      if (this.manual) {
        if (this.isWalking) {
          if (this.orirentation === 'left') {
            if (this.x + this.width < 0) {
              this.turn()
            }
          } else {
            if (this.x + this.width > this.app.renderer.width) {
              this.turn()
            }
          }
        }
      } else {
        if (this.orirentation === 'right' && (this.x > this.app.renderer.width)) {
          this.x = -this.width
          this.stop()
        }
      }

      const direction = this.orirentation === 'right' ? 1 : -1
      if (this.isWalking) {
        this.x += this.walkSpeed * scale * direction * delta
      }
    })
  }

  reset () {
    if (this.manual) {
      this.x = 0
    } else {
      this.x = -this.width
    }
    this.baseSprite.visible = true
    this.cakeSprite.visible = true
    this.cakeCoverSprite.visible = true
  }

  private setWalkSprite () {
    const walkSrcs = [
      'komatsuWalk1',
      'komatsuWalk2',
      'komatsuWalk3',
      'komatsuWalk4',
      'komatsuWalk5',
      'komatsuWalk6',
      'komatsuWalk7',
      'komatsuWalk8'
    ]
    const thisTextureArray = walkSrcs.map(src => PIXI.Texture.from(src))

    this.walkSprite = new AnimatedSprite(thisTextureArray)
    this.walkSprite.visible = false
    this.walkSprite.animationSpeed = 0.1
    this.walkSprite.play()
    this.walkSprite.name = 'komatsuWalk'
    this.addChild(this.walkSprite)
  }

  private setCakeSprite () {
    const cakeTexture = PIXI.Texture.from('cake')
    const cakeSprite = new PIXI.Sprite(cakeTexture)
    cakeSprite.name = 'cake'
    cakeSprite.x = this.cakeDefaultX
    cakeSprite.y = this.cakeDefaultY
    cakeSprite.visible = true
    this.cakeSprite = cakeSprite
    this.addChildAt(cakeSprite, 0)

    const cakeCoverTexture = PIXI.Texture.from('cakeCover')
    const cakeCoverSprite = new PIXI.Sprite(cakeCoverTexture)
    cakeCoverSprite.name = 'cakeCover'
    cakeCoverSprite.x = this.cakeDefaultX
    cakeCoverSprite.y = this.cakeDefaultY
    cakeCoverSprite.visible = true
    this.cakeCoverSprite = cakeCoverSprite
    this.addChildAt(cakeCoverSprite, 1)
  }

  walk () {
    this.isWalking = true
    this.walkSprite.visible = true
    this.baseSprite.visible = false
    this.armPushSprite.visible = false
    this.cakeCoverSprite.x = this.cakeDefaultX
    this.cakeCoverSprite.y = this.cakeDefaultY
    this.cakeSprite.x = this.cakeDefaultX
    this.cakeSprite.y = this.cakeDefaultY
  }

  stop () {
    this.walkSprite.visible = false
    this.baseSprite.visible = true
    this.armPushSprite.visible = false
    this.isWalking = false
  }

  turn () {
    const originallyWalking = this.isWalking
    this.orirentation = this.orirentation === 'right' ? 'left' : 'right'
    if (originallyWalking) {
      this.scale.x *= -1
      this.x -= this.width
      this.walk()
    }
  }

  smile () {
    let smileSprite = this.getChildByName('smile')
    if (smileSprite === null) {
      smileSprite = PIXI.Sprite.from('komatsuSmile')
      smileSprite.name = 'smile'
      smileSprite.visible = false
      this.addChild(smileSprite)
    }
    smileSprite.visible = !smileSprite.visible
  }

  givePresent () {
    this.baseSprite.visible = false
    this.armPushSprite.visible = true
    this.cakeSprite.x += 33
    this.cakeCoverSprite.x += 33
  }

  removeCakeCover () {
    this.cakeCoverSprite.visible = false
  }

  appendCakeCover () {
    this.cakeCoverSprite.visible = true
  }

  async cakeEffect () {
    const sparkle = new Sparkle(0.25, 0xe6ffe9, Common.randomNumber(100, 500))
    const sparkle2 = new Sparkle(0.2, 0xf3ffd8, Common.randomNumber(100, 500))
    const sparkle3 = new Sparkle(0.25, 0xd7eeff, Common.randomNumber(100, 500))
    sparkle.x = 280
    sparkle.y = 300
    sparkle2.x = 330
    sparkle2.y = 310
    sparkle3.x = 400
    sparkle3.y = 305

    const sparkleContainer = new PIXI.Container()
    sparkleContainer.addChild(sparkle)
    sparkleContainer.addChild(sparkle2)
    sparkleContainer.addChild(sparkle3)
    this.addChild(sparkleContainer)

    const blinkPromises = [
      sparkle.blink(),
      sparkle2.blink(),
      sparkle3.blink()
    ]
    await Promise.all(blinkPromises)
  }
}

class Sparkle extends PIXI.Graphics {
  blinkFrames: number = Common.randomNumber(40, 60)
  hasBlinked: boolean = false
  customScale: number = 1
  waitingTime: number = 0

  constructor (_scale: number, color: number = 0xffffff, waitingTime: number = 0) {
    super()
    this.customScale = _scale
    this.beginFill(color)
    this.moveTo(0, 0)
    this.quadraticCurveTo(100 * _scale, 0, 100 * _scale, 150 * _scale)
    this.quadraticCurveTo(100 * _scale, 0, 200 * _scale, 0)
    this.quadraticCurveTo(100 * _scale, 0, 100 * _scale, -150 * _scale)
    this.quadraticCurveTo(100 * _scale, 0, 0, 0 * _scale)
    this.lineStyle(3, color)
    this.endFill()
    this.pivot.x = 100 * _scale
    this.pivot.y = 0
    this.scale.set(0)
    this.waitingTime = waitingTime
  }

  async blink (): Promise<void> {
    const effectTicker = new PIXI.Ticker()
    await Common.sleep(this.waitingTime)
    new Promise<void>((resolve) => {
      let frame = 0
      effectTicker.add((delta) => {
        this.y += -0.5 * delta
        frame += 1 * delta
        if ((frame > 20 && frame < 40) || (frame > 60 && frame < 80)) {
          this.scale.set(1.5)
        } else {
          this.scale.set(1)
        }
        if (frame > 20) {
          this.blinkFrames -= 1 * delta
          if (this.blinkFrames <= 0) {
            this.alpha -= 0.05 * delta
            this.y += -0.5 * delta
            if (this.alpha <= 0) {
              effectTicker.destroy()
              resolve()
            }
          }
        }
      })
      effectTicker.start()
    })
  }
}
