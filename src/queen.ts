import * as PIXI from 'pixi.js'
import { AnimatedSprite, Texture } from 'pixi.js'

export class Queen extends PIXI.Container {
  app: PIXI.Application
  private readonly baseSprite!: PIXI.Sprite

  constructor (app: PIXI.Application, scale: number = 0.5) {
    super()
    this.app = app
    // this.scale.set(scale)

    const baseTextire = PIXI.Texture.from('queen')
    const baseSprite = new PIXI.Sprite(baseTextire)
    baseSprite.name = 'queenBase'
    baseSprite.scale.set(scale)
    this.addChild(baseSprite)
    this.baseSprite = baseSprite
    this.x = -this.width
    this.y = -this.height
  }

  appear () {
    const stopPointX = this.app.renderer.width / 4
    const stopPointY = -260 * this.baseSprite.scale.y

    const startPointX = this.x = this.app.renderer.width / 6
    const startPointY = -this.height

    // start position
    this.x = startPointX
    this.y = startPointY

    const duration = 120
    const xStep = (stopPointX - startPointX) / duration
    const yStep = (stopPointY - startPointY) / duration
    this.app.ticker.add(() => {
      if (this.x < stopPointX) {
        this.x += xStep
        this.y += yStep
      }
    })
  }
}
