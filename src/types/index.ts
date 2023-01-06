import {AbstractConnector} from '@web3-react/abstract-connector';

export type WalletInfo = {
  connector?: AbstractConnector;
  name: string;
  iconName: string;
  description: string;
  href: string | null;
  color: string;
  primary?: boolean;
  mobile?: boolean;
  mobileOnly?: boolean;
};
