import {KET_ADDRESS, MARKET_ADDRESS} from 'config';
import {useContract} from 'hooks/useContract';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import * as MarketABI from 'services/abis/Market.json';
import * as TokenABI from 'services/abis/ERC20.json';
import {MaxUint256} from '@ethersproject/constants';

const MarketContext = createContext<any[]>([]);

const useMarketContext = () => useContext(MarketContext);

const initialState = () => ({
  media: {
    token: '',
    amount: '',
  },
});

const UPDATE_MARKET = 'market/UPDATE';

const reducer = (
  state: any,
  {
    type,
    payload,
  }: {
    type: string;
    payload: any;
  },
) => {
  switch (type) {
    case UPDATE_MARKET:
      return {
        ...state,
        ...payload,
      };
    default: {
      throw new Error(`Unknown action type ${type}`);
    }
  }
};

export function MarketProvider({children}: any) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const update = useCallback((payload: any) => {
    dispatch({
      type: UPDATE_MARKET,
      payload,
    });
  }, []);

  return (
    <MarketContext.Provider
      value={useMemo(() => [state, {update}], [state, update])}>
      {children}
    </MarketContext.Provider>
  );
}

export const useMarket = () => {
  const [state, {update}] = useMarketContext();
  const marketContract = useContract(MARKET_ADDRESS, MarketABI.abi);
  const tokenContract = useContract(KET_ADDRESS, TokenABI.abi);

  const getTokenPrice = async (id: string) => {
    const tokenAskInformation = await marketContract?.currentAskForToken(id);
    update({
      media: {
        token: tokenAskInformation?.currency,
        amount: tokenAskInformation?.amount.toString(),
      },
    });
  };

  const approveToken = async () => {
    await tokenContract?.approve(marketContract?.address, MaxUint256);
  };

  return [state, getTokenPrice, approveToken];
};
