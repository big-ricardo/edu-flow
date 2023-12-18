import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@hooks": "/src/hooks",
      "@pages": "/src/pages",
      "@services": "/src/services",
      "@assets": "/src/assets",
      "@styles": "/src/styles",
      "@utils": "/src/utils",
      "@interfaces": "/src/interfaces",
      "@config": "/src/config",
      "@constants": "/src/constants",
      "@contexts": "/src/contexts",
    },
  },
});
