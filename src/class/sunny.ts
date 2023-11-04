import * as PIXI from 'pixi.js'
import * as Common from '../common'

export class Sunny extends PIXI.Container {
  app: PIXI.Application
  private readonly baseSprite!: PIXI.Sprite
  private readonly armSprite!: PIXI.Sprite
  private readonly smileSprite!: PIXI.Sprite
  private hairSprites!: Hair[]
  manual: boolean = false

  constructor (app: PIXI.Application, scale: number = 0.5, manual: boolean = false) {
    super()
    this.app = app
    this.scale.set(scale)
    this.manual = manual
    this.name = "sunny"

    const baseTextire = PIXI.Texture.from('sunny')
    this.baseSprite = new PIXI.Sprite(baseTextire)
    this.baseSprite.name = 'sunnyBase'
    this.addChild(this.baseSprite)

    this.x = 600 * scale
    this.y = 650 * scale

    // arm
    const armTexture = PIXI.Texture.from('sunnyArm')
    this.armSprite = new PIXI.Sprite(armTexture)
    this.armSprite.name = 'sunnyArm'
    this.armSprite.anchor.set(320 / 600, 300 / 700)
    this.armSprite.x = 800 * this.scale.x
    this.armSprite.y = 750 * this.scale.y
    this.addChild(this.armSprite)

    // hair
    this.setHairs()
  }

  private setHairs () {
    // 8 hairs
    const hairSprites = []
    for (let i = 0; i < 8; i++) {
      const hair = new Hair(`sunnyHair${i + 1}`, this.scale.x)
      hairSprites.push(hair)
    }
    this.hairSprites = hairSprites
    this.addChild(...hairSprites)
  }

  smile () {
    let smileSprite = this.getChildByName('smile')
    if (smileSprite === null) {
      smileSprite = PIXI.Sprite.from('sunnySmile')
      smileSprite.name = 'smile'
      smileSprite.visible = false
      this.addChild(smileSprite)
    }
    smileSprite.visible = !smileSprite.visible
  }

  async givePresent (on: boolean = true) {
    const duration = 20
    const stopAngle = 60
    let step = stopAngle / duration
    if (on || Math.round(this.armSprite.rotation) >= 0) {
      step *= -1
    }
    let currentAngle = 0

    new Promise<void>((resolve) => {
      this.app.ticker.add(() => {
        if ((step < 0 && currentAngle >= -stopAngle) || (step > 0 && currentAngle <= stopAngle)) {
          this.armSprite.rotation += step * Math.PI / 180
          currentAngle += step
          resolve()
        }
      })
    })
  }

  setDown(isDown:boolean){
    this.hairSprites.forEach((hair) => {
      hair.isDown = isDown
      hair.isUp = false
    })
  }

  setUp(isUp:boolean){
    this.hairSprites.forEach((hair) => {
      hair.isUp = isUp
      hair.isDown = false
    })
  }

  removeFlowers () {
    this.armSprite.texture = PIXI.Texture.from('sunnyArmFree')
  }

  reset () {
    this.armSprite.texture = PIXI.Texture.from('sunnyArm')
    this.hairSprites.forEach((hair) => {
      hair.rotation = 0
    })
  }

  hairBound(){
    console.log('hairBound')
    this.hairSprites.forEach((hair) => {
      hair.bound()
    })
  }
}

class Hair extends PIXI.Sprite {
  maxDegree: number = Common.randomNumber(25, 40)
  defaultDegree:number = Common.randomNumber(0,10)
  isDown = false
  isUp = false
  ticker = new PIXI.Ticker()
  constructor (srcName: string, parentScale: number = 1) {
    const texture = PIXI.Texture.from(srcName)
    super(texture)
    this.x = 700 * parentScale
    this.y = (235 + Common.randomNumber(0,10) )* parentScale
    this.anchor.set(1, 0)
    this.visible = true

    // TODO hair animations
    let downDegree = 0
    this.ticker.add(() => {
    if(this.isDown){
        console.log("down anim")
        downDegree += 1
        if(Common.rad2deg(this.rotation) < this.maxDegree){        
          this.rotation = Common.deg2rad(downDegree)
        }else{
          downDegree = 0 // reset
        }
      }else if(this.isUp){
        // TODO
      }
    })
    this.ticker.start()
  }

  async bound(): Promise<void>{
    console.log("ぴょん")
    
    return new Promise<void>((resolve) => {
      const ticker = new PIXI.Ticker()
      ticker.add(() => {
        if(this.rotation > Common.deg2rad(this.defaultDegree)){
          this.rotation -= Common.deg2rad(1)
        }else{
          resolve()
          ticker.destroy()
        }
      })
      ticker.start()
    })
  }
}