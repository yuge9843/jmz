/*
 * @Description: 
 * @Author: yucheng
 * @Date: 2024-06-14
 * @LastEditors: error: git config user.name & please set dead value or install git
 * @LastEditTime: 2024-06-16
 */
import * as PIXI from "pixijs";
import { Assets } from "./assets";

/**
 * @description: 坐标信息
 */
export interface ICoordinate {
    x: number;
    y: number;
}

/**
 * @description: 精灵信息
 */
export interface ISpriteInfo {
    /**
     * 精灵名称
     */
    name: string;
    /**
     * 初始x
     */
    x: number;
    /**
     * 初始y
     */
    y: number;
    /**
     * 宽度，不传则使用资源默认宽度
     */
    width?: number;
    /**
     * 高度，不传则使用资源默认高度
     */
    height?: number;
    /**
     * 显示层级
     */
    zIndex?: number;
    /**
     * 锚点，默认为中心
     */
    anchor?: number[]
}

/**
 * @description: 增强精灵
 */
export class Spirit extends PIXI.Sprite {
    constructor(public spriteInfo: ISpriteInfo) {
        super(Assets.get(spriteInfo.name));
        this.x = spriteInfo.x;
        this.y = spriteInfo.y;
        if(spriteInfo.anchor ) {
            this.anchor.set(...spriteInfo.anchor);
        } else {
            this.anchor.set(0.5);
        }
        if (spriteInfo.width) {
            this.width = spriteInfo.width;
        }
        if (spriteInfo.height) {
            this.height = spriteInfo.height;
        }
        if (spriteInfo.zIndex) {
            this.zIndex = spriteInfo.zIndex;
        }
    }
}
