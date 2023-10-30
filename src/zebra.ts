import * as PIXI from 'pixi.js'

export class Zebra extends PIXI.Container {
  app: PIXI.Application
  private readonly baseSprite!: PIXI.Sprite
  private walkSprite!: PIXI.AnimatedSprite
  private readonly smileSprite!: PIXI.Sprite
  private popperSprite!: PIXI.AnimatedSprite
  isWalking: boolean = false

  constructor (app: PIXI.Application, scale: number = 0.5) {
    super()
    this.app = app
    this.scale.set(scale)
    // base
    const standTexture = PIXI.Texture.from('zebra')
    this.baseSprite = new PIXI.Sprite(standTexture)
    this.baseSprite.name = 'zebraBase'

    // shadow
    const shadowGraphics = new PIXI.Graphics()
    shadowGraphics.beginFill(0x000000, 0.15)
    shadowGraphics.drawEllipse(0, 0, 150, 20)
    shadowGraphics.endFill()
    shadowGraphics.x = 300
    shadowGraphics.y = this.baseSprite.height - 30
    this.baseSprite.addChildAt(shadowGraphics, 0)
    this.addChild(this.baseSprite)

    // animationSprites
    this.setWlakSprite()
    this.setPopperSprite()

    // smile
    this.smileSprite = PIXI.Sprite.from('zebraSmile')
    this.smileSprite.name = 'smile'
    this.smileSprite.visible = false
    this.addChild(this.smileSprite)

    // position
    this.x = this.app.renderer.width - this.width
    this.y = this.app.renderer.height - 410

    // animation loop
    this.app.ticker.add(() => {
      if (this.isWalking) {
        this.x += -6 * scale
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
    this.addChild(this.popperSprite)

    // shadow
    const shadowGraphics = new PIXI.Graphics()
    shadowGraphics.beginFill(0x000000, 0.15)
    shadowGraphics.drawEllipse(0, 0, 150, 20)
    shadowGraphics.endFill()
    shadowGraphics.x = 300
    shadowGraphics.y = this.baseSprite.height - 30
    this.popperSprite.addChildAt(shadowGraphics, 0)
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
    this.walkSprite.play()
    this.addChild(this.walkSprite)
  }

  smile () {
    this.smileSprite.visible = !this.smileSprite.visible
    if (this.isWalking) {
      this.smileSprite.visible = false
    }
  }

  popper () {
    this.stop()
    this.isWalking = false
    this.children.forEach((child) => {
      child.visible = false
    })
    this.popperSprite.visible = true
    this.popperSprite.gotoAndPlay(0)
  }

  walk () {
    this.isWalking = true
    this.children.forEach((child) => {
      child.visible = false
    })
    this.walkSprite.visible = true
  }

  stop () {
    this.isWalking = false
    this.children.forEach((child) => {
      child.visible = false
    })
    this.baseSprite.visible = true
  }
}
