/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // MUST be here for that script in your screenshot to work
  basePath: '/Redstore', 
  images: {
    unoptimized: true, 
  },
};

export default nextConfig;