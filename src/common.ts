import * as PIXI from 'pixi.js'

export const imageSrcs = [{ alias: 'background', src: './images/background_grass.png' },
  { alias: 'clouds', src: './images/background_clouds.png' },
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
  { alias: 'cocoTurnLeft7', src: './images/coco_turn_left_0007_7.png' },
  { alias: 'cocoWalkReversePatch', src: './images/coco_walk_reverse_patch.png' },
  { alias: 'cocoTurnReverse1', src: './images/coco_turn_reverse_1.png' },
  { alias: 'cocoTurnReverse2', src: './images/coco_turn_reverse_2.png' },
  { alias: 'cocoTurnReverse3', src: './images/coco_turn_reverse_3.png' },
  { alias: 'cocoTurnReverse4', src: './images/coco_turn_reverse_4.png' },
  { alias: 'cocoTurnReverse5', src: './images/coco_turn_reverse_5.png' },
  { alias: 'cocoTurnReverse6', src: './images/coco_turn_reverse_6.png' },
  { alias: 'cocoTurnReverse7', src: './images/coco_turn_reverse_7.png' },
  { alias: 'cocoRunReverse1', src: './images/coco_run_reverse_1.png' },
  { alias: 'cocoRunReverse2', src: './images/coco_run_reverse_2.png' },
  { alias: 'cocoRunReverse3', src: './images/coco_run_reverse_3.png' },
  { alias: 'cocoRunReverse4', src: './images/coco_run_reverse_4.png' },
  { alias: 'cocoRunReverse5', src: './images/coco_run_reverse_5.png' },
  { alias: 'cocoRunReverse6', src: './images/coco_run_reverse_6.png' },
  { alias: 'cocoRunReverse7', src: './images/coco_run_reverse_7.png' },
  { alias: 'cocoRunReverse8', src: './images/coco_run_reverse_8.png' },
  { alias: 'cocoDownReverse1', src: './images/coco_down_reverse_1.png' },
  { alias: 'cocoDownReverse2', src: './images/coco_down_reverse_2.png' },
  { alias: 'cocoDownReverse3', src: './images/coco_down_reverse_3.png' },
  { alias: 'cocoDownReverse4', src: './images/coco_down_reverse_4.png' },
  { alias: 'cocoDownReverse5', src: './images/coco_down_reverse_5.png' },
  { alias: 'cocoEyeClose', src: './images/coco_parts_eye_close.png' },
  { alias: 'cocoEyeOpen', src: './images/coco_parts_eye_open.png' },
  { alias: 'cocoEyeHalf', src: './images/coco_parts_eye_half.png' },
  { alias: 'cocoEyeSmile', src: './images/coco_parts_eye_smile.png' },
  { alias: 'cocoEyeSurprised', src: './images/coco_parts_eye_surprised.png' },
  { alias: 'cocoMouseSurprised', src: './images/coco_parts_mouse_surprised.png' },
  { alias: 'cocoRemoveCakeCover1', src: './images/coco_down_cover_1.png' },
  { alias: 'cocoRemoveCakeCover2', src: './images/coco_down_cover_2.png' },
  { alias: 'cocoRemoveCakeCover3', src: './images/coco_down_cover_3.png' },
  { alias: 'cocoRemoveCakeCover4', src: './images/coco_down_cover_4.png' },
  { alias: 'cocoMouseOpen', src: './images/coco_parts_mouse_open.png' },
  { alias: 'cocoMouseSmile', src: './images/coco_parts_mouse_smile.png' },
  { alias: 'cocoDownSmile1', src: './images/coco_down_smile_1.png' },
  { alias: 'cocoDownSmile2', src: './images/coco_down_smile_2.png' },
  { alias: 'cocoDownSmile3', src: './images/coco_down_smile_3.png' },
  { alias: 'cocoFaceUp', src: './images/coco_face_up.png' },
  { alias: 'cocoFaceUpReverse', src: './images/coco_reverse_patch_up.png' },
  { alias: 'komatsuWalk1', src: './images/komatsu_walk_0001_walk1.png' },
  { alias: 'komatsuWalk2', src: './images/komatsu_walk_0002_walk2.png' },
  { alias: 'komatsuWalk3', src: './images/komatsu_walk_0003_walk3.png' },
  { alias: 'komatsuWalk4', src: './images/komatsu_walk_0004_walk4.png' },
  { alias: 'komatsuWalk5', src: './images/komatsu_walk_0005_walk5.png' },
  { alias: 'komatsuWalk6', src: './images/komatsu_walk_0006_walk6.png' },
  { alias: 'komatsuWalk7', src: './images/komatsu_walk_0007_walk7.png' },
  { alias: 'komatsuWalk8', src: './images/komatsu_walk_0008_walk8.png' },
  { alias: 'komatsuStand', src: './images/komatsu_base.png' },
  { alias: 'komatsuSmile', src: './images/komatsu_smile.png' },
  { alias: 'komatsuArmPush', src: './images/komatsu_arm_push.png' },
  { alias: 'torikoStand', src: './images/toriko_base.png' },
  { alias: 'torikoSmile', src: './images/toriko_smile.png' },
  { alias: 'torikoArmRight1', src: './images/toriko_arm_right.png' },
  { alias: 'torikoArmRight2', src: './images/toriko_arm_right2.png' },
  { alias: 'torikoArmRight3', src: './images/toriko_arm_right3.png' },
  { alias: 'torikoArmRight4', src: './images/toriko_arm_right4.png' },
  { alias: 'torikoWalk1', src: './images/toriko_walk1.png' },
  { alias: 'torikoWalk2', src: './images/toriko_walk2.png' },
  { alias: 'torikoWalk3', src: './images/toriko_walk3.png' },
  { alias: 'torikoWalk4', src: './images/toriko_walk4.png' },
  { alias: 'torikoWalk5', src: './images/toriko_walk5.png' },
  { alias: 'torikoWalk6', src: './images/toriko_walk6.png' },
  { alias: 'torikoWalk7', src: './images/toriko_walk7.png' },
  { alias: 'torikoWalk8', src: './images/toriko_walk8.png' },
  { alias: 'torikoWalkArm1', src: './images/toriko_walk1_right_arm.png' },
  { alias: 'torikoWalkArm2', src: './images/toriko_walk2_right_arm.png' },
  { alias: 'torikoWalkArm3', src: './images/toriko_walk3_right_arm.png' },
  { alias: 'torikoWalkArm4', src: './images/toriko_walk4_right_arm.png' },
  { alias: 'torikoWalkArm5', src: './images/toriko_walk5_right_arm.png' },
  { alias: 'torikoWalkArm6', src: './images/toriko_walk6_right_arm.png' },
  { alias: 'torikoWalkArm7', src: './images/toriko_walk3_right_arm.png' },
  { alias: 'torikoWalkArm8', src: './images/toriko_walk8_right_arm.png' },
  { alias: 'flowers', src: './images/flowers.png' },
  { alias: 'sunny', src: './images/sunny.png', mipmap: true },
  { alias: 'sunnyArm', src: './images/sunny_arm.png' },
  { alias: 'sunnyArmFree', src: './images/sunny_arm_free.png' },
  { alias: 'sunnySmile', src: './images/sunny_eye_smile.png' },
  { alias: 'queen', src: './images/queen.png' },
  { alias: 'sunnyHair1', src: './images/sunny_hair8.png' },
  { alias: 'sunnyHair2', src: './images/sunny_hair7.png' },
  { alias: 'sunnyHair3', src: './images/sunny_hair6.png' },
  { alias: 'sunnyHair4', src: './images/sunny_hair5.png' },
  { alias: 'sunnyHair5', src: './images/sunny_hair4.png' },
  { alias: 'sunnyHair6', src: './images/sunny_hair3.png' },
  { alias: 'sunnyHair7', src: './images/sunny_hair2.png' },
  { alias: 'sunnyHair8', src: './images/sunny_hair1.png' },
  { alias: 'cake', src: './images/cake.png' },
  { alias: 'cakeCover', src: './images/cake_cover.png' },
  { alias: 'zebra', src: './images/zebra_base.png' },
  { alias: 'zebraSmile', src: './images/zebra_smile.png' },
  { alias: 'zebraPopper1', src: './images/zebra_cracker_1.png' },
  { alias: 'zebraPopper2', src: './images/zebra_cracker_2.png' },
  { alias: 'zebraPopper3', src: './images/zebra_cracker_3.png' },
  { alias: 'zebraPopper4', src: './images/zebra_cracker_4.png' },
  { alias: 'zebraPopper5', src: './images/zebra_cracker_5.png' },
  { alias: 'zebraPopper6', src: './images/zebra_cracker_6.png' },
  { alias: 'zebraPopper7', src: './images/zebra_cracker_7.png' },
  { alias: 'zebraPopper8', src: './images/zebra_cracker_8.png' },
  { alias: 'zebraPopper9', src: './images/zebra_cracker_9.png' },
  { alias: 'zebraWalk1', src: './images/zebra_walk_1.png' },
  { alias: 'zebraWalk2', src: './images/zebra_walk_2.png' },
  { alias: 'zebraWalk3', src: './images/zebra_walk_3.png' },
  { alias: 'zebraWalk4', src: './images/zebra_walk_4.png' },
  { alias: 'zebraWalk5', src: './images/zebra_walk_5.png' },
  { alias: 'zebraWalk6', src: './images/zebra_walk_6.png' },
  { alias: 'zebraWalk7', src: './images/zebra_walk_7.png' },
  { alias: 'zebraWalk8', src: './images/zebra_walk_8.png' },
  { alias: 'popup', src: './images/fukidashi.png' },
  { alias: 'pan', src: './images/pan.png' }
]

export function setUp (app: PIXI.Application) {
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
    clouds.x -= 0.15
    clouds2.x -= 0.15
    if (clouds.x < -clouds.width) {
      clouds.x = app.renderer.width
    }
    if (clouds2.x < -clouds2.width) {
      clouds2.x = app.renderer.width
    }
  })
}

export async function sleep (ms: number) {
  return await new Promise(resolve => setTimeout(resolve, ms))
}

export function deg2rad (degree: number) {
  return degree * Math.PI / 180
}
