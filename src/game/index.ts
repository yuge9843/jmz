/*
 * @Description: 
 * @Author: yucheng
 * @Date: 2024-06-14
 * @LastEditors: yuge9843
 * @LastEditTime: 2024-06-20
 */
import * as PIXI from 'pixijs';
import { Assets } from './assets';
import { has } from 'lodash-es';
import { Spirit } from './spirit';
import { Jmz } from './entities/role/jmz';
import { Sword } from './entities/weapon/sword';
import { getAllCollisions } from './util';

class Game {
    /**
     * @description pixi应用实例
     */    
    app: PIXI.Application;
    /**
     * @description 容器map
     */    
    containersMap = new Map<string, PIXI.Container>();
    /**
     * @description 实体map
     */    
    entitiesMap = new Map<string, Record<string, any>>();
    constructor(container: HTMLCanvasElement) {
        const { width: screenWidth, height: screenHeight } = window.screen
        this.app = new PIXI.Application({
            width: screenWidth,
            height: screenHeight,
            backgroundColor: 0x2c3e50,
            resolution: window.devicePixelRatio || 1,
            antialias: true,
            autoDensity: true,
            view: container
        })
    }
    /**
     * @description: 初始化游戏
     * @param {string[]} assets
     * @return {*}
     */    
    async init(assets: (string|{name: string, url: string})[]) {
        console.log('资源加载中...');
        await Promise.all(assets.map(asset => {
            return typeof asset === 'string' ? Assets.load(asset) : Assets.load(asset.name, asset.url);
        }))
        console.log('资源加载完成！');
        window.addEventListener('resize', this.resize.bind(this));
    }
    /**
     * @description: 尺寸变更
     * @return {*}
     */    
    resize() {
        const { width: screenWidth, height: screenHeight } = screen
        const resizeObject = (displayObject: PIXI.DisplayObject) => {
            if(displayObject instanceof PIXI.DisplayObject === false) return
            if(displayObject.children) {
                displayObject.children.forEach(child => {
                    if(child instanceof PIXI.DisplayObject) {
                        resizeObject(child);
                    }
                });
            }
            const {width: oldScreenWidth, height: oldScreenHeight} = this.app.screen
            // 更新位置
            const originalX = displayObject.x;
            const newX = originalX / oldScreenWidth * screenWidth;
            const originalY = displayObject.y;
            const newY = originalY / oldScreenHeight * screenHeight;
            displayObject.position.set(newX, newY);

            // 更新尺寸
            if(!has(displayObject, 'width') || !has(displayObject, 'height')) return
            const originalWidth = displayObject.width as number;
            const originalHeight = displayObject.height as number;
            const widthRatio = screenWidth / originalWidth;
            const heightRatio = screenHeight / originalHeight;
            const ratio = Math.min(widthRatio, heightRatio);
            const newWidth = originalWidth * ratio;
            const newHeight = originalHeight * ratio;
            displayObject.width = newWidth;
            displayObject.height = newHeight;
        }
        this.containersMap.forEach(container => {
            container.children.forEach(resizeObject);
        })
        this.app.renderer.resize(screenWidth, screenHeight);
    }
    /**
     * @description: 销毁游戏
     * @return {*}
     */    
    destroy() {
        this.app.destroy();
        window.removeEventListener('resize', this.resize);
    }
}

/**
 * @description: 游戏实例
 */
export let game: Game | null = null;

/**
 * @description: 开始游戏
 * @param {HTMLCanvasElement} container
 * @return {*}
 */
export const startGame = async (container: HTMLCanvasElement) => {
    if(game) {
        game.destroy();
        game = null;
    }
    game = new Game(container);
    // 开发环境下挂载到window上方便调试
    if(process.env.NODE_ENV === 'development') {
        window.game = game;
    }
    // 准备资源
    await game.init(['鸠摩智', {
        name: 'ground1',
        url: 'assets/ground/ground1.jpg'
    }, '剑'])
    // 加载地面
    const ground = new Spirit({
        name: 'ground1',
        x: 0,
        y: 0,
        width: 3840,
        height: 2160,
        anchor: [0],
        zIndex: 1,
    })
    const groundContainer = new PIXI.Container();
    game.app.stage.addChild(groundContainer);
    game.containersMap.set('ground', groundContainer);
    groundContainer.addChild(ground);
    const jmz = new Jmz({
        x: 900,
        y: 600,
    })
    for (let i = 0; i < 10; i++) {
        const sword = new Sword({
            x: 500,
            y: 800
        })
        sword.updateHolder(jmz)
    }
    const sword = new Sword({
        x: 500,
        y: 800
    })
    sword.width = 174
    sword.height = 72
    game.app.ticker.add(() => {
        const objs = Array.from(game!.entitiesMap.values())
        const collisions = getAllCollisions(objs as PIXI.DisplayObject[])
        collisions.forEach(collision => {
            const [ entityA, entityB ] = collision
            entityA.hit(entityB)
            entityB.hit(entityA)
        })
    })
}