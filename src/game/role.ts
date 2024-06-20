/*
 * @Description:
 * @Author: yucheng
 * @Date: 2024-06-14
 * @LastEditors: yuge9843
 * @LastEditTime: 2024-06-20
 */
import * as PIXI from "pixijs";
import { Spirit } from "./spirit";
import { game } from ".";
import { Weapon } from "./weapon";
import { v4 as uuidv4 } from "uuid";
import { assetName } from "./assets";
import { getHurt } from "./util";

export interface IRole {
    id: string;
    name: assetName;
    x: number;
    y: number;
    width?: number;
    height?: number;
    hp: number;
    defense: number;
    moveSpeed: number;
}
/**
 * 人物基类
 */
export class Role {
    /**
     * 角色id
     */
    id = uuidv4();
    /**
     * 角色名称
     */
    name: assetName;
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
    attack = 1;
    /**
     * 防御
     */
    defense = 10;
    /**
     * 对同一目标的伤害间隔
     */
    harmInterval: number = 200;
    /**
     * 角色移动速度 像素/帧
     */
    moveSpeed = 2;

    get x() {
        return this.spirit.x;
    }
    set x(value) {
        this.spirit.x = value;
    }
    get y() {
        return this.spirit.y;
    }
    set y(value) {
        this.spirit.y = value;
    }
    get width() {
        return this.spirit.width;
    }
    set width(value) {
        this.spirit.width = value;
    }
    get height() {
        return this.spirit.height;
    }
    set height(value) {
        this.spirit.height = value;
    }
    get anchor() {
        return this.spirit.anchor;
    }
    set anchor(value) {
        this.spirit.anchor = value;
    }
    get scale() {
        return this.spirit.scale;
    }
    set scale(value) {
        this.spirit.scale = value;
    }
    get angle() {
        return this.spirit.angle;
    }
    set angle(value) {
        this.spirit.angle = value;
    }
    get getBounds() {
        return this.spirit.getBounds.bind(this.spirit);
    }

    constructor(attribute: Omit<IRole, "id">) {
        const { name, x, y, hp, defense, moveSpeed, width, height } = attribute;
        this.name = name;
        this.spirit = new Spirit({ x, y, width, height, name });
        if (hp !== undefined) {
            this.hp = hp;
        }
        if (defense !== undefined) {
            this.defense = defense;
        }
        if (moveSpeed !== undefined) {
            this.moveSpeed = moveSpeed;
        }
        if (!game?.containersMap.get("role")) {
            game?.containersMap.set("role", new PIXI.Container());
            game?.app.stage.addChild(game.containersMap.get("role")!);
        }
        game?.entitiesMap.set(this.id, this);
        game?.containersMap.get("role")?.addChild(this.spirit);
        this.initControl();
        game?.app.ticker.add(this.moveWithKeybord.bind(this));
    }
    /**
     * 持有的武器
     */
    weapons: Set<Weapon> = new Set();
    /**
     * 增加武器
     */
    addWeapon(weapon: Weapon) {
        // 同时只能持有一种武器，所以先清除其他武器
        Array.from(this.weapons).forEach((w) => {
            if (w.name !== weapon.name) {
                this.removeWeapon(w);
            }
        });
        this.weapons.add(weapon);
        if (weapon.canRotate) {
            game?.app.ticker.add(weapon.rotate.bind(weapon));
        }
    }
    /**
     * 移除武器
     */
    removeWeapon(weapon: Weapon) {
        this.weapons.delete(weapon);
        if (weapon.canRotate) {
            game?.app.ticker.remove(weapon.rotate.bind(weapon));
        }
    }
    /**
     * 根据键盘移动
     */
    moveWithKeybord() {
        if (this.pressedKeys.has("W")) {
            this.spirit.y -= this.moveSpeed;
        }
        if (this.pressedKeys.has("S")) {
            this.spirit.y += this.moveSpeed;
        }
        if (this.pressedKeys.has("A")) {
            this.spirit.x -= this.moveSpeed;
        }
        if (this.pressedKeys.has("D")) {
            this.spirit.x += this.moveSpeed;
        }
    }
    /**
     * 被按下的键
     */
    pressedKeys: Set<string> = new Set();
    /**
     * 键盘按下
     */
    private moveKeyDown(e: KeyboardEvent) {
        this.pressedKeys.add(e.key.toUpperCase());
    }
    /**
     * 键盘松开
     */
    private moveKeyUp(e: KeyboardEvent) {
        this.pressedKeys.delete(e.key.toUpperCase());
    }
    /**
     * @description: 初始化控制逻辑
     * @return {*}
     */
    initControl() {
        window.addEventListener("keydown", this.moveKeyDown.bind(this));
        window.addEventListener("keyup", this.moveKeyUp.bind(this));
    }
    destory() {
        this.spirit.destroy();
        game?.entitiesMap.delete(this.id);
        game?.app.ticker.remove(this.moveWithKeybord.bind(this));
        window.removeEventListener("keydown", this.moveKeyDown);
        window.removeEventListener("keyup", this.moveKeyUp);
    }
    /**
     * @description: 攻击
     * @param {Role | Spirit} entity 攻击对象
     */
    hit(entity: Role | Weapon) {
        entity.hp -= getHurt(this.attack, entity.defense);
        this.spirit.tint = 0xff0000;
        setTimeout(() => {
            this.spirit.tint = 0xffffff;
        }, 50);
    }
}
