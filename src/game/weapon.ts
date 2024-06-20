/*
 * @Description: 
 * @Author: yucheng
 * @Date: 2024-06-14
 * @LastEditors: yuge9843
 * @LastEditTime: 2024-06-20
 */
import * as PIXI from 'pixijs';
import { ISpriteInfo, Spirit } from './spirit';
import { game } from '.';
import { Role } from './role';
import { v4 as uuidv4 } from 'uuid';
import { getHurt } from './util';

/**
 * 武器基类
 */
export class Weapon {
  /**
   * id
   */
  id = uuidv4()
  /**
   * 名称
   */
  name: string;
  /**
   * 精灵
   */
  spirit: Spirit;
  /**
   * 生命值
   */
  hp = 100;
  /**
   * 攻击力
   */
  attack = 10;
  /**
   * 防御
   */
  defense = 10;
  /**
   * 持有者
   */  
  holder: Role | null = null;
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

  get x() {
    return this.spirit.x
  }
  set x(value) {
    this.spirit.x = value
  }
  get y() {
    return this.spirit.y
  }
  set y(value) {
    this.spirit.y = value
  }
  get width() {
    return this.spirit.width
  }
  set width(value) {
    this.spirit.width = value
  }
  get height() {
    return this.spirit.height
  }
  set height(value) {
    this.spirit.height = value
  }
  get anchor() {
    return this.spirit.anchor
  }
  set anchor(value) {
    this.spirit.anchor = value
  }
  get scale() {
    return this.spirit.scale
  }
  set scale(value) {
    this.spirit.scale = value
  }
  get angle() {
    return this.spirit.angle
  }
  set angle(value) {
    this.spirit.angle = value
  }
  get getBounds() {
    return this.spirit.getBounds.bind(this.spirit)
  }
  
  constructor(public spriteInfo: ISpriteInfo) {
    this.spirit = new Spirit(spriteInfo);
    this.name = spriteInfo.name;
    if(!game?.containersMap.get('weapon')) {
      game?.containersMap.set('weapon', new PIXI.Container());
      game?.app.stage.addChild(game.containersMap.get('weapon')!);
    }
    game?.entitiesMap.set(this.id, this);
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
   * @description: 攻击
   * @param {Role | Spirit} entity 攻击对象
   */  
  hit(entity: Role | Weapon) {
    entity.hp -= getHurt(this.attack, entity.defense);
    this.spirit.tint = 0xff0000
    setTimeout(() => {
      this.spirit.tint = 0xffffff
    }, 50)
  }
  /**
   * @description: 销毁
   * @return {*}
   */  
  destory() {
    game?.entitiesMap.delete(this.id);
    game?.containersMap.get('weapon')?.removeChild(this.spirit);
    if(this.holder) {
      this.holder.removeWeapon(this);
    }
    this.spirit.destroy();
  }
}