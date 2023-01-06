module.exports = {
  async rewrites() {
    return [
      {
        source: '/upload-artwork',
        destination: '/mint',
      },
    ];
  },
  webpack: (config, {isServer}) => {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    });
    if (!isServer) {
      config.node = {
        fs: 'empty',
      };
    }
    return config;
  },
  webpackDevMiddleware: config => {
    return config;
  },
  publicRuntimeConfig: {
    ROWKET_NFT_ADDRESS: process.env.ROWKET_NFT_ADDRESS,
    ROWKET_MASTER_ADDRESS: process.env.ROWKET_MASTER_ADDRESS,
    ROWKET_MARKETPLACE_ADDRESS: process.env.ROWKET_MARKETPLACE_ADDRESS,
    ROWKET_NFT_MARKETPLACE_ADDRESS: process.env.ROWKET_NFT_MARKETPLACE_ADDRESS,
    GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT,
    MARKET: process.env.MARKET,
    MEDIA: process.env.MEDIA,
    KET: process.env.KET,
    FLEEK_API_KEY: process.env.FLEEK_API_KEY,
    FLEEK_API_SECRET: process.env.FLEEK_API_SECRET,
    API_ENDPOINT: process.env.API_ENDPOINT,
  },
};
