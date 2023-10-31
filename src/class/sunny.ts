import * as PIXI from 'pixi.js'

export class Sunny extends PIXI.Container {
  app: PIXI.Application
  private readonly baseSprite!: PIXI.Sprite
  private readonly armSprite!: PIXI.Sprite
  private readonly smileSprite!: PIXI.Sprite
  private hairSprites!: PIXI.Sprite[]
  isDown: boolean = false
  manual: boolean = false

  constructor (app: PIXI.Application, scale: number = 0.5, manual: boolean = false) {
    super()
    this.app = app
    this.scale.set(scale)
    this.manual = manual

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

    // 320,300
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
      const hairSprite = PIXI.Sprite.from(`sunnyHair${i + 1}`)
      hairSprite.name = `sunnyHair${i + 1}`
      hairSprite.x = 20 * this.scale.x
      hairSprite.y = 150 * this.scale.y
      hairSprite.visible = true
      hairSprites.push(hairSprite)
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

  givePresent () {
    const duration = 20
    const stopAngle = 60
    const step = stopAngle / duration * ((Math.round(this.armSprite.rotation) >= 0) ? -1 : 1)
    let currentAngle = 0

    this.app.ticker.add(() => {
      if ((step < 0 && currentAngle >= -stopAngle) || (step > 0 && currentAngle <= stopAngle)) {
        this.armSprite.rotation += step * Math.PI / 180
        currentAngle += step
      }
    })
  }
}
