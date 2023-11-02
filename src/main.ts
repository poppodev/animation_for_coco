import * as PIXI from 'pixi.js'
import * as Common from './common'
import { Coco } from './class/coco'
import { Komatsu } from './class/komatsu'
import { Toriko } from './class/toriko'
import { Sunny } from './class/sunny'
import { Queen } from './class/queen'
import { Zebra } from './class/zebra'

const app = new PIXI.Application({
  width: 1050,
  height: 600,
  backgroundColor: 0xFFFFFF,
  antialias: true
})

let onEvent = false

window.addEventListener('load', () => {
  console.log('loadbefore')
  PIXI.Assets.load(Common.imageSrcs).then(setUp)
})

function setOnEvent (_on: boolean) {
  onEvent = _on
  if (_on) {
    document.getElementById('HBD')!.classList.add('bg-gray-400')
    document.getElementById('HBD')!.classList.remove('bg-emerald-600')
  } else {
    document.getElementById('HBD')!.classList.remove('bg-gray-400')
    document.getElementById('HBD')!.classList.add('bg-emerald-600')
  }
}

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

  const initialX = app.renderer.width * 2 / 3

  app.stage.addChild(toriko)
  app.stage.addChild(queen)
  app.stage.addChild(komatsu)
  app.stage.addChild(coco)
  app.stage.addChild(zebra)

  // coco appear
  setOnEvent(true)
  coco.walkTo(initialX).then(() => {
    console.log('appear done')
    setOnEvent(false)
  })

  // triggers
  // const functions = [torikoAppear, komatsuAppear, sunnyAppear, zebraAppear]; TODO
  const functions = [komatsuAppear]
  const calledFunctions = new Set()

  function resetFunctions () {
    calledFunctions.clear()
  }

  document.getElementById('HBD')!.addEventListener('click', function () {
    if (onEvent) {
      console.log('event now!')
      return
    }
    let availableFunctions = functions.filter(func => !calledFunctions.has(func))
    if (availableFunctions.length === 0) {
      console.log('All functions have been called')
      resetFunctions()
      availableFunctions = functions.filter(func => !calledFunctions.has(func))
    }
    const randomIndex = Math.floor(Math.random() * availableFunctions.length)
    const selectedFunction = availableFunctions[randomIndex]
    calledFunctions.add(selectedFunction)
    selectedFunction()
  })

  function torikoAppear () {
    console.log('toriko!')
    // TODO
  }

  function komatsuAppear () {
    setOnEvent(true)
    // appear from left
    komatsu.walk()

    const ticker = new PIXI.Ticker()
    ticker.add(async () => {
      if (komatsu.x > -45) {
        if (!coco.hasReaction) {
          await coco.reaction()
          await Common.sleep(250)
          coco.walk()
        }
      }

      // coco meets komatsu
      if (komatsu.x + komatsu.width * 0.5 - 13 > coco.x) {
        ticker.destroy()

        // actions
        komatsu.stop()
        coco.stop()
        await coco.down()
        await Common.sleep(500)
        komatsu.givePresent()
        await Common.sleep(1000)

        // open present
        await coco.removeCover(komatsu)
        komatsu.cakeEffect()
        await Common.sleep(500)
        coco.smile()
        komatsu.smile()
        await Common.sleep(2000)

        // close present
        await coco.appendCover(komatsu)

        // walk to right
        komatsu.walk()
        komatsu.smile() // smile off
        await coco.standUp()
        await Common.sleep(300)
        await coco.turn()
        coco.setWalkSpeed(komatsu.walkSpeed)
        await Common.sleep(1200)
        await coco.walkTo(app.renderer.width + Math.abs(coco.width))

        // back to initial position
        await coco.turn()
        coco.setWalkSpeed(coco.walkSpeedDefault)
        coco.walkTo(initialX).then(() => {
          setOnEvent(false)
          komatsu.reset()
        })
      }
    })
    ticker.start()
  }

  function sunnyAppear () {
    console.log('sunny!')
    // TODO
  }
  function zebraAppear () {
    console.log('zebra!')
    // TODO
  }
}
