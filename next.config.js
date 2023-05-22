/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',

    runtimeCaching: [
        {
            urlPattern: /^http:\/\/localhost:3001\//,
            handler: 'NetworkFirst',
            method: 'GET',
            options: {
                cacheName: 'api-cache',
                expiration: {
                    maxEntries: 60,
                    maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
                },
                networkTimeoutSeconds: 5,
            },
        },
    ],
});

const nextConfig = {
    compiler: {
        styledComponents: true,
    },
};

module.exports = withPWA(nextConfig);
