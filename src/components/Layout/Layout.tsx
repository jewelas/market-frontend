import React, {FC} from 'react';
// import {Banner} from 'components/Banner';
import {Footer} from 'components/Footer';
import {Header} from 'components/Header';
import {useModal} from 'contexts/Modal.context';

import {WalletModal} from 'components/Wallet';
import {useWeb3React} from '@web3-react/core';
import Head from 'next/head';

const TITLE = 'RowketMarket';
const DESCRIPTION =
  'Rowket is a community driven NFT marketplace with a native instant yield Token built on Binance Smart Chain.';
const URL = 'https://rowket.org';
const IMAGE = `/twitter_banner.jpeg`;

interface ILayoutProps {
  hideFooter?: boolean;
  title?: string;
  description?: string;
  url?: string;
  image?: string;
}

const Layout: FC<ILayoutProps> = ({
  children,
  hideFooter,
  title = TITLE,
  description = DESCRIPTION,
  url = URL,
  image = IMAGE,
}) => {
  const {account} = useWeb3React();
  const [{isOpen}, toggleModal] = useModal();
  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:site_name" content="Rowket Market" />
        <meta name="description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />
        <meta property="og:description" content={description} />
        <meta property="twitter:image" content={image} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:site" content="@RowketMarket" />
        <meta property="twitter:card" content="summary" />
      </Head>
      <div className="flex flex-col h-screen">
        <div className="flex flex-col flex-grow-0">
          {/* <Banner /> */}
          <Header openWallet={() => toggleModal(true)} account={account} />
        </div>
        <main className="flex-grow">{children}</main>
        {!hideFooter && <Footer />}
      </div>
      <WalletModal isOpen={isOpen} onClose={() => toggleModal(false)} />
    </div>
  );
};

export default Layout;
