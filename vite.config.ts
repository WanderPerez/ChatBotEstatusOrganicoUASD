import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
// Quitamos la importación de singlefile para evitar que rompa el empaquetado

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  base: "./", // 1. ¡IMPORTANTE! Asegura que todas las rutas sean relativas para que funcione en GitHub
  plugins: [
    react(), 
    tailwindcss() // 2. Quitamos viteSingleFile() para permitir un empaquetado estándar y limpio
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
