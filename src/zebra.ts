import * as PIXI from 'pixi.js'

export class Zebra extends PIXI.Container {
  app: PIXI.Application
  private readonly baseSprite!: PIXI.Sprite

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
    shadowGraphics.y = this.baseSprite.height - 10
    this.baseSprite.addChildAt(shadowGraphics, 0)
    this.addChild(this.baseSprite)

    this.setWlakSprite()

    // position
    this.x = this.app.renderer.width - this.width
    this.y = this.app.renderer.height - this.height 
  }

  private setWlakSprite () {
    // TODO walk
  }

  smile () {
    let smileSprite = this.getChildByName('smile')
    if (smileSprite === null) {
      smileSprite = PIXI.Sprite.from('zebraSmile')
      smileSprite.name = 'smile'
      smileSprite.visible = false
      this.addChild(smileSprite)
    }
    smileSprite.visible = !smileSprite.visible
  }
}
