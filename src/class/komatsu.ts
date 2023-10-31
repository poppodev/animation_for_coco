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
    const blurFilter = new PIXI.filters.BlurFilter()
    blurFilter.blur = 0.5
    blurFilter.quality = 3

    //　ひし形のグラフィックを作成
    const diamond1 = new Diamond(0.2, 0xf4ffea)
    const diamond2 = new Diamond(0.25, 0xeaffff)
    const diamond3 = new Diamond(0.2, 0xffeaff)
    diamond1.x = 250
    diamond1.y = 318
    diamond2.x = 300
    diamond2.y = 300
    diamond3.x = 350
    diamond3.y = 318

    const diamondContainer = new PIXI.Container()
    diamondContainer.addChild(diamond1)
    diamondContainer.addChild(diamond2)
    diamondContainer.addChild(diamond3)
    diamondContainer.filters = [blurFilter]
    this.addChild(diamondContainer)

    const twinklingPromises = [
      diamond1.twinkling(),
      diamond2.twinkling(),
      diamond3.twinkling()
    ]
    await Promise.all(twinklingPromises)
  }
}

class Diamond extends PIXI.Graphics {
  blinkFrames: number = Diamond.randomNumber(50, 80)
  waitTimeBeforeStart: number = Diamond.randomNumber(10, 20)
  deleteXDistance: number = Diamond.randomNumber(-10, 10)
  hasBlinked: boolean = false
  constructor (size: number, color: number = 0xffffff) {
    super()
    this.beginFill(color)
    this.moveTo(0, 0)
      .lineTo(100 * size, 150 * size)
      .lineTo(200 * size, 0)
      .lineTo(100 * size, -150 * size)
      .lineTo(0, 0)
      .endFill()
    this.alpha = 0.1
    this.pivot.set(100 * size, 0)
  }

  async twinkling (): Promise<void> {
    await Common.sleep(this.waitTimeBeforeStart * 10)
    const effectTicker = new PIXI.Ticker()
    new Promise<void>((resolve) => {
      effectTicker.add(() => {
        if (this.alpha < 1 && !this.hasBlinked) {
          this.alpha += 0.1
          this.y -= 4
          if (this.alpha >= 1) {
            this.hasBlinked = true
          }
        }
        if (this.hasBlinked) {
          this.blinkFrames -= 1
          if (this.blinkFrames <= 0) {
            this.alpha -= 0.05
            this.y += 1
            this.x += this.deleteXDistance / 10
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

  private static randomNumber (from: number, to: number): number {
    return Math.floor(Math.random() * (to - from + 1)) + from
  }
}
