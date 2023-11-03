import * as PIXI from 'pixi.js'

export class Queen extends PIXI.Container {
  app: PIXI.Application
  private readonly baseSprite!: PIXI.Sprite
  manual: boolean = false

  constructor (app: PIXI.Application, scale: number = 0.5, manual: boolean = false) {
    super()
    this.app = app
    this.manual = manual

    const baseTextire = PIXI.Texture.from('queen')
    const baseSprite = new PIXI.Sprite(baseTextire)
    baseSprite.name = 'queenBase'
    baseSprite.scale.set(scale)
    this.addChild(baseSprite)
    this.baseSprite = baseSprite
    this.x = -this.width
    this.y = -this.height
  }

  async appear (): Promise<void> {
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
    await new Promise<void>((resolve) => {
      appearTicker.add(() => {
        if (this.x < stopPointX) {
          this.x += xStep
          this.y += yStep
        } else {
          resolve()
          appearTicker.destroy()
        }
      })
      appearTicker.start()
    })
  }

  async getOut (): Promise<void> {
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
    await new Promise<void>((resolve) => {
      appearTicker.add(() => {
        if (this.x < stopPointX) {
          this.x += xStep
          this.y += yStep
        } else {
          this.visible = false
          appearTicker.destroy()
          resolve()
        }
      })
      appearTicker.start()
    })
  }
}
