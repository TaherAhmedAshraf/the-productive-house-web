/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Disables ESLint during `next build` to avoid build failures from linting
        // issues. This keeps ESLint available for local linting but prevents
        // Next.js from running it as part of the production build.
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;
