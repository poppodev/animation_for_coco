import * as PIXI from 'pixi.js'
import { AnimatedSprite } from 'pixi.js'

export class Komatsu extends PIXI.Container {
  app: PIXI.Application
  isWalking: boolean = false
  orirentation: 'left' | 'right' = 'right'
  private walkSprite!: AnimatedSprite
  private readonly baseSprite!: PIXI.Sprite
  private readonly shadowGraphics!: PIXI.Graphics
  private cakeSprite!: PIXI.Sprite
  private cakeCoverSprite!: PIXI.Sprite

  constructor (app: PIXI.Application, scale: number = 0.5) {
    super()
    this.app = app
    this.scale.set(scale)

    // baseSprite
    const standTexture = PIXI.Texture.from('komatsuStand')
    this.baseSprite = new PIXI.Sprite(standTexture)
    this.baseSprite.name = 'komatsuBase'

    // shadow
    this.shadowGraphics = new PIXI.Graphics()
    this.shadowGraphics.beginFill(0x000000, 0.15)
    this.shadowGraphics.drawEllipse(260, 0, 180, 20)
    this.shadowGraphics.endFill()
    this.shadowGraphics.x = 0
    this.shadowGraphics.y = this.baseSprite.height - 30
    this.addChildAt(this.shadowGraphics, 0)

    this.addChild(this.baseSprite)

    this.x = 0
    this.y = this.app.renderer.height - 350

    // sprites
    this.setWalkSprite()
    this.setCakeSprite()

    // animation loop
    this.app.ticker.add(() => {
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
      const direction = this.orirentation === 'right' ? 1 : -1
      if (this.isWalking) {
        this.x += 4 * scale * direction
      }
    })
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
    cakeSprite.x = 240
    cakeSprite.y = 318
    cakeSprite.visible = true
    this.cakeSprite = cakeSprite
    this.addChildAt(cakeSprite, 0)

    const cakeCoverTexture = PIXI.Texture.from('cakeCover')
    const cakeCoverSprite = new PIXI.Sprite(cakeCoverTexture)
    cakeCoverSprite.name = 'cakeCover'
    cakeCoverSprite.x = 250
    cakeCoverSprite.y = 320
    cakeCoverSprite.visible = true
    this.cakeCoverSprite = cakeCoverSprite
    this.addChildAt(cakeCoverSprite, 1)
  }

  walk () {
    this.isWalking = true
    this.walkSprite.visible = true
    this.baseSprite.visible = false
  }

  stop () {
    this.walkSprite.visible = false
    this.baseSprite.visible = true
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
}
