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
    this.app.ticker.add(() => {
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
          console.log('stop')
          this.x = -this.width
          this.stop()
        }
      }

      const direction = this.orirentation === 'right' ? 1 : -1
      if (this.isWalking) {
        this.x += this.walkSpeed * scale * direction
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
    cakeSprite.x = 220
    cakeSprite.y = 318
    cakeSprite.visible = true
    this.cakeSprite = cakeSprite
    this.addChildAt(cakeSprite, 0)

    const cakeCoverTexture = PIXI.Texture.from('cakeCover')
    const cakeCoverSprite = new PIXI.Sprite(cakeCoverTexture)
    cakeCoverSprite.name = 'cakeCover'
    cakeCoverSprite.x = 220
    cakeCoverSprite.y = 320
    cakeCoverSprite.visible = true
    this.cakeCoverSprite = cakeCoverSprite
    this.addChildAt(cakeCoverSprite, 1)
  }

  walk () {
    this.isWalking = true
    this.walkSprite.visible = true
    this.baseSprite.visible = false
    this.armPushSprite.visible = false
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
    console.log(this.orirentation)
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
    this.cakeSprite.x += 20
    this.cakeCoverSprite.x += 20
  }

  removeCakeCover () {
    console.log('remove cake cover')
    this.cakeCoverSprite.visible = false
  }

  appendCakeCover () {
    console.log('append cake cover')
    this.cakeCoverSprite.visible = true
  }

  async cakeEffect () {
    const sparkle = new Sparkle(0.3, 0x04ffea)
    const sparkle2 = new Sparkle(0.2, 0xeaffff)
    const sparkle3 = new Sparkle(0.3, 0xffeaff)
    sparkle.x = 250
    sparkle.y = 300
    sparkle2.x = 310
    sparkle2.y = 310
    sparkle3.x = 380
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
  blinkFrames: number = Sparkle.randomNumber(40, 60)
  hasBlinked: boolean = false
  customScale:number = 1

  constructor (_scale: number, color: number = 0xffffff) {
    super()
    this.customScale = _scale
    this.beginFill(color)
    this.moveTo(0, 0)
    this.quadraticCurveTo(100 * _scale, 0, 100*_scale, 150*_scale)
    this.quadraticCurveTo(100 * _scale, 0, 200*_scale, 0)
    this.quadraticCurveTo(100 * _scale, 0, 100*_scale,  -150*_scale)
    this.quadraticCurveTo(100 * _scale, 0, 0, 0*_scale)
    this.lineStyle(3, color)
    this.endFill()
    this.blendMode = PIXI.BLEND_MODES.SCREEN
    this.pivot.x = 100 * _scale
    this.pivot.y = 0
    this.scale.set(0)
  }

  async blink (): Promise<void> {
    const effectTicker = new PIXI.Ticker()
    new Promise<void>((resolve) => {
      effectTicker.add(() => {
        if (this.scale.x < 1 && !this.hasBlinked) {
          this.scale.set(this.scale.x + 0.15)
          if (this.scale.x >= 1) {
            console.log('blink')
            this.hasBlinked = true
          }
        }
        if (this.hasBlinked) {
          this.blinkFrames -= 1
          console.log('hasBlinked')
          if (this.blinkFrames <= 0) {
            this.alpha -= 0.05
            this.y += -0.5
            if(this.alpha <= 0){
              console.log('destroy')
              effectTicker.destroy()
              resolve()
            }
          }
        }
      })
      effectTicker.start()
    })
  }

  private static randomNumber (from: number, to: number): number {
    return Math.floor(Math.random() * (to - from + 1)) + from
  }
}
