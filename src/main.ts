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

    // coco
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
    const cocoWalkTextureArray: Texture[] = [];

    cocoWalkImages.forEach((imagePath) => {
        const texture = Texture.from(imagePath);
        cocoWalkTextureArray.push(texture);
    });

    const cocoWalk = new AnimatedSprite(cocoWalkTextureArray);
    cocoWalk.anchor.set(1);
    cocoWalk.scale.set(0.5);
    cocoWalk.x = app.renderer.width / 2;
    cocoWalk.y = app.renderer.height * 0.95;
    cocoWalk.animationSpeed = 0.1;
    cocoWalk.play();
    app.stage.addChild(cocoWalk);
        app.ticker.add(() => {
        cocoWalk.x += -3;
        if (cocoWalk.x < 0) {
            cocoWalk.x = app.renderer.width;
        }
    });


    // komatsu
    const komatsuWalkImages = [
        './images/komatsu_walk_0001_walk1.png',
        './images/komatsu_walk_0002_walk2.png',
        './images/komatsu_walk_0003_walk3.png',
        './images/komatsu_walk_0004_walk4.png',
        './images/komatsu_walk_0005_walk5.png',
        './images/komatsu_walk_0006_walk6.png',
        './images/komatsu_walk_0007_walk7.png',
        './images/komatsu_walk_0008_walk8.png'
    ];
    const komatsuWalkTextureArray: Texture[] = [];

    komatsuWalkImages.forEach((imagePath) => {
        const texture = Texture.from(imagePath);
        komatsuWalkTextureArray.push(texture);
    });

    const komatsuWalk = new AnimatedSprite(komatsuWalkTextureArray);
    //左右反転
    komatsuWalk.scale.x *= -1;
    komatsuWalk.anchor.set(1);
    komatsuWalk.scale.set(0.5);
    komatsuWalk.x = app.renderer.width / 2;
    komatsuWalk.y = app.renderer.height * 0.97;
    komatsuWalk.animationSpeed = 0.1;
    komatsuWalk.play();
    app.stage.addChild(komatsuWalk);
        app.ticker.add(() => {
        komatsuWalk.x += 2;
        if (komatsuWalk.x > app.renderer.width+ komatsuWalk.width) {
            komatsuWalk.x = 0;
        }
    });
});
