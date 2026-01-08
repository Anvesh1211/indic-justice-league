import react from '@vitejs/plugin-react';

/** @type {import('vite').UserConfig} */
export default {
  // Disable React Refresh HMR preamble to avoid preamble detection errors
  plugins: [react({ fastRefresh: false })],
};
