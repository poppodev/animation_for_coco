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
  Common.setUp(app)
  setOnEvent(true)

  const initialX = app.renderer.width * 2 / 3

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
  app.stage.addChild(komatsu)
  app.stage.addChild(coco)
  app.stage.addChild(zebra)

  // coco appear
  coco.walkTo(initialX).then(() => {
    setOnEvent(false)
  })
  // coco.runTo(0).then(() => {
  //   setOnEvent(false)
  // })

  // const functions = [torikoAppear, komatsuAppear, sunnyAppear, zebraAppear]; TODO
  const functions = [sunnyAppear]
  const calledFunctions = new Set()
  document.getElementById('HBD')!.addEventListener('click', function () {
    if (onEvent) {
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

  // key triggers  TODO keytrigger管理をもうちょっときれいにしたい
  document.addEventListener('keydown', async (event) => {
    const targetKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
    if (onEvent) {
      return
    }
    if (!targetKeys.includes(event.key)) {
      coco.stop()
      return
    }
    const isTurn = (event.key === 'ArrowLeft' && coco.orirentation === 'right') ||
      (event.key === 'ArrowRight' && coco.orirentation === 'left')
    if (event.key === 'ArrowDown' && !coco.isDown) {
      setOnEvent(true)
      await coco.down()
      setOnEvent(false)
    } else if (event.key === 'ArrowUp' && coco.isDown) {
      setOnEvent(true)
      await coco.standUp()
      setOnEvent(false)
    } else if (isTurn) {
      setOnEvent(true)
      await coco.turn()
      setOnEvent(false)
    } else if (coco.isReachEdge()) {
      coco.stop()
      setOnEvent(false)
    } else if (!coco.isWalking && !coco.isReachEdge() && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      coco.walk()
    }
  })

  document.addEventListener('keyup', (event) => {
    if (onEvent) {
      return
    }
    if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && (coco.isWalking || coco.isRunning)) {
      coco.stop()
      setOnEvent(false)
    }
  })

  // inner functions

  function resetFunctions () {
    calledFunctions.clear()
  }

  function komatsuAppear () {
    // TODO cocoの初期値によって開始位置調整が必要？
    setOnEvent(true)

    // ajust orientation
    if (coco.orirentation === 'right') {
      coco.stop()
      coco.turn()
    }

    // appear from left
    komatsu.walk()

    const ticker = new PIXI.Ticker()
    let reacted = false
    ticker.add(async () => {
      if (komatsu.x > -45) {
        if (!reacted) {
          reacted = true
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

  async function torikoAppear () {
    // TODO cocoにgetPresentを追加してから完成
    console.log('toriko!')
    setOnEvent(true)

    // ajust coco start position
    const startX = app.renderer.width / 2 - coco.width
    if (startX < coco.x) {
      await coco.walkTo(startX)
    }

    // appear from right
    toriko.reset()
    toriko.walk()
    await Common.sleep(1000)
    await coco.reaction()
    if (coco.orirentation === 'left') {
      await coco.turn()
    }
    coco.walk()

    const ticker = new PIXI.Ticker()
    ticker.add(async () => {
      if (toriko.x - coco.width / 2 < coco.x) {
        console.log('meet')
        ticker.stop()
        toriko.stop()
        coco.stop()

        await toriko.givePresent()
        await Common.sleep(1000)
        coco.smile()
        await Common.sleep(1500)
        toriko.removeGift()

        // toriko away
        toriko.walk()
        await Common.sleep(1000)
        await coco.turn()
        await Common.sleep(2000)
        await coco.turn()

        await coco.walkTo(app.renderer.width + Math.abs(coco.width))

        // back to initial position
        await coco.turn()
        coco.walkTo(initialX).then(() => {
          setOnEvent(false)
          toriko.reset()
        })

        ticker.destroy()
      }
    })
    ticker.start()
  }

  async function sunnyAppear () {
    setOnEvent(true)

    const startPointX = initialX - 50

    await Promise.all([comeCoco(), queen.appear()])

    coco.faceUp()
    await Common.sleep(500)
    sunny.smile()
    await sunny.givePresent(true)
    await Common.sleep(1000)
    coco.smile()

    // TODO cocoがflowerを受け取る
    sunny.removeFlowers()
    await sunny.givePresent(false)

    await Common.sleep(1000)
    coco.faceUp(false)
    await Promise.all([queen.getOut(), Common.sleep(1000).then(async () => { await awayAndInitialCoco() })])
    sunny.reset()
    setOnEvent(false)

    // functions..
    async function awayAndInitialCoco (): Promise<void> {
      console.log('awayAndInitialCoco')
      await new Promise<void>(async (resolve): Promise<void> => {
        await coco.turn()
        await coco.walkTo(app.renderer.width)
        await coco.turn()
        await coco.walkTo(initialX)
        resolve()
      })
    }
    // move coco to start point
    async function comeCoco (): Promise<void> {
      console.log('comeCoco')
      await new Promise<void>(async (resolve): Promise<void> => {
        if (coco.x < startPointX && coco.orirentation === 'left' ||
        coco.x > startPointX && coco.orirentation === 'right') {
          await coco.turn()
        }
        await coco.walkTo(startPointX)
        if (coco.orirentation === 'right') {
          await coco.turn()
        }
        resolve()
      })
    }
  }

  function zebraAppear () {
    console.log('zebra!')
    // TODO
  }
}
