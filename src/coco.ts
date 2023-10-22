import * as PIXI from 'pixi.js'
import { AnimatedSprite, Texture } from 'pixi.js'

export class Coco extends PIXI.Container {
  app: PIXI.Application
  isWalking: boolean = false
  isRunning: boolean = false
  orirentation: 'left' | 'right' = 'left'
  private readonly baseSprite!: PIXI.Sprite
  private walkSprite!: AnimatedSprite
  private runSprite!: AnimatedSprite
  private downSprite!: AnimatedSprite
  private turnLeftSprite!: AnimatedSprite
  private reverseWalkPatchSprite!: PIXI.Sprite
  private reverseTurnPatchSprite!: AnimatedSprite
  private reverseRunPatchSprite!: AnimatedSprite
  private reverseDownPatchSprite!: AnimatedSprite
  private eyeCloseSprite!: AnimatedSprite
  private eyeBlinkSprite!: AnimatedSprite
  private downSmileSprite!: AnimatedSprite
  private readonly turnMargin = 50

  constructor (app: PIXI.Application, scale: number = 0.5) {
    super()
    this.app = app
    this.scale.set(scale)

    // basesprite
    const standTexture = PIXI.Texture.from('cocoStand')
    const baseSprite = new PIXI.Sprite(standTexture)
    baseSprite.name = 'cocoBase'
    this.addChild(baseSprite)
    this.baseSprite = baseSprite

    // initial position
    this.x = this.app.renderer.width / 2
    this.y = this.app.renderer.height - this.height * 1.1

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
    const turnReverseTextures: Texture[] = []
    srcTurnReverse.forEach((imagePath) => {
      const texture = Texture.from(imagePath)
      turnReverseTextures.push(texture)
    })
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
    const runReverseTextures: Texture[] = []
    srcRunReverse.forEach((imagePath) => {
      const texture = Texture.from(imagePath)
      runReverseTextures.push(texture)
    })
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
    const downReverseTextures: Texture[] = []
    srcDownReverse.forEach((imagePath) => {
      const texture = Texture.from(imagePath)
      downReverseTextures.push(texture)
    })
    const downReverseSprite = new AnimatedSprite(downReverseTextures)
    downReverseSprite.animationSpeed = 0.15
    downReverseSprite.name = 'downReverse'
    downReverseSprite.loop = false
    downReverseSprite.visible = false
    this.addChild(downReverseSprite)
    this.reverseDownPatchSprite = downReverseSprite

    // eye close animation
    const srcEyeClose = ['cocoEyeOpen', 'cocoEyeHalf', 'cocoEyeClose']
    const eyeCloseTextures: Texture[] = []
    srcEyeClose.forEach((imagePath) => {
      const texture = Texture.from(imagePath)
      eyeCloseTextures.push(texture)
    })
    const eyeCloseSprite = new AnimatedSprite(eyeCloseTextures)
    eyeCloseSprite.animationSpeed = 0.1
    eyeCloseSprite.name = 'eyeClose'
    eyeCloseSprite.loop = false
    eyeCloseSprite.visible = false
    this.eyeCloseSprite = eyeCloseSprite
    this.addChild(eyeCloseSprite)

    // eye blink animation
    const srcEyeBlink = ['cocoEyeOpen', 'cocoEyeHalf', 'cocoEyeClose', 'cocoEyeHalf', 'cocoEyeOpen']
    const eyeBlinkTextures: Texture[] = []
    srcEyeBlink.forEach((imagePath) => {
      const texture = Texture.from(imagePath)
      eyeBlinkTextures.push(texture)
    })
    const eyeBlinkSprite = new AnimatedSprite(eyeBlinkTextures)
    eyeBlinkSprite.animationSpeed = 0.3
    eyeBlinkSprite.name = 'eyeBlink'
    eyeBlinkSprite.loop = false
    eyeBlinkSprite.visible = false
    this.addChild(eyeBlinkSprite)
    this.eyeBlinkSprite = eyeBlinkSprite

    // down smile animation
    const srcDownSmile = ['cocoDownSmile1', 'cocoDownSmile2', 'cocoDownSmile3']
    const downSmileTextures: Texture[] = []
    srcDownSmile.forEach((imagePath) => {
      const texture = Texture.from(imagePath)
      downSmileTextures.push(texture)
    })
    const downSmileSprite = new AnimatedSprite(downSmileTextures)
    downSmileSprite.animationSpeed = 0.3
    downSmileSprite.name = 'downSmile'
    downSmileSprite.loop = false
    downSmileSprite.visible = false
    this.addChild(downSmileSprite)
    this.downSmileSprite = downSmileSprite
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
}
