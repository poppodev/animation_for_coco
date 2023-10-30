import * as PIXI from 'pixi.js'

export class Queen extends PIXI.Container {
  app: PIXI.Application
  private readonly baseSprite!: PIXI.Sprite

  constructor (app: PIXI.Application, scale: number = 0.5) {
    super()
    this.app = app

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
    console.log('appear')
    this.visible = true
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
    const appearTicker = new PIXI.Ticker()
    appearTicker.add(() => {
      if (this.x < stopPointX) {
        this.x += xStep
        this.y += yStep
      } else {
        appearTicker.destroy()
      }
    })
    appearTicker.start()
  }

  getOut () {
    console.log('getOut')
    const stopPointX = this.app.renderer.width * 2 / 3
    const stopPointY = -this.height

    const startPointX = this.x
    const startPointY = this.y

    // start position
    this.x = startPointX
    this.y = startPointY

    const duration = 150
    const xStep = (stopPointX - startPointX) / duration
    const yStep = (stopPointY - startPointY) / duration
    const appearTicker = new PIXI.Ticker()
    appearTicker.add(() => {
      if (this.x < stopPointX) {
        this.x += xStep
        this.y += yStep
      } else {
        this.visible = false
        appearTicker.destroy()
      }
    })
    appearTicker.start()
  }
}
