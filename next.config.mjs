/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "storage.googleapis.com", // Google Cloud Storage 도메인 추가
    ],
  },
};

export default nextConfig;
