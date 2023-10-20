import * as PIXI from 'pixi.js'
import { AnimatedSprite, Texture } from 'pixi.js'

export class Komatsu extends PIXI.Container {
  app: PIXI.Application
  isWalking: boolean = false
  orirentation: 'left' | 'right' = 'right'
  private walkSprite!: AnimatedSprite
  private readonly baseSprite!: PIXI.Sprite

  constructor (app: PIXI.Application, scale: number = 0.5) {
    super()
    this.app = app
    this.scale.set(scale)

    const standTexture = PIXI.Texture.from('komatsuStand')
    const baseSprite = new PIXI.Sprite(standTexture)
    baseSprite.name = 'komatsuBase'
    this.addChild(baseSprite)
    this.baseSprite = baseSprite

    this.x = 0
    this.y = this.app.renderer.height - this.height * 1.1 + 5

    // sprites
    this.setWalkSprite()

    // animation loop
    this.app.ticker.add(() => {
      if (this.isWalking) {
        if (this.orirentation === 'left') {
          if (this.x + this.width < 0) {
            console.log('reach left end')
            this.turn()
          }
        } else {
          if (this.x + this.width > this.app.renderer.width) {
            console.log('reach right end')
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
}
