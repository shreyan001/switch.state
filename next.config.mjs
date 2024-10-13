/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    // Disable ESLint during builds
    eslint: {
        ignoreDuringBuilds: true,
    },
    // Disable TypeScript type checking during builds
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
