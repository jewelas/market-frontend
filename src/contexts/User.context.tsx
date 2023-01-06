import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';

import axios from 'axios';

import {useWeb3React} from '@web3-react/core';

const UserContext = createContext<any[]>([]);

const useUserContext = () => useContext(UserContext);

const initialState = () => ({
  user: {},
});

const UPDATE_USER = 'user/UPDATE';

const reducer = (
  state: any,
  {
    type,
    payload,
  }: {
    type: string;
    payload: {user: any};
  },
) => {
  const {user} = payload;
  switch (type) {
    case UPDATE_USER:
      return {
        ...state,
        user,
      };
    default: {
      throw new Error(`Unknown action type ${type}`);
    }
  }
};

export function UserProvider({children}: any) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const update = useCallback((payload: any) => {
    dispatch({
      type: UPDATE_USER,
      payload,
    });
  }, []);

  return (
    <UserContext.Provider
      value={useMemo(() => [state, {update}], [state, update])}>
      {children}
    </UserContext.Provider>
  );
}

export const useUserHook = () => {
  const [state, {update}] = useUserContext();
  const {account} = useWeb3React();

  const findOrCreateUserData = async (account: string) => {
    const {data} = await axios.post(`/api/user/create`, JSON.stringify(account), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    update({...state, user: data.data});
  }

  const loadCurrentUser = async () => {
    const {data} = await axios.get(`/api/user/${account}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    update({...state, user: data.data});
  };

  return [state, loadCurrentUser, findOrCreateUserData];
};
