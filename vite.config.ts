/*
 * @Description: 
 * @Author: yucheng
 * @Date: 2024-06-14
 * @LastEditors: error: git config user.name & please set dead value or install git
 * @LastEditTime: 2024-06-15
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true
  }
})
