import {defineConfig} from "vite";
import {svelte} from "@sveltejs/vite-plugin-svelte";

// https://vite.dev/config/
export default defineConfig({
    plugins: [svelte()],
    build: {
        rollupOptions: {
            input: {
                catalogue: "src/main-catalogue.ts",
                extrait: "src/main-extrait.ts",
                testMaturite: "src/main-test-maturite.ts"
            },
            output: {
                entryFileNames: `assets/[name].js`,
                assetFileNames: `assets/[name].[ext]`,
            },
        },
    },
});
