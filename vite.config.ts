import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import solid from 'vite-plugin-solid'

export default defineConfig(({ mode }) => {
  let base = "/"


  if (mode === "production") {
    base = "/homepage/"
  }

  return {
    base,
    plugins: [tailwindcss(), solid()],
  }
})
