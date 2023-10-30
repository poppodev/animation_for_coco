import * as PIXI from 'pixi.js'
import { AnimatedSprite } from 'pixi.js'

export class Coco extends PIXI.Container {
  app: PIXI.Application
  isWalking: boolean = false
  isRunning: boolean = false
  orirentation: 'left' | 'right' = 'left'
  private readonly baseSprite!: PIXI.Sprite
  private reverseWalkPatchSprite!: PIXI.Sprite
  private faceUpSprite!: PIXI.Sprite
  private reverseFaceUpSprite!: PIXI.Sprite
  private surpriseSprite!: PIXI.Sprite
  private walkSprite!: AnimatedSprite
  private runSprite!: AnimatedSprite
  private downSprite!: AnimatedSprite
  private turnLeftSprite!: AnimatedSprite
  private reverseTurnPatchSprite!: AnimatedSprite
  private reverseRunPatchSprite!: AnimatedSprite
  private reverseDownPatchSprite!: AnimatedSprite
  private eyeCloseSprite!: AnimatedSprite
  private eyeBlinkSprite!: AnimatedSprite
  private downSmileSprite!: AnimatedSprite
  private removeCoverSprite!: PIXI.AnimatedSprite
  private readonly turnMargin = 50

  constructor (app: PIXI.Application, scale: number = 0.5) {
    super()
    this.app = app
    this.scale.set(scale)

    // basesprite
    const standTexture = PIXI.Texture.from('cocoStand')
    const baseSprite = new PIXI.Sprite(standTexture)
    baseSprite.name = 'cocoBase'

    // shadow
    const shadowGraphics = new PIXI.Graphics()
    shadowGraphics.beginFill(0x000000, 0.15)
    shadowGraphics.drawEllipse(0, 0, 100, 20)
    shadowGraphics.endFill()
    shadowGraphics.x = baseSprite.width / 2
    shadowGraphics.y = baseSprite.height - 30
    baseSprite.addChildAt(shadowGraphics, 0)
    this.addChild(baseSprite)
    this.baseSprite = baseSprite

    this.faceUpSprite = PIXI.Sprite.from('cocoFaceUp')

    // initial position
    this.x = this.app.renderer.width / 2
    this.y = this.app.renderer.height - 350

    // animated sprites
    this.setWalkSprite()
    this.setRunSprite()
    this.setDownSprite()
    this.setTurnLeftSprite()

    // parts sprites
    this.setPatchSprites()

    // animation loop
    this.app.ticker.add(() => {
      // turn
      if (this.isWalking || this.isRunning) {
        if (this.orirentation === 'left') {
          if (this.x + this.width * scale < 0 + this.turnMargin * scale) {
            console.log('reach left end')
            this.turn()
          }
        } else {
          if (this.x + this.width * scale > this.app.renderer.width - this.turnMargin * scale) {
            console.log('reach right end')
            this.turn()
          }
        }
      }

      // walk or run
      const direction = this.orirentation === 'left' ? 1 : -1
      if (this.isWalking) {
        this.x += -6 * scale * direction
      } else if (this.isRunning) {
        this.x += -15 * scale * direction
      }

      // blink
      const random = Math.random()
      if (random > 0.995 && !this.eyeCloseSprite.visible) {
        this.blink()
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
    const walkTextures = walkSrcs.map(src => PIXI.Texture.from(src))

    this.walkSprite = new AnimatedSprite(walkTextures)
    this.walkSprite.visible = false
    this.walkSprite.animationSpeed = 0.1
    this.walkSprite.play()
    this.walkSprite.name = 'cocoWalk'

    // shadow
    const shadowGraphics = new PIXI.Graphics()
    shadowGraphics.beginFill(0x000000, 0.15)
    shadowGraphics.drawEllipse(0, 0, 170, 20)
    shadowGraphics.endFill()
    shadowGraphics.x = this.baseSprite.width / 2 + 20
    shadowGraphics.y = this.baseSprite.height - 30
    this.walkSprite.addChildAt(shadowGraphics, 0)

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
    const runTextures = runSrcs.map(src => PIXI.Texture.from(src))
    this.runSprite = new AnimatedSprite(runTextures)
    this.runSprite.visible = false
    this.runSprite.animationSpeed = 0.18
    this.runSprite.play()
    this.runSprite.name = 'cocoRun'
    const shadowGraphics = new PIXI.Graphics()
    shadowGraphics.beginFill(0x000000, 0.15)
    shadowGraphics.drawEllipse(0, 0, 220, 20)
    shadowGraphics.endFill()
    shadowGraphics.x = this.baseSprite.width / 2 + 20
    shadowGraphics.y = this.baseSprite.height - 30
    this.runSprite.addChildAt(shadowGraphics, 0)
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
    const downTextures = srcDowns.map(src => PIXI.Texture.from(src))
    this.downSprite = new AnimatedSprite(downTextures)
    this.downSprite.animationSpeed = 0.15
    this.downSprite.name = 'cocoDown'
    this.downSprite.loop = false
    this.downSprite.visible = false

    const shadowGraphics = new PIXI.Graphics()
    shadowGraphics.beginFill(0x000000, 0.15)
    shadowGraphics.drawEllipse(0, 0, 200, 20)
    shadowGraphics.endFill()
    shadowGraphics.x = this.baseSprite.width / 2
    shadowGraphics.y = this.baseSprite.height - 30
    this.downSprite.addChildAt(shadowGraphics, 0)

    this.addChild(this.downSprite)

    const removeCoverSrcs = ['cocoRemoveCakeCover1', 'cocoRemoveCakeCover2', 'cocoRemoveCakeCover3', 'cocoRemoveCakeCover4']
    this.removeCoverSprite = new AnimatedSprite(removeCoverSrcs.map(src => PIXI.Texture.from(src)))
    this.removeCoverSprite.animationSpeed = 0.1
    this.removeCoverSprite.loop = false
    this.removeCoverSprite.visible = false
    this.addChild(this.removeCoverSprite)
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
    const turnLeftTextures = srcTurnLefts.map(src => PIXI.Texture.from(src))
    this.turnLeftSprite = new AnimatedSprite(turnLeftTextures)
    this.turnLeftSprite.animationSpeed = 0.2
    this.turnLeftSprite.name = 'cocoTurnLeft'
    this.turnLeftSprite.loop = false
    this.turnLeftSprite.visible = false

    const shadowGraphics = new PIXI.Graphics()
    shadowGraphics.beginFill(0x000000, 0.15)
    shadowGraphics.drawEllipse(0, 0, 200, 20)
    shadowGraphics.endFill()
    shadowGraphics.x = this.baseSprite.width / 2
    shadowGraphics.y = this.baseSprite.height - 30
    this.turnLeftSprite.addChildAt(shadowGraphics, 0)

    this.addChild(this.turnLeftSprite)
  }

  private setPatchSprites () {
    // walk reverse patch
    const reverseTexture = PIXI.Texture.from('cocoWalkReversePatch')
    const reverseSprite = new PIXI.Sprite(reverseTexture)
    reverseSprite.name = 'walkReversePatch'
    this.addChild(reverseSprite)
    this.reverseWalkPatchSprite = reverseSprite
    this.reverseWalkPatchSprite.visible = false

    // turn reverse animation
    const srcTurnReverse = [
      'cocoTurnReverse1',
      'cocoTurnReverse2',
      'cocoTurnReverse3',
      'cocoTurnReverse4',
      'cocoTurnReverse5',
      'cocoTurnReverse6',
      'cocoTurnReverse7'
    ]
    const turnReverseTextures = srcTurnReverse.map(src => PIXI.Texture.from(src))
    const turnReverseSprite = new AnimatedSprite(turnReverseTextures)
    turnReverseSprite.animationSpeed = 0.2
    turnReverseSprite.name = 'turnReverse'
    turnReverseSprite.loop = false
    turnReverseSprite.visible = false
    this.addChild(turnReverseSprite)
    this.reverseTurnPatchSprite = turnReverseSprite

    // run reverse animation
    const srcRunReverse = [
      'cocoRunReverse1',
      'cocoRunReverse2',
      'cocoRunReverse3',
      'cocoRunReverse4',
      'cocoRunReverse5',
      'cocoRunReverse6',
      'cocoRunReverse7',
      'cocoRunReverse8'
    ]
    const runReverseTextures = srcRunReverse.map(src => PIXI.Texture.from(src))
    const runReverseSprite = new AnimatedSprite(runReverseTextures)
    runReverseSprite.animationSpeed = 0.18
    runReverseSprite.name = 'runReverse'
    runReverseSprite.visible = false
    this.addChild(runReverseSprite)
    this.reverseRunPatchSprite = runReverseSprite

    // down reverse animation
    const srcDownReverse = [
      'cocoDownReverse1',
      'cocoDownReverse2',
      'cocoDownReverse3',
      'cocoDownReverse4',
      'cocoDownReverse5'
    ]
    const downReverseTextures = srcDownReverse.map(src => PIXI.Texture.from(src))
    const downReverseSprite = new AnimatedSprite(downReverseTextures)
    downReverseSprite.animationSpeed = 0.15
    downReverseSprite.name = 'downReverse'
    downReverseSprite.loop = false
    downReverseSprite.visible = false
    this.addChild(downReverseSprite)
    this.reverseDownPatchSprite = downReverseSprite

    // eye close animation
    const srcEyeClose = ['cocoEyeOpen', 'cocoEyeHalf', 'cocoEyeClose']
    const eyeCloseTextures = srcEyeClose.map(src => PIXI.Texture.from(src))
    const eyeCloseSprite = new AnimatedSprite(eyeCloseTextures)
    eyeCloseSprite.animationSpeed = 0.1
    eyeCloseSprite.name = 'eyeClose'
    eyeCloseSprite.loop = false
    eyeCloseSprite.visible = false
    this.eyeCloseSprite = eyeCloseSprite
    this.addChild(eyeCloseSprite)

    // eye blink animation
    const srcEyeBlink = ['cocoEyeOpen', 'cocoEyeHalf', 'cocoEyeClose', 'cocoEyeHalf', 'cocoEyeOpen']
    const eyeBlinkTextures = srcEyeBlink.map(src => PIXI.Texture.from(src))
    const eyeBlinkSprite = new AnimatedSprite(eyeBlinkTextures)
    eyeBlinkSprite.animationSpeed = 0.3
    eyeBlinkSprite.name = 'eyeBlink'
    eyeBlinkSprite.loop = false
    eyeBlinkSprite.visible = false
    this.addChild(eyeBlinkSprite)
    this.eyeBlinkSprite = eyeBlinkSprite

    // down smile animation
    const srcDownSmile = ['cocoDownSmile1', 'cocoDownSmile2', 'cocoDownSmile3']
    const downSmileTextures = srcDownSmile.map(src => PIXI.Texture.from(src))
    const downSmileSprite = new AnimatedSprite(downSmileTextures)
    downSmileSprite.animationSpeed = 0.3
    downSmileSprite.name = 'downSmile'
    downSmileSprite.loop = false
    downSmileSprite.visible = false
    this.addChild(downSmileSprite)
    this.downSmileSprite = downSmileSprite

    // face up sprite
    this.faceUpSprite = PIXI.Sprite.from('cocoFaceUp')
    this.faceUpSprite.visible = false
    this.addChild(this.faceUpSprite)
    this.reverseFaceUpSprite = PIXI.Sprite.from('cocoFaceUpReverse')
    this.reverseFaceUpSprite.visible = false
    this.addChild(this.reverseFaceUpSprite)

    // surprise sprite
    this.surpriseSprite = PIXI.Sprite.from('cocoEyeSurprised')
    this.surpriseSprite.visible = false
    const surpriseMouse = new PIXI.Sprite(PIXI.Texture.from('cocoMouseSurprised'))
    this.surpriseSprite.addChild(surpriseMouse)
    this.addChild(this.surpriseSprite)
  }

  walk () {
    console.log('walk')
    this.isWalking = true
    this.isRunning = false
    this.children.forEach((child) => {
      child.visible = false
    })
    this.walkSprite.gotoAndPlay(0)
    this.walkSprite.visible = true
    this.eyeBlinkSprite.visible = true
    this.reverseWalkPatchSprite.visible = this.orirentation === 'right'
  }

  run () {
    console.log('run')
    this.isWalking = false
    this.isRunning = true
    this.children.forEach((child) => {
      child.visible = false
    })
    this.runSprite.visible = true
    this.runSprite.gotoAndPlay(0)
    this.reverseRunPatchSprite.gotoAndPlay(0)
    this.reverseRunPatchSprite.visible = this.orirentation === 'right'
  }

  stop () {
    console.log('stop')
    this.isWalking = false
    this.isRunning = false
    this.children.forEach((child) => {
      child.visible = false
    })
    this.reverseWalkPatchSprite.visible = this.orirentation === 'right'
    this.baseSprite.visible = true
  }

  down () {
    console.log('down')
    this.isWalking = false
    this.isRunning = false
    this.children.forEach((child) => {
      child.visible = false
    })
    if (this.orirentation === 'right') {
      this.reverseDownPatchSprite.visible = true
    }
    this.downSprite.visible = true
    this.downSprite.gotoAndPlay(0)
    this.reverseDownPatchSprite.gotoAndPlay(0)
  }

  turn () {
    const originallyRunning = this.isRunning
    const originallyWalking = this.isWalking
    this.isWalking = false
    this.isRunning = false
    this.children.forEach((child) => {
      child.visible = false
    })

    this.turnLeftSprite.visible = true
    this.turnLeftSprite.gotoAndPlay(0)
    if (this.orirentation === 'right') {
      this.reverseTurnPatchSprite.visible = true
      this.reverseTurnPatchSprite.gotoAndPlay(0)
    }
    this.turnLeftSprite.onComplete = () => {
      this.reverseTurnPatchSprite.visible = false
      this.orirentation = this.orirentation === 'right' ? 'left' : 'right'
      this.turnLeftSprite.visible = false
      this.baseSprite.visible = true
      this.reverseWalkPatchSprite.visible = (this.orirentation === 'right')

      this.scale.x *= -1
      this.x -= this.width
      if (originallyRunning) {
        this.reverseRunPatchSprite.visible = this.orirentation === 'right'
        this.run()
      }
      if (originallyWalking) {
        this.reverseWalkPatchSprite.visible = this.orirentation === 'right'
        this.walk()
      }
      console.log(this.orirentation)
    }
  }

  blink () {
    if (this.isWalking || this.baseSprite.visible) {
      this.eyeBlinkSprite.visible = true
      this.eyeBlinkSprite.gotoAndPlay(0)
      this.eyeBlinkSprite.onComplete = () => {
        this.eyeBlinkSprite.visible = false
      }
    }
  }

  smile () {
    let smileSprite = this.getChildByName('smile')
    if (smileSprite === null) {
      smileSprite = PIXI.Sprite.from('cocoEyeSmile')
      smileSprite.name = 'smile'
      this.addChild(smileSprite)
    }
    if (this.downSprite.visible) {
      smileSprite.visible = false
      this.downSmileSprite.visible = true
      this.downSmileSprite.gotoAndPlay(0)
    } else if (this.baseSprite.visible || this.walkSprite.visible) {
      smileSprite.visible = true
    }
  }

  faceUp () {
    if (this.isRunning || this.isWalking) {
      this.stop()
    }
    this.children.forEach((child) => {
      child.visible = false
    })
    this.faceUpSprite.visible = true
    this.reverseFaceUpSprite.visible = this.orirentation === 'right'
  }

  surprised () {
    if (this.isRunning) {
      this.stop()
    }
    this.surpriseSprite.visible = true
  }

  removeCover () {
    if (this.downSprite.visible || this.removeCoverSprite.visible) {
      this.removeCoverSprite.visible = true
      this.removeCoverSprite.gotoAndPlay(0)
      this.removeCoverSprite.onComplete = () => {
        this.removeCoverSprite.visible = false
        this.downSprite.visible = true
      }
    }
  }
}
