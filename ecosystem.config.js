// PM2 process configuration.
//
// Runs Next.js in cluster mode so the Node runtime uses every vCPU on the
// instance instead of a single core. PM2 also restarts the process if it
// crashes, which keeps the ALB target healthy between deploys.
//
// Usage on the instance:
//   pm2 start ecosystem.config.js
//   pm2 save
//   pm2 startup     # prints a command; run it to enable auto-start on reboot

module.exports = {
  apps: [
    {
      name: "portfolio",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: __dirname,
      instances: "max",
      exec_mode: "cluster",
      max_memory_restart: "400M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        // NEXT_PUBLIC_ASSET_PREFIX is baked in at build time, so it does
        // not need to be set here. Runtime env vars go here if added later.
      },
    },
  ],
};
