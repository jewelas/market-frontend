import {DEFAULT_NETWORK} from './constants';

export const shortenAddress = (address: string) => {
  return `${address?.substring(0, 6)}...${address?.substring(
    address?.length - 4,
  )}`;
};

export const getNetworkDetails = async (provider: any, address: string) => {
  try {
    let currentNetwork = await provider.getNetwork();
    if (currentNetwork.chainId !== Number(DEFAULT_NETWORK)) {
      return {
        error: `Wrong network selected. Please make sure you are on ${await getNetworkName(
          Number(DEFAULT_NETWORK),
        )}`,
      };
    }
    return {
      currentNetwork,
      networkAddress: address,
      currentBalance: await provider.getBalance(address), // ether balance
    };
  } catch (error) {
    return {
      error: `Unable to detect Web3 on browser`,
    };
  }
};

export const getNetworkName = async (id: string | number) => {
  let link: string;
  switch (id) {
    case 1:
      link = 'Main Network';
      break;
    case 56:
      link = 'Binance Smart Chain Main Network';
      break;
    case 97:
      link = 'Binance Smart Chain Test Network';
      break;
    default:
      link = 'Local Testnet Network';
      break;
  }
  return link as string;
};

export const getExplorerLink = async (
  id: string | number | undefined,
  address: string,
) => {
  let link: string;
  switch (id) {
    case 1:
      link = `https://etherscan.io/address/${address}`;
      break;
    case 3:
      link = `https://ropsten.etherscan.io/address/${address}`;
      break;
    case 4:
      link = `https://rinkeby.etherscan.io/address/${address}`;
      break;
    case 42:
      link = `https://kovan.etherscan.io/address/${address}`;
      break;
    default:
      link = 'Unknown network';
      break;
  }

  return link as string;
};

export const getFileBuffer = async (file: any) => {
  return new Promise((res, rej) => {
    // create file reader
    let reader = new FileReader();

    // register event listeners
    reader.addEventListener('loadend', (e: any) => res(e.target.result));
    reader.addEventListener('error', rej);

    // read file
    reader.readAsArrayBuffer(file);
  });
};

export const getTokenId = (transaction: any) => {
  for (const event of transaction.events) {
    if (event.event !== 'Transfer') {
      continue;
    }

    return event.args.tokenId.toString();
  }
  throw new Error('Unable to get token id');
};

export const getBidder = (transaction: any) => {
  for (const event of transaction.events) {
    if (event.event !== 'Transfer') {
      continue;
    }

    return event;
  }
  throw new Error('Unable to get token id');
};
