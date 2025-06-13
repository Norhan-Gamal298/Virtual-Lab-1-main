import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import monacoEditorPluginModule from "vite-plugin-monaco-editor";

const { monacoEditorPlugin } = monacoEditorPluginModule;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), monacoEditorPlugin],
  server: {
    watch: {
      ignored: ["**/backend/**"],
    },
    proxy: {
      "/api": "http://localhost:8080",
    },
  },
});
