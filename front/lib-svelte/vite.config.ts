import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    rollupOptions: {
      input: {
        catalogue: "src/main-catalogue.ts",
        extrait: "src/main-extrait.ts",
        "test-maturite": "src/main-test-maturite.ts",
        "niveaux-maturite":"src/main-niveaux-maturite.ts",
        identification: "src/main-identification.ts",
      },
      output: {
        entryFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
});
