/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com", // ✅ 외부 이미지 허용 도메인 추가
      },
    ],
  },
};

export default nextConfig;
