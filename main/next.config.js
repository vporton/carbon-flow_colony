const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')
require('dotenv').config({ path: '../.env' })

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        if (isServer) {
          config.plugins = [...config.plugins, new PrismaPlugin()];
        }
        return config;
    },    
}

module.exports = nextConfig
