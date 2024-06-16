/*
 * @Description: 
 * @Author: yucheng
 * @Date: 2024-06-14
 * @LastEditors: error: git config user.name & please set dead value or install git
 * @LastEditTime: 2024-06-16
 */
import './app.scss'
import { startGame } from "./game"


function App() {
  return (
    <>
      <canvas id='game_container'></canvas>
      <button id='start_btn' onClick={() => startGame(document.getElementById('game_container') as HTMLCanvasElement)}>开始游戏</button>
    </>
  )
}

export default App
