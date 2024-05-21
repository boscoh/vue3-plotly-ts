import vue from "@vitejs/plugin-vue";
import {resolve} from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), dts()],
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      name: 'VuePlotly',
      // the proper extensions will be added
      fileName: 'vue3-plotly-ts-ts'
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue', 'plotly.js-dist-min'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
          'plotly.js-dist-min': 'Plotly',
        }
      }
    }
  },
})