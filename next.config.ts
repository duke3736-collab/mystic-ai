import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: true, // PWA 비활성화 - 서비스워커 캐시가 API 라우트 충돌 유발
  register: false,
});

const nextConfig: NextConfig = {
  turbopack: {},
};

export default withPWA(nextConfig);
