import * as PIXI from 'pixi.js'
import { type AnimatedSprite } from 'pixi.js'

export class Toriko extends PIXI.Container {
  app: PIXI.Application
  isWalking: boolean = false
  private readonly walkSprite!: AnimatedSprite
  private readonly baseSprite!: PIXI.Sprite

  constructor (app: PIXI.Application, scale: number = 0.5) {
    super()
    this.app = app
    this.scale.set(scale)

    const standTexture = PIXI.Texture.from('torikoStand')
    const baseSprite = new PIXI.Sprite(standTexture)
    baseSprite.name = 'torikoBase'
    this.addChild(baseSprite)
    this.baseSprite = baseSprite

    this.x = this.app.renderer.width - this.width
    this.y = this.app.renderer.height - this.height * 1.1 - 5
  }
}
