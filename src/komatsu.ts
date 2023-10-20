import * as PIXI from 'pixi.js'
import { AnimatedSprite, Texture } from 'pixi.js'

export class Komatsu extends PIXI.Container {
  app: PIXI.Application
  isWalking: boolean = false
  private readonly walkSprite!: AnimatedSprite
  private readonly baseSprite!: PIXI.Sprite

  constructor (app: PIXI.Application) {
    super()
    this.app = app
    this.scale.set(0.5)

    const standTexture = PIXI.Texture.from('komatsuStand')
    const baseSprite = new PIXI.Sprite(standTexture)
    baseSprite.name = 'komatsuBase'
    this.addChild(baseSprite)
    this.baseSprite = baseSprite

    this.x = 0
    this.y = this.app.renderer.height - this.height + 5

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
    const thisTextureArray: Texture[] = []

    walkSrcs.forEach((imagePath) => {
      const texture = Texture.from(imagePath)
      thisTextureArray.push(texture)
    })

    this.walkSprite = new AnimatedSprite(thisTextureArray)
    this.walkSprite.visible = false
    this.walkSprite.animationSpeed = 0.1
    this.walkSprite.play()
    this.walkSprite.name = 'komatsuWalk'
    this.addChild(this.walkSprite)
  }

  walk () {
    console.log('walk')
    this.isWalking = true
    this.walkSprite.visible = true
    this.app.ticker.add(() => {
      if (!this.isWalking) {
        return
      }
      this.x += 2
      if (this.x > this.app.renderer.width + this.width) {
        this.x = -this.width
      }
    })
    this.baseSprite.visible = false
  }

  stop () {
    console.log('stop')
    this.walkSprite.visible = false
    this.baseSprite.visible = true
    this.isWalking = false
  }
}
