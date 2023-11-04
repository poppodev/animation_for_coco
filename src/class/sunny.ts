import * as PIXI from 'pixi.js'
import * as Common from '../common'
import { ScriptElementKind } from 'typescript'

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
    this.name = 'sunny'

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
    const stopAngle = -60
    if (this.armSprite.rotation < 0) {
      on = false
    }

    this.hairSprites.forEach((hair) => {
      const fromDegree = Common.rad2deg(hair.rotation)
      const toDegree = fromDegree + Common.randomNumber(8, 12)
      hair.flutter(fromDegree, toDegree)
        .then(() => {
          hair.flutter(toDegree, fromDegree)
            .then(() => {
              hair.flutter(fromDegree, toDegree)
                .then(() => { hair.flutter(toDegree, fromDegree) })
            })
        })
    })

    new Promise<void>((resolve) => {
      const ticker = new PIXI.Ticker()
      ticker.add(() => {
        if (on) {
          if (this.armSprite.rotation < Common.deg2rad(stopAngle)) {
            resolve()
            ticker.destroy()
          } else {
            this.armSprite.rotation -= Common.deg2rad(2)
          }
        } else {
          if (this.armSprite.rotation > Common.deg2rad(0)) {
            resolve()
            ticker.destroy()
          } else {
            this.armSprite.rotation += Common.deg2rad(2)
          }
        }
      })
      ticker.start()
    })
  }

  setDown (isDown: boolean) {
    this.hairSprites.forEach((hair) => {
      hair.isDown = isDown
      hair.isUp = false
    })
  }

  setUp (isUp: boolean) {
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
      hair.rotation = Common.deg2rad(hair.maxDegree)
    })
  }

  hairBound () {
    console.log('hairBound')
    this.hairSprites.forEach((hair) => {
      setTimeout(async () => { await hair.bound() }, Common.randomNumber(0, 100))
    })
  }
}

class Hair extends PIXI.Sprite {
  defaultDegree: number = Common.randomNumber(0, 9)
  maxDegree: number = 60
  isDown = false
  isUp = false

  constructor (srcName: string, parentScale: number = 1) {
    const texture = PIXI.Texture.from(srcName)
    super(texture)
    this.x = 700 * parentScale
    this.y = (235 + Common.randomNumber(0, 10)) * parentScale
    this.anchor.set(1, 0)
    this.visible = true

    const ticker = new PIXI.Ticker()
    let rotate = 0
    let isPlus = false
    const flutterMax = Common.randomNumber(10, 15)
    const flutterMin = -Common.randomNumber(10, 15)

    ticker.add(() => {
      if (this.isDown || this.isUp) {
        const baseRotate = (this.isDown) ? Common.deg2rad(this.maxDegree) : Common.deg2rad(this.defaultDegree)
        if (isPlus) {
          if (rotate > flutterMax) {
            isPlus = false
          }
          rotate += 0.7
        } else {
          if (rotate < flutterMin) {
            isPlus = true
          }
          rotate -= 0.7
        }
        this.rotation = baseRotate + Common.deg2rad(rotate)
      } else {
        rotate = 0
        isPlus = false
      }
    })
    ticker.start()
  }

  async bound (): Promise<void> {
    // TODO rotation -> angle
    // TODO 微調整
    await this._bound(Common.rad2deg(this.rotation), this.maxDegree * 2 / 3)
    await this.flutter(this.maxDegree * 2 / 3, this.defaultDegree - 10)
    await this.flutter(this.defaultDegree - 10, this.maxDegree / 4)
    await this.flutter(this.maxDegree / 4, this.defaultDegree - 5, 0.5)
    await this.flutter(this.defaultDegree - 5, this.defaultDegree, 0.5)
  }

  async flutter (startDegree: number, stopDegree: number, speed: number = 1): Promise<void> {
    await new Promise<void>((resolve) => {
      const ticker = new PIXI.Ticker()
      let degree = startDegree
      ticker.add(() => {
        if (startDegree > stopDegree) {
          degree -= 1 * speed
          if (degree < stopDegree) {
            resolve()
            ticker.destroy()
          }
        } else {
          degree += 1 * speed
          if (degree > stopDegree) {
            resolve()
            ticker.destroy()
          }
        }
        this.rotation = Common.deg2rad(degree)
      })
      ticker.start()
    })
  }

  private async _bound (startDegree: number, stopDegree: number): Promise<void> {
    await new Promise<void>((resolve) => {
      const ticker = new PIXI.Ticker()
      let degree = startDegree
      let touched = false
      let frame = 0
      ticker.add(() => {
        if (touched) {
          // back
          if (degree > stopDegree) {
            resolve()
            ticker.destroy()
          } else {
            frame -= 0.7
            degree += Math.abs(frame * 0.1)
            this.rotation = Common.deg2rad(degree)
          }
        } else {
          // go
          if (degree <= this.defaultDegree) {
            touched = true
          } else {
            frame += 0.8
            degree -= frame * 0.11
            this.rotation = Common.deg2rad(degree)
          }
        }
      })
      ticker.start()
    })
  }
}
