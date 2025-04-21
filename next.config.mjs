/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
    imageSizes: [],
    deviceSizes: [384, 640, 768, 1080, 1920], // 384를 추가
  },
};

export default nextConfig;
