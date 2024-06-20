/*
 * @Description: 
 * @Author: yucheng
 * @Date: 2024-06-19
 * @LastEditors: yuge9843
 * @LastEditTime: 2024-06-20
 */
import { Weapon } from "../../weapon";

/**
 * 剑
 */
export class Sword extends Weapon {
    constructor(spriteInfo: {
      x: number,
      y: number,
    }) {
      super({
        ...spriteInfo,
        name: '剑',
        width: 116,
        height: 48
      });
      this.attack = 5;
      this.maxHoldNum = 10
      this.canRotate = true;
    }
  }