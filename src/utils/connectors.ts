import {InjectedConnector} from '@web3-react/injected-connector';
import {NetworkConnector} from '@web3-react/network-connector';
import {WalletConnectConnector} from '@web3-react/walletconnect-connector';
import {WalletLinkConnector} from '@web3-react/walletlink-connector';

const POLLING_INTERVAL = 12000;

const RPC_URLS = {
  97: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
  56: `https://bsc-dataseed.binance.org/`,
};

export const network = new NetworkConnector({
  urls: {56: RPC_URLS[56], 97: RPC_URLS[97]},
  defaultChainId: 56,
});

const newWalletConnect = () =>
  new WalletConnectConnector({
    rpc: {56: RPC_URLS[56], 97: RPC_URLS[97]},
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true,
    pollingInterval: POLLING_INTERVAL,
  });

const newWalletLink = () =>
  new WalletLinkConnector({
    url: RPC_URLS[56],
    appName: 'Rowket Marketplace',
  });

export const injected = new InjectedConnector({
  supportedChainIds: [56, 97],
});

// Fixes https://github.com/NoahZinsmeister/web3-react/issues/124
// You can close and open walletconnect at will with this fix
export let walletconnect = newWalletConnect();
export let walletlink = newWalletLink();

export const resetWalletConnect = () => {
  walletconnect = newWalletConnect();
};

export const resetWalletLink = () => {
  walletlink = newWalletLink();
};
