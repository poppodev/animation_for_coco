import * as PIXI from 'pixi.js'
import * as Common from './common'
import { Coco } from './coco'
import { Komatsu } from './komatsu'
import { Toriko } from './toriko'
import { Sunny } from './sunny'
import { Queen } from './queen'
import { Zebra } from './zebra'

const app = new PIXI.Application({
  width: 1200,
  height: 600,
  backgroundColor: 0xFFFFFF,
  antialias: true
})

window.addEventListener('load', () => {
  console.log('loadbefore')
  PIXI.Assets.load(Common.imageSrcs)
    .then(setUp)
})

async function setUp () {
  console.log('startSetup')
  const appView = app.view as HTMLCanvasElement | null
  if (appView) {
    document.getElementById('mainCanvas')!.appendChild(appView)
  }

  document.getElementById('loading')!.style.display = 'none'

  // background
  const background = new PIXI.Sprite(PIXI.Texture.from('background'))
  background.anchor.set(0.5, 1)
  background.alpha = 0.9
  background.x = app.renderer.width / 2
  background.y = app.renderer.height + 150
  app.stage.addChild(background)

  // clouds
  const clouds = new PIXI.Sprite(PIXI.Texture.from('clouds'))
  const clouds2 = new PIXI.Sprite(PIXI.Texture.from('clouds'))
  clouds.y = app.renderer.height / 10
  clouds2.y = app.renderer.height / 10
  clouds2.x = clouds.width
  app.stage.addChild(clouds)
  app.stage.addChild(clouds2)
  app.ticker.add(() => {
    clouds.x -= 0.1
    clouds2.x -= 0.1
    if (clouds.x < -clouds.width) {
      clouds.x = app.renderer.width
    }
    if (clouds2.x < -clouds2.width) {
      clouds2.x = app.renderer.width
    }
  })

  // characters
  const coco = new Coco(app, 0.4)
  const komatsu = new Komatsu(app, 0.4)
  const toriko = new Toriko(app, 0.4)
  const queen = new Queen(app, 0.4)
  const sunny = new Sunny(app, 0.4)
  queen.addChild(sunny)
  const zebra = new Zebra(app, 0.4)

  // triggers
  document.getElementById('coco')!.addEventListener('click', function () {
    if (!app.stage.children.includes(coco)) {
      app.stage.addChild(coco)
    } else {
      coco.stop()
      coco.visible = !coco.visible
    }
  })
  document.getElementById('walkCoco')!.addEventListener('click', function () {
    if (app.stage.children.includes(coco)) {
      if (!coco.isWalking) {
        coco.walk()
      } else {
        coco.stop()
      }
    }
  })

  document.getElementById('runCoco')!.addEventListener('click', function () {
    if (app.stage.children.includes(coco)) {
      if (coco.isRunning) {
        coco.stop()
      } else {
        coco.run()
      }
    }
  })
  document.getElementById('downCoco')!.addEventListener('click', function () {
    if (app.stage.children.includes(coco)) {
      coco.down()
    }
  })
  document.getElementById('turnCoco')!.addEventListener('click', function () {
    if (app.stage.children.includes(coco)) {
      coco.turn()
    }
  })
  document.getElementById('smileCoco')!.addEventListener('click', function () {
    if (app.stage.children.includes(coco)) {
      coco.smile()
    }
  })

  // trigers for komatsu
  document.getElementById('komatsu')!.addEventListener('click', function () {
    if (!app.stage.children.includes(komatsu)) {
      app.stage.addChild(komatsu)
    } else {
      komatsu.stop()
      komatsu.visible = !komatsu.visible
    }
  })

  document.getElementById('walkKomatsu')!.addEventListener('click', function () {
    if (app.stage.children.includes(komatsu)) {
      if (komatsu.isWalking) {
        komatsu.stop()
      } else {
        komatsu.walk()
      }
    }
  })
  document.getElementById('smileKomatsu')!.addEventListener('click', function () {
    if (app.stage.children.includes(komatsu)) {
      komatsu.smile()
    }
  })

  // trigers for toriko
  document.getElementById('toriko')!.addEventListener('click', function () {
    if (!app.stage.children.includes(toriko)) {
      app.stage.addChild(toriko)
    } else {
      toriko.stop()
      toriko.visible = !toriko.visible
    }
  })
  document.getElementById('smileToriko')!.addEventListener('click', function () {
    if (app.stage.children.includes(toriko)) {
      toriko.smile()
    }
  })
  document.getElementById('presentToriko')!.addEventListener('click', function () {
    if (app.stage.children.includes(toriko)) {
      toriko.givePresent()
    }
  })
  document.getElementById('walkToriko')!.addEventListener('click', function () {
    if (app.stage.children.includes(toriko)) {
      if (toriko.isWalking) {
        toriko.stop()
      } else {
        toriko.walk()
      }
    }
  })

  // trigers for sunny
  document.getElementById('sunny')!.addEventListener('click', function () {
    if (!app.stage.children.includes(queen)) {
      app.stage.addChild(queen)
      queen.appear()
    } else {
      if (queen.visible) {
        queen.getOut()
      } else {
        queen.appear()
      }
    }
  })
  document.getElementById('smileSunny')!.addEventListener('click', function () {
    if (app.stage.children.includes(queen)) {
      sunny.smile()
    }
  })
  document.getElementById('presentSunny')!.addEventListener('click', function () {
    if (app.stage.children.includes(queen)) {
      sunny.givePresent()
    }
  })

  // trigers for zebra
  document.getElementById('zebra')!.addEventListener('click', function () {
    if (!app.stage.children.includes(zebra)) {
      app.stage.addChild(zebra)
    } else {
      zebra.visible = !zebra.visible
    }
  })
  document.getElementById('smileZebra')!.addEventListener('click', function () {
    if (app.stage.children.includes(zebra)) {
      zebra.smile()
    }
  })
  document.getElementById('popperZebra')!.addEventListener('click', function () {
    if (app.stage.children.includes(zebra)) {
      zebra.popper()
    }
  })
  document.getElementById('walkZebra')!.addEventListener('click', function () {
    if (app.stage.children.includes(zebra)) {
      if (zebra.isWalking) {
        zebra.stop()
      } else {
        zebra.walk()
      }
    }
  })
}
