import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget =
    (env.VITE_BACKEND_URL && String(env.VITE_BACKEND_URL).replace(/\/$/, "")) ||
    "http://localhost:4000";

  return {
    plugins: [tailwindcss(), react()],
    server: {
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          configure(proxy) {
            proxy.on("error", (err) => {
              const code = err?.code;
              if (code === "ECONNREFUSED" || code === "ETIMEDOUT") {
                console.warn(
                  `\n[vite] API not running at ${apiTarget} (${code}). ` +
                    `Start Express: cd server && npm run dev\n` +
                    `Or from project root: npm run dev (starts API + client).\n`
                );
              }
            });
          },
        },
      },
    },
  };
});
