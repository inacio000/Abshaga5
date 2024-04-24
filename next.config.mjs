/** @type {import('next').NextConfig} */
// const nextConfig = {
//     images: {
//         domains: [
//             "res.cloudinary.com"
//         ]
//     }
// };

// export default nextConfig;

// next.config.mjs
const nextConfig = {
    images: {
      // Deprecated configuration (remove after update)
      // domains: ['res.cloudinary.com'],
  
      // New recommended configuration
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
        },
      ],
    },
    // ... other Next.js configuration
  };
  
  export default nextConfig;
  