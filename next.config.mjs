/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // this is required for static export for my to remember  
  },
};

export default nextConfig;