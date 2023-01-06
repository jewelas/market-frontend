/// <reference types="next" />
/// <reference types="next/types/global" />

declare module '*.graphql' {
  import {DocumentNode} from 'graphql';
  const Schema: DocumentNode;

  export = Schema;
}

interface Window {
  ethereum?: {
    isMetaMask?: true;
    on?: (...args: any[]) => void;
    removeListener?: (...args: any[]) => void;
    autoRefreshOnNetworkChange?: boolean;
  };
  web3?: {};
}

declare module 'react-dplayer';
declare module 'read-file';

declare namespace NodeJS {
  export interface Global {
    mongoose: any;
  }
}
