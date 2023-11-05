import * as PIXI from 'pixi.js'
import * as Common from '../common'
import { GlowFilter } from '@pixi/filter-glow'

export class Zebra extends PIXI.Container {
  app: PIXI.Application
  private readonly baseSprite!: PIXI.Sprite
  private walkSprite!: PIXI.AnimatedSprite
  private readonly smileSprite!: PIXI.Sprite
  private popperSprite!: PIXI.AnimatedSprite
  private popperPullSprite!: PIXI.Sprite
  paperPiecesContainer = new PIXI.Container()
  manual: boolean = false
  isWalking: boolean = false

  constructor (app: PIXI.Application, scale: number = 0.5, manual: boolean = false) {
    super()
    this.app = app
    this.scale.set(scale)
    this.manual = manual

    // base
    const standTexture = PIXI.Texture.from('zebra')
    this.baseSprite = new PIXI.Sprite(standTexture)
    this.baseSprite.name = 'zebraBase'

    // shadow
    this.baseSprite.addChildAt(this.shadow(150), 0)
    this.addChild(this.baseSprite)

    // animationSprites
    this.setWlakSprite()
    this.setPopperSprite()

    // smile
    this.smileSprite = PIXI.Sprite.from('zebraSmile')
    this.smileSprite.name = 'smile'
    this.smileSprite.visible = false
    this.addChild(this.smileSprite)

    // paperPiecesContainer
    this.addChild(this.paperPiecesContainer)

    // position
    this.reset()

    // animation loop
    this.app.ticker.add(() => {
      if (this.x + this.width < 0) {
        if (this.manual) {
          this.x = app.renderer.width
        } else {
          this.stop()
        }
      } else if (this.isWalking) {
        this.x -= 6 * scale
      }
    })
  }

  private setPopperSprite () {
    const srcPopper = ['zebraPopper1', 'zebraPopper2', 'zebraPopper3', 'zebraPopper4', 'zebraPopper3', 'zebraPopper5', 'zebraPopper6', 'zebraPopper7', 'zebraPopper8']
    const popperTextures = srcPopper.map(src => PIXI.Texture.from(src))
    this.popperSprite = new PIXI.AnimatedSprite(popperTextures)
    this.popperSprite.name = 'zebraPopper'
    this.popperSprite.loop = false
    this.popperSprite.animationSpeed = 0.15
    this.popperSprite.visible = false
    this.popperSprite.addChildAt(this.shadow(150), 0)
    this.addChild(this.popperSprite)

    // doPopper
    this.popperPullSprite = PIXI.Sprite.from('zebraPopper9')
    this.popperPullSprite.name = 'zebraPopperPull'
    this.popperPullSprite.visible = false
    this.popperPullSprite.addChildAt(this.shadow(150), 0)
    this.addChild(this.popperPullSprite)
  }

  private shadow (width: number): PIXI.Graphics {
    const shadowGraphics = new PIXI.Graphics()
    shadowGraphics.beginFill(0x000000, 0.15)
    shadowGraphics.drawEllipse(0, 0, width, 20)
    shadowGraphics.endFill()
    shadowGraphics.x = 300
    shadowGraphics.y = this.baseSprite.height - 30
    return shadowGraphics
  }

  private setWlakSprite () {
    const walkSrcs = [
      'zebraWalk1',
      'zebraWalk2',
      'zebraWalk3',
      'zebraWalk4',
      'zebraWalk5',
      'zebraWalk6',
      'zebraWalk7',
      'zebraWalk8']
    const walkTextures = walkSrcs.map(src => PIXI.Texture.from(src))
    this.walkSprite = new PIXI.AnimatedSprite(walkTextures)
    this.walkSprite.name = 'zebraWalk'
    this.walkSprite.loop = true
    this.walkSprite.animationSpeed = 0.1
    this.walkSprite.visible = false

    // shadow
    this.walkSprite.addChildAt(this.shadow(220), 0)

    this.walkSprite.play()
    this.addChild(this.walkSprite)
  }

  reset () {
    this.y = this.app.renderer.height - 408
    this.baseSprite.visible = true
    if (this.manual) {
      this.x = this.app.renderer.width - this.width
    } else {
      this.x = this.app.renderer.width
    }
  }

  smile () {
    this.smileSprite.visible = !this.smileSprite.visible
    if (this.isWalking) {
      this.smileSprite.visible = false
    }
  }

  async takePopper (): Promise<void> {
    this.stop()
    this.isWalking = false
    this.children.forEach((child) => {
      child.visible = false
    })
    this.popperSprite.visible = true
    this.popperSprite.gotoAndPlay(0)
    await new Promise<void>((resolve) => {
      this.popperSprite.onComplete = () => {
        resolve()
      }
    })
  }

  async doPopper (): Promise<void> {
    this.paperPiecesContainer.removeChildren() // reset
    this.paperPiecesContainer.visible = true

    this.popperSprite.visible = false
    this.popperPullSprite.visible = true

    this.bangEffect()

    const pieceNum = 20
    const pieces = []
    for (let i = 0; i < pieceNum; i++) {
      const piece = new PaperPiece()
      piece.name = `piece${i}`
      pieces.push(piece)
    }
    this.paperPiecesContainer.addChild(...pieces)
    this.paperPiecesContainer.filters = [new GlowFilter({ innerStrength: 0, outerStrength: 2, color: 0xc2fbff, alpha: 0.7 })]

    const promises = pieces.map(async (piece) => {
      await piece.reachTop()
        .then(async () => { await piece.fall() })
    })
    await Promise.all(promises)
  }

  private async bangEffect () {
    const ticker = new PIXI.Ticker()
    const panDeleteWaitFrame = 30
    let frame = 0
    await new Promise<void>((resolve) => {
      const panSprite = PIXI.Sprite.from('pan')
      panSprite.scale.set(0.3)
      panSprite.y = 150
      panSprite.x = -50
      this.addChild(panSprite)
      ticker.add(() => {
        frame += 1
        if (frame >= panDeleteWaitFrame) {
          panSprite.alpha -= 0.08
          if (panSprite.alpha <= 0) {
            resolve()
            ticker.destroy()
          }
        }
      })
      ticker.start()
    })
  }

  walk () {
    this.isWalking = true
    this.children.forEach((child) => {
      child.visible = false
    })
    this.walkSprite.visible = true
    this.paperPiecesContainer.visible = true
  }

  stop () {
    this.isWalking = false
    this.children.forEach((child) => {
      child.visible = false
    })
    this.baseSprite.visible = true
  }

  async walkTo (stopPointX: number): Promise<void> {
    this.walk()
    const ticker = new PIXI.Ticker()
    await new Promise<void>((resolve) => {
      ticker.add(() => {
        if (this.x < stopPointX) {
          this.stop()
          ticker.destroy()
          resolve()
        }
      })
      ticker.start()
    })
  }
}

class PaperPiece extends PIXI.Graphics {
  reachPointX: number = -300 + Common.randomNumber(0, 200)
  reachPointY: number = 20 + Common.randomNumber(0, 100)
  fallPointX: number = this.reachPointX + Common.randomNumber(-200, 0)
  fallPointY: number = 820 + Common.randomNumber(0, 100)
  size: number = Common.randomNumber(15, 40)
  isTriangle: boolean = Common.randomTrueOrFalse(30)

  constructor () {
    super()
    if (this.isTriangle) {
      this.beginFill(0xffffff)
      this.moveTo(0, 0)
      this.lineTo(this.size, 0)
      this.lineTo(this.size / 2, this.size)
      this.endFill()
    } else {
      this.beginFill(0xffffff)
      this.drawRect(0, 0, this.size, this.size)
      this.endFill()
    }
    this.visible = true
    this.tint = PaperPiece.randomColor()
    this.x = 100
    this.y = 350
    this.pivot.x = this.size / 2
    this.pivot.y = this.size / 2
    this.angle = Common.randomNumber(0, 360)
  }

  static randomColor (): number {
    //　red yellow orange pink rightgreen purple white skyblue aqua
    const colorChoices = [0xff0000, 0xffff00, 0xffa500, 0xffc0cb, 0x00ff7f, 0x800080, 0xffffff, 0x87ceeb, 0x00ffff]
    return colorChoices[Common.randomNumber(0, colorChoices.length - 1)]
  }

  async reachTop (): Promise<void> {
    const ticker = new PIXI.Ticker()
    await new Promise<void>((resolve) => {
      ticker.add(() => {
        this.x += (this.reachPointX - this.x) / 10
        this.y += (this.reachPointY - this.y) / 10
        this.angle += 5
        if (Math.round(this.x) <= this.reachPointX) {
          this.x = Math.ceil(this.x)
          ticker.destroy()
          resolve()
        }
      })
      ticker.start()
    })
  }

  async fall (): Promise<void> {
    const ticker = new PIXI.Ticker()
    const scaleMultiplier = Common.randomNumber(100, 200) / 100
    const anglePlus = Common.randomNumber(200, 500) / 100
    const isScaleChange = Common.randomTrueOrFalse(50)

    await new Promise<void>((resolve) => {
      let frame = 0
      ticker.add(() => {
        frame += 1
        if (this.y >= this.fallPointY) {
          this.x = Math.round(this.x)
          resolve()
        } else {
          this.x += (this.fallPointX - this.reachPointX) / 100
          this.y += 6
          this.angle += anglePlus
        }

        if (isScaleChange) {
          this.scale.x = Math.cos(Common.deg2rad(frame * scaleMultiplier))
        }

        if (this.y >= this.fallPointY - 100) {
          this.alpha -= 0.02
        }
        if (this.alpha <= 0) {
          ticker.destroy()
        }
      })
      ticker.start()
    })
  }
}
