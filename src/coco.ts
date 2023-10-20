import * as PIXI from 'pixi.js'
import { AnimatedSprite, Texture } from 'pixi.js'

export class Coco extends PIXI.Container {
  app: PIXI.Application
  isWalking: boolean = false
  isRunning: boolean = false
  private readonly baseSprite!: PIXI.Sprite
  private walkSprite!: AnimatedSprite
  private runSprite!: AnimatedSprite
  private downSprite!: AnimatedSprite
  private turnLeftSprite!: AnimatedSprite

  constructor (app: PIXI.Application) {
    super()
    this.app = app
    this.scale.set(0.5)

    // basesprite
    const standTexture = PIXI.Texture.from('cocoStand')
    const baseSprite = new PIXI.Sprite(standTexture)
    baseSprite.name = 'cocoBase'
    this.addChild(baseSprite)
    this.baseSprite = baseSprite

    this.x = this.app.renderer.width - this.width
    this.y = this.app.renderer.height - this.height

    // animated sprites
    this.setWalkSprite()
    this.setRunSprite()
    this.setDownSprite()
    this.setTurnLeftSprite()

    // animation loop
    this.app.ticker.add(() => {
      if (this.isWalking) {
        this.x += -3
      } else if (this.isRunning) {
        this.x += -8
      }
      if (this.x < 0 - this.width) {
        this.x = this.app.renderer.width
      }
    })
  }

  private setWalkSprite () {
    const walkSrcs = [
      'cocoWalk1',
      'cocoWalk2',
      'cocoWalk3',
      'cocoWalk4',
      'cocoWalk5',
      'cocoWalk6',
      'cocoWalk7',
      'cocoWalk8'
    ]
    const walkTextures: Texture[] = []

    walkSrcs.forEach((imagePath) => {
      const texture = Texture.from(imagePath)
      walkTextures.push(texture)
    })

    this.walkSprite = new AnimatedSprite(walkTextures)
    this.walkSprite.visible = false
    this.walkSprite.animationSpeed = 0.1
    this.walkSprite.play()
    this.walkSprite.name = 'cocoWalk'
    this.addChild(this.walkSprite)
  }

  private setRunSprite () {
    const runSrcs = [
      'cocoRun1',
      'cocoRun2',
      'cocoRun3',
      'cocoRun4',
      'cocoRun5',
      'cocoRun6',
      'cocoRun7',
      'cocoRun8'
    ]
    const runTextures: Texture[] = []
    runSrcs.forEach((imagePath) => {
      const texture = Texture.from(imagePath)
      runTextures.push(texture)
    })
    this.runSprite = new AnimatedSprite(runTextures)
    this.runSprite.visible = false
    this.runSprite.animationSpeed = 0.18
    this.runSprite.play()
    this.runSprite.name = 'cocoRun'
    this.addChild(this.runSprite)
  }

  private setDownSprite () {
    // downsprite
    const srcDowns = [
      'cocoDown1',
      'cocoDown2',
      'cocoDown3',
      'cocoDown4',
      'cocoDown5'
    ]
    const downTextures: Texture[] = []
    srcDowns.forEach((imagePath) => {
      const texture = Texture.from(imagePath)
      downTextures.push(texture)
    })
    this.downSprite = new AnimatedSprite(downTextures)
    this.downSprite.animationSpeed = 0.15
    this.downSprite.name = 'cocoDown'
    this.downSprite.loop = false
    this.downSprite.visible = false
    this.addChild(this.downSprite)
  }

  private setTurnLeftSprite () {
    const srcTurnLefts = [
      'cocoTurnLeft1',
      'cocoTurnLeft2',
      'cocoTurnLeft3',
      'cocoTurnLeft4',
      'cocoTurnLeft5',
      'cocoTurnLeft6',
      'cocoTurnLeft7'
    ]
    const turnLeftTextures: Texture[] = []
    srcTurnLefts.forEach((imagePath) => {
      const texture = Texture.from(imagePath)
      turnLeftTextures.push(texture)
    })
    this.turnLeftSprite = new AnimatedSprite(turnLeftTextures)
    this.turnLeftSprite.animationSpeed = 0.2
    this.turnLeftSprite.name = 'cocoTurnLeft'
    this.turnLeftSprite.loop = false
    this.turnLeftSprite.visible = false
    this.addChild(this.turnLeftSprite)
  }

  walk () {
    console.log('walk')
    this.isWalking = true
    this.isRunning = false
    this.baseSprite.visible = false
    this.walkSprite.visible = true
    this.runSprite.visible = false
    this.downSprite.visible = false
    this.turnLeftSprite.visible = false
  }

  run () {
    console.log('run')
    this.isWalking = false
    this.isRunning = true
    this.baseSprite.visible = false
    this.walkSprite.visible = false
    this.runSprite.visible = true
    this.downSprite.visible = false
    this.turnLeftSprite.visible = false
  }

  stop () {
    console.log('stop')
    this.isWalking = false
    this.isRunning = false
    this.baseSprite.visible = true
    this.walkSprite.visible = false
    this.runSprite.visible = false
    this.downSprite.visible = false
    this.turnLeftSprite.visible = false
  }

  down () {
    console.log('down')
    this.isWalking = false
    this.isRunning = false
    this.baseSprite.visible = false
    this.walkSprite.visible = false
    this.runSprite.visible = false
    this.downSprite.visible = true
    this.turnLeftSprite.visible = false
    this.downSprite.gotoAndPlay(0)
  }

  turn (fromLeft: boolean): void {
    console.log('turn')
    this.isWalking = false
    this.isRunning = false
    this.baseSprite.visible = false
    this.walkSprite.visible = false
    this.runSprite.visible = false
    this.downSprite.visible = false
    this.turnLeftSprite.visible = true
    this.turnLeftSprite.gotoAndPlay(0)
  }
}
