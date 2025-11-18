import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react(),

    // 🔥 Polyfill đầy đủ cho ethers v5 / bn.js
    nodePolyfills({
      protocolImports: true,
    }),
  ],

  resolve: {
    alias: {
      buffer: "buffer",
      process: "process/browser",
    },
  },

  define: {
    "process.env": {},
  },
});
