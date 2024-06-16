/*
 * @Description: 
 * @Author: yucheng
 * @Date: 2024-06-14
 * @LastEditors: error: git config user.name & please set dead value or install git
 * @LastEditTime: 2024-06-16
 */
import * as PIXI from 'pixijs';

export class Assets {
    static _assets = new Map<string, any>();

    /**
     * @description: 加载资源
     * @param {string} name 资源名称
     * @param {string} url 资源路径 选填，不填则从预设的资源映射表读取
     * @return {*}
     */    
    static async load(name: string, url?: string) {
        if(Assets._assets.has(name)) return Promise.resolve(Assets._assets.get(name));
        const asset = await PIXI.Assets.load(url || assetNameUrlMap.get(name as assetName)!);
        Assets._assets.set(name, asset);
        return asset;
    }

    /**
     * @description: 获取资源
     * @param {string} name 资源名称
     * @return {*}
     */    
    static get(name: string) {
        return Assets._assets.get(name);
    }
}

/**
 * @description: 资源名称与路径映射表
 */
const assetNameUrlMap = new Map([
    ['鸠摩智', 'assets/role/jmz.png'],
    ['剑', 'assets/weapon/upg_sword.png']
] as const);


export type assetName = typeof assetNameUrlMap extends Map<infer K, any> ? K : never;