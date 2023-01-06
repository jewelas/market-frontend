import getConfig from 'next/config';

const {publicRuntimeConfig} = getConfig();

export const ROWKET_NFT_ADDRESS = publicRuntimeConfig.ROWKET_NFT_ADDRESS;
export const ROWKET_MASTER_ADDRESS = publicRuntimeConfig.ROWKET_MASTER_ADDRESS;
export const ROWKET_MARKETPLACE_ADDRESS =
  publicRuntimeConfig.ROWKET_MARKETPLACE_ADDRESS;
export const ROWKET_NFT_MARKETPLACE_ADDRESS =
  publicRuntimeConfig.ROWKET_NFT_MARKETPLACE_ADDRESS;

export const MARKET_ADDRESS = publicRuntimeConfig.MARKET;
export const MEDIA_ADDRESS = publicRuntimeConfig.MEDIA;
export const KET_ADDRESS = publicRuntimeConfig.KET;
export const FLEEK_API_KEY = publicRuntimeConfig.FLEEK_API_KEY;
export const FLEEK_API_SECRET = publicRuntimeConfig.FLEEK_API_SECRET;

export const API_ENDPOINT = publicRuntimeConfig.API_ENDPOINT;
