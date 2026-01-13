
import type {NextConfig} from 'next';
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});


const nextConfig: NextConfig = {
  /* config options here */
  publicRuntimeConfig: {
    firebaseConfig: {
      apiKey: "AIzaSyBFsWkjDCnq0dwCA182YW8HIw8V-s-_D20",
      authDomain: "studio-2322173444-3d6ba.firebaseapp.com",
      projectId: "studio-2322173444-3d6ba",
      storageBucket: "studio-2322173444-3d6ba.appspot.com",
      messagingSenderId: "1062085732383",
      appId: "1:1062085732383:web:014c2d46a815a513c1c4f5",
      measurementId: "G-9T4V5G43P9"
    }
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withPWA(nextConfig);
