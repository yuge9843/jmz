/*
 * @Description: 
 * @Author: yucheng
 * @Date: 2024-06-14
 * @LastEditors: error: git config user.name & please set dead value or install git
 * @LastEditTime: 2024-06-16
 */
import * as PIXI from 'pixijs';
import { ISpriteInfo, Spirit } from './spirit';
import { game } from '.';
import { Role } from './role';

/**
 * 武器基类
 */
export class Weapon {
  /**
   * 名称
   */
  name: string;
  /**
   * 精灵
   */
  spirit: Spirit;
  /**
   * 持有者
   */  
  holder: Role | null = null;
  /**
   * 伤害值
   */
  harmValue: number = 1;
  /**
   * 对同一目标的伤害间隔
   */
  harmInterval: number = 200;
  /**
   * 伤害历史记录
   */
  harmHistory = new Map<string, number>();
  /**
   * 单人持有上限
   */
  maxHoldNum: number = 1;
  constructor(public spriteInfo: ISpriteInfo) {
    this.spirit = new Spirit(spriteInfo);
    this.name = spriteInfo.name;
    if(!game?.containersMap.get('weapon')) {
      game?.containersMap.set('weapon', new PIXI.Container());
      game?.app.stage.addChild(game.containersMap.get('weapon')!);
    }
    game?.containersMap.get('weapon')?.addChild(this.spirit);
  }
  /**
   * @description: 更新拥有者
   * @param {Role} holder 拥有者
   * @return {*}
   */  
  updateHolder(holder: Role | null) {
    this.holder = holder;
    if(!holder) return;
    const holderHasNums = Array.from(holder.weapons.values()).filter(w => w.name === this.name).length;
    if(holderHasNums >= this.maxHoldNum) {
      console.log(`持有者${holder.name}已达到${this.maxHoldNum}个${this.name}，无法再持有`);
      return;
    }
    holder.addWeapon(this);
    this.spirit.x = holder.spirit.x;
    this.spirit.y = holder.spirit.y;
    const anglItem = 360 / (holderHasNums + 1)
    Array.from(holder.weapons.values()).forEach((w, i) => {
      w.spirit.angle = anglItem * i;
    })
  }
  /**
   * 是否可以旋转 为true则被捡起后自动旋转
   */  
  canRotate = false;
  /**
   * 旋转速度,1表示每帧旋转1度
   */
  rotateSpeed = 1;
  /**
   * @description: 开始旋转
   * @return {*}
   */  
  rotate() {
    if(!this.canRotate) {
      console.log(`武器${this.name}不能旋转`);
      return
    }
    if(!this.holder) {
      console.log('持有者为空，无法旋转');
      return
    }
    const distance = Math.max(this.holder.spirit.width, this.holder.spirit.height) + this.spirit.width / 2;
    this.spirit.angle += this.rotateSpeed;
    const angle = this.spirit.angle % 360
    const radians = angle * (Math.PI / 180);
    this.spirit.x = this.holder.spirit.x + distance * Math.cos(radians); 
    this.spirit.y = this.holder.spirit.y + distance * Math.sin(radians);

  }
  /**
   * @description: 销毁
   * @return {*}
   */  
  destory() {
    game?.containersMap.get('weapon')?.removeChild(this.spirit);
    this.spirit.destroy();
  }
}

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
      width: 200,
      height: 100
    });
    this.harmValue = 2;
    this.maxHoldNum = 10
    this.canRotate = true;
  }
}