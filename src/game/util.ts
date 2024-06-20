/*
 * @Description:
 * @Author: yucheng
 * @Date: 2024-06-19
 * @LastEditors: yuge9843
 * @LastEditTime: 2024-06-20
 */
import * as PIXI from "pixijs";
import { sortBy } from "lodash-es";
import { Sword } from "./entities/weapon/sword";

/**
 * 获取所有发生碰撞的节点
 * @param objects 所有节点
 * @returns 所有发生碰撞的节点
 */
export const getAllCollisions = (objects: PIXI.DisplayObject[]) => {
    // 包围盒排序
    const sorted = sortBy(
        objects.map((object) => {
            const { left, right } = object.getBounds();
            return {
                x1: left,
                x2: right,
                object,
            };
        }),
        "x1"
    );

    // 将可能发生碰撞的节点分组
    let mayCollisions: any[][] = [[sorted[0]]];
    sorted.forEach((item, index) => {
        if (index === 0) {
            return;
        }
        const prev = sorted[index - 1];
        if (item.x1 <= prev.x2) {
            mayCollisions[mayCollisions.length - 1].push(item);
        } else {
            mayCollisions.push([item]);
        }
    });
    mayCollisions = mayCollisions.filter((item) => item.length > 1);
    mayCollisions.forEach((item, index) => {
        mayCollisions[index] = item.map((item2) => item2.object);
    });
    
    // 将可能发生碰撞的节点进行精准碰撞计算
    const collisions = [] as any[][];
    mayCollisions.forEach((group) => {
        group.forEach((item, index) => {
            group.forEach((other, otherIndex) => {
                if (index === otherIndex) {
                    return;
                }
                const collision = item
                    .getBounds()
                    .intersects(other.getBounds());
                if (collision) {
                    collisions.push([item, other]);
                }
            });
        });
    });



    // 去除重复的碰撞结果
    const uniqueCollisions = [] as any[][];
    collisions.forEach((item) => {
        const [a, b] = item;
        const hasA = uniqueCollisions.some((other) => other.includes(a));
        const hasB = uniqueCollisions.some((other) => other.includes(b));
        if (!hasA && !hasB) {
            uniqueCollisions.push(item);
        }
    });
    return uniqueCollisions as unknown as (PIXI.DisplayObject & Sword)[][];
};

/**
 * @description: 计算经过护甲削减后的伤害值
 * @param {number} harmValue
 * @param {number} armor
 * @return {*}
 */
export const getHurt = (harmValue: number, armor: number) => {
    return +(harmValue * (1 - armor/(armor+100))).toFixed(2);
}