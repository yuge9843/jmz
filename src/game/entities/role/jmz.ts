/*
 * @Description: 
 * @Author: yucheng
 * @Date: 2024-06-19
 * @LastEditors: yuge9843
 * @LastEditTime: 2024-06-19
 */
import { Role } from "../../role";
import { ICoordinate } from "../../spirit";

/**
 * 鸠摩智
 */
export class Jmz extends Role {
    constructor(coord: ICoordinate) {
      super({
        name: '鸠摩智',
        x: coord.x,
        y: coord.y,
        width: 200,
        height: 200,
        hp: 100,
        defense: 10,
        moveSpeed: 2
      })
    }
  }