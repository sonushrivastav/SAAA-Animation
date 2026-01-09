/** @type {import('next').NextConfig} */
const nextConfig = {
    // images: {
    //     remotePatterns: [
    //         {
    //             protocol: 'http',
    //             hostname: '192.168.0.200' || 'localhost',
    //             port: '1337',
    //             pathname: '/uploads/**',
    //         },
    //     ],
    // },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'admin.saaaconsultants.com',
            },
        ],
    },
};

export default nextConfig;
