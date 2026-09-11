import { existsSync } from "node:fs";

// The Angular CLI does not read .env files, so load it here. Variables already set in the shell win.
const envFile = new URL(".env", import.meta.url);

if (existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

/** Dev-server proxy: keeps /api same-origin so the HttpOnly refresh cookie reaches the API. */
export default {
  "/api": {
    target: process.env.API_URL ?? "http://localhost:8080",
    secure: false,
    changeOrigin: true,
  },
};
