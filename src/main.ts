import * as PIXI from 'pixi.js'
import { Coco } from './coco'
import { Komatsu } from './komatsu'
import { Toriko } from './toriko'

const app = new PIXI.Application({
  width: 1200,
  height: 600,
  backgroundColor: 0xEEEEEE
})

window.addEventListener('load', () => {
  console.log('loadbefore')
  PIXI.Assets.load(
    [{ alias: 'background', src: './images/background_grass.jpeg' },
      { alias: 'cocoStand', src: './images/coco_walk_0008_base.png' },
      { alias: 'cocoWalk1', src: './images/coco_walk_0000_walk1.png' },
      { alias: 'cocoWalk2', src: './images/coco_walk_0001_walk2.png' },
      { alias: 'cocoWalk3', src: './images/coco_walk_0002_walk3.png' },
      { alias: 'cocoWalk4', src: './images/coco_walk_0003_walk4.png' },
      { alias: 'cocoWalk5', src: './images/coco_walk_0004_walk5.png' },
      { alias: 'cocoWalk6', src: './images/coco_walk_0005_walk6.png' },
      { alias: 'cocoWalk7', src: './images/coco_walk_0006_walk7.png' },
      { alias: 'cocoWalk8', src: './images/coco_walk_0007_walk8.png' },
      { alias: 'cocoRun1', src: './images/coco_run_0000_run1.png' },
      { alias: 'cocoRun2', src: './images/coco_run_0001_run2.png' },
      { alias: 'cocoRun3', src: './images/coco_run_0002_run3.png' },
      { alias: 'cocoRun4', src: './images/coco_run_0003_run4.png' },
      { alias: 'cocoRun5', src: './images/coco_run_0004_run5.png' },
      { alias: 'cocoRun6', src: './images/coco_run_0005_run6.png' },
      { alias: 'cocoRun7', src: './images/coco_run_0006_run7.png' },
      { alias: 'cocoRun8', src: './images/coco_run_0007_run8.png' },
      { alias: 'komatsuWalk1', src: './images/komatsu_walk_0001_walk1.png' },
	  { alias: 'komatsuWalk2', src: './images/komatsu_walk_0002_walk2.png' },
      { alias: 'komatsuWalk3', src: './images/komatsu_walk_0003_walk3.png' },
      { alias: 'komatsuWalk4', src: './images/komatsu_walk_0004_walk4.png' },
      { alias: 'komatsuWalk5', src: './images/komatsu_walk_0005_walk5.png' },
      { alias: 'komatsuWalk6', src: './images/komatsu_walk_0006_walk6.png' },
      { alias: 'komatsuWalk7', src: './images/komatsu_walk_0007_walk7.png' },
      { alias: 'komatsuWalk8', src: './images/komatsu_walk_0008_walk8.png' },
      { alias: 'komatsuStand', src: './images/komatsu_base.png' },
      { alias: 'torikoStand', src: './images/toriko_base.png' },
      { alias: 'cocoDown1', src: './images/coco_down_0001_1.png' },
      { alias: 'cocoDown2', src: './images/coco_down_0002_2.png' },
      { alias: 'cocoDown3', src: './images/coco_down_0003_3.png' },
      { alias: 'cocoDown4', src: './images/coco_down_0004_4.png' },
      { alias: 'cocoDown5', src: './images/coco_down_0005_5.png' },
      { alias: 'cocoTurnLeft1', src: './images/coco_turn_left_0001_1.png' },
      { alias: 'cocoTurnLeft2', src: './images/coco_turn_left_0002_2.png' },
      { alias: 'cocoTurnLeft3', src: './images/coco_turn_left_0003_3.png' },
      { alias: 'cocoTurnLeft4', src: './images/coco_turn_left_0004_4.png' },
      { alias: 'cocoTurnLeft5', src: './images/coco_turn_left_0005_5.png' },
      { alias: 'cocoTurnLeft6', src: './images/coco_turn_left_0006_6.png' },
      { alias: 'cocoTurnLeft7', src: './images/coco_turn_left_0007_7.png' }
    ]
  )
    .then(setUp)
})

async function setUp () {
  console.log('startSetup')
  const appView = app.view as HTMLCanvasElement | null
  if (appView) {
    document.getElementById('mainCanvas')!.appendChild(appView)
    document.getElementById('loading')!.style.display = 'none'

    // background
    const background = new PIXI.Sprite(PIXI.Texture.from('background'))
    background.anchor.set(0.5, 1)
    background.x = app.renderer.width / 2
    background.y = app.renderer.height + 110
    app.stage.addChild(background)

    // characters
    const coco = new Coco(app, 0.4)
    const komatsu = new Komatsu(app, 0.4)
    const toriko = new Toriko(app, 0.4)

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

    // trigers for toriko
    document.getElementById('toriko')!.addEventListener('click', function () {
      if (!app.stage.children.includes(toriko)) {
        app.stage.addChild(toriko)
      } else {
        toriko.visible = !toriko.visible
      }
    })
  }
}
