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
    const stopAngle = -55
    if (this.armSprite.rotation < 0) {
      on = false
    }

    new Promise<void>((resolve) => {
      const ticker = new PIXI.Ticker()
      ticker.add((delta) => {
        if (on) {
          if (this.armSprite.angle < stopAngle) {
            resolve()
            ticker.destroy()
          } else {
            this.armSprite.angle -= 2 * delta
          }
        } else {
          if (this.armSprite.angle > 0) {
            this.armAfterEffect()
            resolve()
            ticker.destroy()
          } else {
            this.armSprite.angle += 2 * delta
          }
        }
      })
      ticker.start()
    })
  }

  private armAfterEffect () {
    this.hairSprites.forEach((hair) => {
      const fromDegree = Common.rad2deg(hair.rotation)
      const toDegree = fromDegree + Common.randomNumber(4, 8)
      hair.flutter(fromDegree, toDegree)
        .then(() => {
          hair.flutter(toDegree, fromDegree)
            .then(() => {
              hair.flutter(fromDegree, toDegree)
                .then(() => { hair.flutter(toDegree, fromDegree) })
            })
        })
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
      hair.angle = hair.maxDegree
    })
  }

  hairBound () {
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
    let angle = 0
    let isPlus = false
    const flutterMaxAngle = Common.randomNumber(10, 15)
    const flutterMinAngle = -Common.randomNumber(10, 15)

    ticker.add((delta) => {
      if (this.isDown || this.isUp) {
        const baseAngle = (this.isDown) ? this.maxDegree : this.defaultDegree
        if (isPlus) {
          if (angle > flutterMaxAngle) {
            isPlus = false
          }
          angle += 0.7 * delta
        } else {
          if (angle < flutterMinAngle) {
            isPlus = true
          }
          angle -= 0.7 * delta
        }
        this.angle = baseAngle + angle
      } else {
        angle = 0
        isPlus = false
      }
    })
    ticker.start()
  }

  async bound (): Promise<void> {
    await this._bound(this.angle, this.maxDegree * 2 / 3)
    await this.flutter(this.maxDegree * 2 / 3, this.defaultDegree - 10)
    await this.flutter(this.defaultDegree - 10, this.maxDegree / 4)
    await this.flutter(this.maxDegree / 4, this.defaultDegree - 5, 0.5)
    await this.flutter(this.defaultDegree - 5, this.defaultDegree, 0.5)
  }

  async flutter (startDegree: number, stopDegree: number, speed: number = 1): Promise<void> {
    await new Promise<void>((resolve) => {
      const ticker = new PIXI.Ticker()
      let degree = startDegree
      ticker.add((delta) => {
        if (startDegree > stopDegree) {
          degree -= 1 * speed * delta
          if (degree < stopDegree) {
            resolve()
            ticker.destroy()
          }
        } else {
          degree += 1 * speed * delta
          if (degree > stopDegree) {
            resolve()
            ticker.destroy()
          }
        }
        this.angle = degree
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
      ticker.add((delta) => {
        if (touched) {
          // back
          if (degree > stopDegree) {
            resolve()
            ticker.destroy()
          } else {
            frame -= 0.7 * delta
            degree += Math.abs(frame * 0.1) * delta
            this.angle = degree
          }
        } else {
          // go
          if (degree <= this.defaultDegree) {
            touched = true
          } else {
            frame += 0.8 * delta
            degree -= frame * 0.11 * delta
            this.angle = degree
          }
        }
      })
      ticker.start()
    })
  }
}
