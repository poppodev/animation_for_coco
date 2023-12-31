import * as PIXI from 'pixi.js'
import * as Common from './common'
import { Coco } from './class/coco'
import { Komatsu } from './class/komatsu'
import { Toriko } from './class/toriko'
import { Sunny } from './class/sunny'
import { Queen } from './class/queen'
import { Zebra } from './class/zebra'
import './styles/index.css'

const app = new PIXI.Application({
  width: 1050,
  height: 600,
  backgroundColor: 0xFFFFFF,
  antialias: true
})

window.addEventListener('load', () => {
  PIXI.Assets.load(Common.imageSrcs)
    .then(setUp)
})

async function setUp () {
  const appView = app.view as HTMLCanvasElement | null
  if (appView) {
    document.getElementById('mainCanvas')!.appendChild(appView)
  }

  document.getElementById('loading')!.style.display = 'none'
  Common.setUp(app)

  // characters
  const coco = new Coco(app, 0.4, true)
  const komatsu = new Komatsu(app, 0.4, true)
  const toriko = new Toriko(app, 0.4, true)
  const queen = new Queen(app, 0.4, true)
  const sunny = new Sunny(app, 0.4, true)
  queen.addChild(sunny)
  const zebra = new Zebra(app, 0.4, true)

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
      komatsu.cakeEffect()
    } else {
      komatsu.stop()
      komatsu.visible = !komatsu.visible
      komatsu.cakeEffect()
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
    const stopX = 150
    const stopY = -260 * queen.baseScale
    const fromX = 0
    const fromY = -queen.baseHeight
    if (!app.stage.children.includes(queen)) {
      app.stage.addChild(queen)
      queen.appear(fromX, fromY, stopX, stopY)
    } else {
      if (queen.visible) {
        queen.getOut()
      } else {
        queen.appear(fromX, fromY, stopX, stopY)
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
  document.getElementById('popperZebra')!.addEventListener('click', async function () {
    if (app.stage.children.includes(zebra)) {
      await zebra.takePopper()
      await Common.sleep(500)
      zebra.doPopper()
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
