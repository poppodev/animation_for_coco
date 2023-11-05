import * as PIXI from 'pixi.js'
import { type Sunny } from './sunny'
import * as Common from '../common'

export class Queen extends PIXI.Container {
  app: PIXI.Application
  private readonly baseSprite!: PIXI.Sprite
  manual: boolean = false
  baseScale: number = 0.5
  shadow!: QueenShadow
  shadowDiff: number = 565
  baseHeight: number = 0

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
    this.baseScale = scale
    this.baseHeight = baseSprite.height

    const shadow = new QueenShadow(this.width * scale)
    this.shadow = shadow
    this.shadow.x = 300
    this.shadow.y = this.height
    this.addChildAt(shadow, 0)

    this.reset()
  }

  reset () {
    this.x = -this.width
    this.y = -this.height
    this.shadow.y = -this.y + this.shadowDiff
  }

  async appear (fromX: number, fromY: number, stopX: number, stopY: number): Promise<void> {
    this.visible = true
    const sunny: Sunny = this.getChildByName('sunny') as Sunny
    setTimeout(() => { sunny.smile() }, 1000)
    sunny.reset()
    sunny.setDown(true)

    this.shadow.appear()
    await this.appearDown(fromX, fromY, stopX, stopY)
    await this.moveVertical(20, 3)
    await this.moveVertical(20, -3)

    sunny.setDown(false)
    sunny.hairBound()
  }

  async getOut (): Promise<void> {
    const sunny: Sunny = this.getChildByName('sunny') as Sunny
    sunny.setUp(true)
    await this.moveVertical(20, 3)
    await this.moveVertical(20, -3)
    Common.sleep(1000).then(() => { this.shadow.leave() })
    await this.getOutUp()
    this.visible = false
    sunny.setUp(false)
  }

  private async appearDown (fromX: number, fromY: number, stopX: number, stopY: number): Promise<void> {
    // start position
    this.x = fromX
    this.y = fromY

    if (this.getChildByName('sunny') !== null) {
      const sunny = this.getChildByName('sunny') as Sunny
      sunny.setDown(true)
    }

    const duration = 120
    const xStep = (stopX - fromX) / duration
    const yStep = (stopY - fromY) / duration

    const appearTicker = new PIXI.Ticker()
    await new Promise<void>((resolve) => {
      appearTicker.add(async () => {
        if (this.x < stopX) {
          this.x += xStep
          this.y += yStep
          this.shadow.y = -this.y + this.shadowDiff
        } else {
          //
          this.shadow.y = -this.y + this.shadowDiff
          resolve()
          appearTicker.destroy()
        }
      })
      appearTicker.start()
    })
  }

  private async moveVertical (distance: number, step: number): Promise<void> {
    const ticker = new PIXI.Ticker()
    let moved = 0
    await new Promise<void>((resolve) => {
      ticker.add(() => {
        this.y += step
        this.shadow.y = -this.y + this.shadowDiff
        moved += step
        if (Math.abs(moved) >= distance) {
          resolve()
          ticker.destroy()
        }
      })
      ticker.start()
    })
  }

  private async getOutUp (): Promise<void> {
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
          this.shadow.y = -this.y + this.shadowDiff
        } else {
          this.reset()
          resolve()
          appearTicker.destroy()
        }
      })
      appearTicker.start()
    })
  }
}

class QueenShadow extends PIXI.Graphics {
  constructor (qunnSize: number) {
    super()
    this.beginFill(0x000000, 0.15)
    this.drawEllipse(0, 0, qunnSize, 20)
    this.endFill()
    this.x = 0
    this.y = 100
    this.alpha = 0
  }

  async appear (): Promise<void> {
    const ticker = new PIXI.Ticker()
    await new Promise<void>((resolve) => {
      ticker.add(() => {
        this.alpha += 0.01
        if (this.alpha >= 1) {
          ticker.destroy()
          resolve()
        }
      })
      ticker.start()
    })
  }

  async leave (): Promise<void> {
    const ticker = new PIXI.Ticker()
    await new Promise<void>((resolve) => {
      ticker.add(() => {
        this.alpha -= 0.01
        if (this.alpha <= 0) {
          ticker.destroy()
          resolve()
        }
      })
      ticker.start()
    })
  }
}
