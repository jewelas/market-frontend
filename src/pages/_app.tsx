import {AppProps} from 'next/app';
import {createWeb3ReactRoot, Web3ReactProvider} from '@web3-react/core';

import {ModalProvider} from 'contexts/Modal.context';
import {MediaProvider} from 'contexts/Media.context';

import {NetworkContextName} from 'utils/constants';
import {getLibrary} from 'utils/getLibrary';
import 'tailwindcss/tailwind.css';
import {UserProvider} from 'contexts/User.context';
import {MarketProvider} from 'contexts/Market.context';
import React from 'react';
import { ToastProvider } from 'react-toast-notifications';

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

if (typeof window !== 'undefined' && !!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false;
}

function MyApp({Component, pageProps}: AppProps) {
  return (
    <ToastProvider>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <MediaProvider>
          <MarketProvider>
            <UserProvider>
              <ModalProvider>
                  <Component {...pageProps} />
              </ModalProvider>
            </UserProvider>
          </MarketProvider>
        </MediaProvider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
    </ToastProvider>
  );
}

export default MyApp;
