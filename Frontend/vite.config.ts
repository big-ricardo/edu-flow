import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";


// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = {
    ...process.env,
    ...loadEnv(mode, process.cwd()),
  };

  return defineConfig({
    plugins: [
      react(),
      sentryVitePlugin({
        org: "unifei-ut",
        project: "javascript-react",
        disable: mode === "development",
        authToken: process.env.VITE_SENTRY_AUTH_TOKEN,
        telemetry: false,
        release: {
          dist: "main",
          name: "main",
        },
      }),
    ],
  
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
        "@apis": "/src/apis",
        "@docs": "/src/docs",
      },
    },
  
    build: {
      sourcemap: true,
    },
  });
}
