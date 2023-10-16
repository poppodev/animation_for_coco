import * as PIXI from 'pixi.js';
import { Assets } from 'pixi.js';
import { AnimatedSprite, Texture } from 'pixi.js';

const app = new PIXI.Application({
    width: 1000,
    height: 600,
    backgroundColor: 0xEEEEEE
});

Assets.backgroundLoadBundle('load-screen');

window.document.addEventListener('DOMContentLoaded', () => {

    document.body.appendChild(app.view as HTMLCanvasElement);

    const cocoWalkImages = [
        './images/coco_walk_0000_walk1.png',
        './images/coco_walk_0001_walk2.png',
        './images/coco_walk_0002_walk3.png',
        './images/coco_walk_0003_walk4.png',
        './images/coco_walk_0004_walk5.png',
        './images/coco_walk_0005_walk6.png',
        './images/coco_walk_0006_walk7.png',
        './images/coco_walk_0007_walk8.png'
    ];
    const textureArray: Texture[] = [];

    cocoWalkImages.forEach((imagePath) => {
        const texture = Texture.from(imagePath);
        textureArray.push(texture);
    });

    const animatedSprite = new AnimatedSprite(textureArray);
    animatedSprite.anchor.set(1);
    animatedSprite.scale.set(0.5);
    animatedSprite.x = app.renderer.width / 2;
    animatedSprite.y = app.renderer.height * 0.9;
    animatedSprite.animationSpeed = 0.1;
    animatedSprite.play();
    app.stage.addChild(animatedSprite);
        app.ticker.add(() => {
        animatedSprite.x += -2;
        if (animatedSprite.x < 0) {
            animatedSprite.x = app.renderer.width;
        }

    });

    // PIXI.Assets.load('./images/test.png').then((resolveTexture) => {
    //     console.log(resolveTexture)
    //     const coco = new PIXI.Sprite(resolveTexture);
    //     coco.anchor.set(1);
    //     coco.scale.set(0.5);
    //     coco.x = app.renderer.width / 2;
    //     coco.y = app.renderer.height * 0.9;
    //     app.stage.addChild(coco);
    //     app.ticker.add(() => {
    //         coco.x += -1;
    //         // 左端まで行ったら右にに方向転換する
    //         if (coco.x < 0) {
    //             coco.x = app.renderer.width;
    //         }

    //     });
        
    // });
});
