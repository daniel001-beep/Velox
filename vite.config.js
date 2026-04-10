/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // This creates the 'out' folder
  basePath: '/Redstore', 
  images: {
    unoptimized: true, // Necessary for static hosting
  },
};

export default nextConfig;