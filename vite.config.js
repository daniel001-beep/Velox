/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', 
  // IMPORTANT: Replace 'my-nextjs-project' with your actual GitHub repository name
  basePath: '/Redstore', 
  images: {
    unoptimized: true, 
  },
};

export default nextConfig;