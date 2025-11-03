/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",          // tudo que começa com /api
        destination: "http://localhost:3000/api/:path*", // redireciona pro backend Express
      },
    ];
  },
};

export default nextConfig;
