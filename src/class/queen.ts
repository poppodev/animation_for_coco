import * as PIXI from 'pixi.js'
import { Sunny } from './sunny'
import * as Common from '../common'

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
    const sunny : Sunny = this.getChildByName('sunny') as Sunny
    setTimeout(() => { sunny.smile() }, 1000)
    sunny.reset()
    sunny.setDown(true)

    await this.appearDown()
    await this.moveVertical(20, 3)
    await this.moveVertical(20, -3)

    // await Common.sleep(600)
    sunny.setDown(false)
    sunny.hairBound()
  }

  async getOut (): Promise<void> {
    const sunny : Sunny = this.getChildByName('sunny') as Sunny
    sunny.setUp(true)
    await this.moveVertical(20, 3)
    await this.moveVertical(20, -3)    
    await this.getOutUp()
    this.visible = false
    sunny.setUp(false)
  }

  private async appearDown(){
    const stopPointX = 150
    const stopPointY = -260 * this.baseSprite.scale.y

    const startPointX = 0
    const startPointY = -this.height

    // start position
    this.x = startPointX
    this.y = startPointY

    if(this.getChildByName('sunny') !== null) {
      const sunny = this.getChildByName('sunny') as Sunny
      sunny.setDown(true)
    }

    const duration = 120
    const xStep = (stopPointX - startPointX) / duration
    const yStep = (stopPointY - startPointY) / duration

    const appearTicker = new PIXI.Ticker()
    return await new Promise<void>((resolve) => {
      appearTicker.add(async () => {
        if (this.x < stopPointX) {
          this.x += xStep
          this.y += yStep
        }else{
          resolve()
          appearTicker.destroy()
        }          
      })
      appearTicker.start()
    })
  }


  private async moveVertical (distance:number,step:number): Promise<void> {
   const ticker = new PIXI.Ticker()
   let moved = 0
   return new Promise<void>((resolve) => {
    ticker.add(() => {
      this.y += step
      moved += step
      if(Math.abs(moved) >= distance){
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
        } else {
          resolve()
          appearTicker.destroy()
        }
      })
      appearTicker.start()
    })
  }
}
