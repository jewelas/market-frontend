import React, {useEffect, useState, FC, useCallback} from 'react';
import {UnsupportedChainIdError, useWeb3React} from '@web3-react/core';
import {AbstractConnector} from '@web3-react/abstract-connector';
import {getExplorerLink, getNetworkName, shortenAddress} from 'utils/';
import {DEFAULT_NETWORK, SUPPORTED_WALLETS} from 'utils/constants';
import {isMobile} from 'react-device-detect';
import {WalletOption} from 'components/Wallet/Option';
import {injected, walletlink} from 'utils/connectors';
import {WalletPending} from 'components/Wallet/Pending';
import usePrevious from 'hooks/usePrevious';
import {useEagerConnect, useInactiveListener} from 'hooks/useWeb3';
import {Dialog} from '@headlessui/react';
import useClipboard from 'hooks/useClipboard';
import {Modal} from 'components/Modal';

type WalletProps = {
  isOpen: boolean;
  onClose: () => void;
};

const WALLET_VIEWS = {
  OPTIONS: 'options',
  OPTIONS_SECONDARY: 'options_secondary',
  ACCOUNT: 'account',
  PENDING: 'pending',
};

export const WalletModal: FC<WalletProps> = ({isOpen, onClose}) => {
  const {account, connector, chainId, activate, error, active} = useWeb3React();
  const [, setCopied] = useClipboard();
  const [selectedNetworkName, setSelectedNetworkName] = useState<string>();

  const [copyText, setCopyText] = useState<string>('Copy Address');
  const [walletView, setWalletView] = useState<string>(WALLET_VIEWS.ACCOUNT);
  const [pendingWallet, setPendingWallet] = useState<
    AbstractConnector | undefined
  >();
  const [pendingError, setPendingError] = useState<boolean>();
  const [activatingConnector, setActivatingConnector] = useState<any>();

  const [explorerLink, setExplorerLink] = useState('');

  const previousAccount = usePrevious(account);

  useEffect(() => {
    const loadNetworkURL = async () => {
      setExplorerLink(await getExplorerLink(chainId!, account!));
    };
    loadNetworkURL();
  }, [account, chainId]);

  useEffect(() => {
    const getCurrentNetworkName = async () => {
      setSelectedNetworkName(await getNetworkName(chainId || DEFAULT_NETWORK));
    };
    getCurrentNetworkName();
  }, [chainId]);

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  useEffect(() => {
    if (account && !previousAccount && isOpen) {
      onClose();
    }
  }, [account, previousAccount, onClose, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setPendingError(false);
      setWalletView(WALLET_VIEWS.ACCOUNT);
    }
  }, [isOpen]);

  const activePrevious = usePrevious(active);
  const connectorPrevious = usePrevious(connector);

  useEffect(() => {
    if (
      isOpen &&
      ((active && !activePrevious) ||
        (connector && connector !== connectorPrevious && !error))
    ) {
      setWalletView(WALLET_VIEWS.ACCOUNT);
    }
  }, [
    setWalletView,
    isOpen,
    active,
    error,
    connector,
    activePrevious,
    connectorPrevious,
  ]);

  const handleWalletChange = useCallback(() => {
    setWalletView(WALLET_VIEWS.OPTIONS);
  }, []);

  const handleCopyAction = useCallback(() => {
    setCopied(account!);
    setCopyText('Copied!');
    setTimeout(() => {
      setCopyText(copyText);
    }, 1000);
  }, [account, copyText, setCopied]);

  const tryActivation = async (connector: AbstractConnector | undefined) => {
    Object.keys(SUPPORTED_WALLETS).map(key => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return SUPPORTED_WALLETS[key].name;
      }
      return true;
    });
    setPendingWallet(connector); // set wallet for pending view
    setWalletView(WALLET_VIEWS.PENDING);

    connector &&
      activate(connector, undefined, true).catch(error => {
        if (error instanceof UnsupportedChainIdError) {
          activate(connector); // a little janky...can't use setError because the connector isn't set
        } else {
          setPendingError(true);
        }
      });
  };

  function formatConnectorName() {
    // @ts-ignore
    const {ethereum} = typeof window !== 'undefined';
    const isMetaMask = !!(ethereum && ethereum.isMetaMask);
    const name: string = Object.keys(SUPPORTED_WALLETS)
      .filter(
        k =>
          SUPPORTED_WALLETS[k].connector === connector &&
          (connector !== injected || isMetaMask === (k === 'METAMASK')),
      )
      .map(k => SUPPORTED_WALLETS[k].name)[0];
    return <div>Connected with {name.toString()}</div>;
  }

  const isTriedEager = useEagerConnect();
  useInactiveListener(!isTriedEager || !!activatingConnector);

  const getOptions = () => {
    let isMetamask: boolean = false;
    if (typeof window !== 'undefined') {
      // @ts-ignore
      isMetamask = window?.ethereum?.isMetaMask;
    }

    return Object.keys(SUPPORTED_WALLETS).map(key => {
      const option = SUPPORTED_WALLETS[key];

      if (isMobile) {
        // @ts-ignore
        if (!window?.web3 && !window?.ethereum && option.mobile) {
          return (
            <WalletOption
              onClick={() => {
                option.connector !== connector &&
                  !option.href &&
                  tryActivation(option.connector);
              }}
              id={`connect-${key}`}
              key={key}
              active={option.connector && option.connector === connector}
              color={option.color}
              link={option.href}
              header={option.name}
              subheader={option.description}
              // icon={require('../../assets/svgs/' + option.iconName).default}
            />
          );
        }
        return null;
      }

      // overwrite injected when needed
      if (option.connector === injected) {
        // don't show injected if there's no injected provider
        // @ts-ignore
        if (
          typeof window !== 'undefined' &&
          !(window?.web3 || window?.ethereum)
        ) {
          if (option.name === 'MetaMask') {
            return (
              <WalletOption
                id={`connect-${key}`}
                key={key}
                color={'#E8831D'}
                header={'Install Metamask'}
                subheader={option.description}
                link={'https://metamask.io/'}
                // icon={require('../../assets/svgs/' + option.iconName).default}
              />
            );
          } else {
            return null; //dont want to return install twice
          }
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === 'MetaMask' && !isMetamask) {
          return null;
        }
        // likewise for generic
        else if (option.name === 'Injected' && isMetamask) {
          return null;
        }
      }

      // return rest of options
      return (
        !isMobile &&
        !option.mobileOnly && (
          <WalletOption
            id={`connect-${key}`}
            onClick={() => {
              option.connector === connector
                ? setWalletView(WALLET_VIEWS.ACCOUNT)
                : !option.href && tryActivation(option.connector);
            }}
            key={key}
            active={option.connector === connector}
            color={option.color}
            link={option.href}
            header={option.name}
            subheader={option.description} //use option.descriptio to bring back multi-line
            // icon={require('../../assets/svgs/' + option.iconName).default}
          />
        )
      );
    });
  };

  return (
    <Modal onClose={onClose} open={isOpen}>
      <div className="inline-block align-center bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-sm w-full md:max-w-xs sm:p-6">
        {walletView === WALLET_VIEWS.ACCOUNT && account ? (
          <div className="">
            <Dialog.Title
              as="h3"
              className="text-lg leading-6 font-medium text-gray-900">
              Account
            </Dialog.Title>
            <div className="mt-2">
              <div className="flex align-center justify-between">
                <small className="text-gray-500">{formatConnectorName()}</small>
                <>
                  {connector !== injected && connector !== walletlink && (
                    <button
                      type="button"
                      onClick={() => {
                        (connector as any).close();
                      }}
                      className="inline-flex text-red-700 px-2 justify-center rounded-xl border border-transparent bg-white-600 text-base font-medium text-gray focus:outline-none focus:ring-2 sm:text-sm">
                      disconnect
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleWalletChange}
                    className="inline-flex justify-center rounded-xl border border-transparent bg-white-600 text-base font-medium text-gray focus:outline-none focus:ring-2 sm:text-sm">
                    Change
                  </button>
                </>
              </div>
              <span className="text-2xl">{shortenAddress(account)}</span>
              <div className="flex align-center pt-4">
                <span
                  onClick={handleCopyAction}
                  className="text-gray-600 mr-4 text-sm cursor-pointer">
                  {copyText}
                </span>
                <a
                  href={explorerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 text-sm cursor-pointer">
                  View on Etherscan
                </a>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="sm:mt-5">
            <Dialog.Title
              as="h3"
              className="text-lg leading-6 font-medium text-gray-900">
              Network Error
            </Dialog.Title>
            <div className="mt-5 sm:mt-6">
              <div className="flex align-center justify-between">
                {error instanceof UnsupportedChainIdError ? (
                  <span>
                    App is running on{' '}
                    <span className="font-bold">{selectedNetworkName}</span>.
                    Please update your network configuration.
                  </span>
                ) : (
                  'Error connecting. Try refreshing the page.'
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <Dialog.Title
              as="h3"
              className="text-lg leading-6 font-medium text-gray-900">
              Connect Wallet
            </Dialog.Title>
            <div className="mt-3">
              {walletView === WALLET_VIEWS.PENDING ? (
                <WalletPending
                  connector={pendingWallet}
                  error={pendingError}
                  setPendingError={setPendingError}
                  tryActivation={tryActivation}
                />
              ) : (
                <>{getOptions()}</>
              )}
            </div>
            {walletView !== WALLET_VIEWS.PENDING && (
              <small>
                New to Ethereum?{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://ethereum.org/wallets/">
                  Learn more about wallets
                </a>
              </small>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
