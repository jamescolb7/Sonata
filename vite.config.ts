import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { expressDevServer } from 'remix-express-dev-server'
import { installGlobals } from "@remix-run/node";
import { envOnlyMacros } from 'vite-env-only';

installGlobals({ nativeFetch: true })

export default defineConfig({
  plugins: [
    expressDevServer(),
    envOnlyMacros(),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        unstable_singleFetch: true
      },
    }),
    tsconfigPaths(),
  ],
  optimizeDeps: {
    exclude: ["@node-rs/argon2", "@node-rs/bcrypt"]
  }
});
