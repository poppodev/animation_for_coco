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
  PIXI.Assets.load(Common.imageSrcs).then(setUp)
})

async function setUp () {
  console.log('startSetup')
  Common.setUp(app)

  // characters
  const coco = new Coco(app, 0.4)
  const komatsu = new Komatsu(app, 0.4)
  const toriko = new Toriko(app, 0.4)
  const queen = new Queen(app, 0.4)
  const sunny = new Sunny(app, 0.4)
  queen.addChild(sunny)
  const zebra = new Zebra(app, 0.4)
  
  app.stage.addChild(toriko)
  app.stage.addChild(queen)
  app.stage.addChild(zebra)
  app.stage.addChild(coco)
  app.stage.addChild(komatsu)
}
