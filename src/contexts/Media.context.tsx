import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';

import {
  constructMediaData,
  sha256FromBuffer,
  constructBidShares,
} from '@zoralabs/zdk';
import {MaxUint256} from '@ethersproject/constants';

import axios from 'axios';

import {getBidder, getFileBuffer, getTokenId} from 'utils';
import {useContract} from 'hooks/useContract';
import {MEDIA_ADDRESS} from 'config';

import * as MediaABI from 'services/abis/Media.json';
import * as ERC20ABI from 'services/abis/ERC20.json';

const MediaContext = createContext<any[]>([]);

const useMediaContext = () => useContext(MediaContext);

const initialState = () => ({
  transaction: {},
  mediaContract: {},
  allMetadata: [],
  owner: '',
  contract_address: '',
});

const UPDATE_WEB3 = 'web3/UPDATE';

const reducer = (
  state: any,
  {
    type,
    payload,
  }: {
    type: string;
    payload: {
      transaction: any;
      mediaContract: any;
      allMetadata: any[];
      owner: string;
      contract_address: string;
    };
  },
) => {
  const {
    transaction,
    mediaContract,
    allMetadata,
    owner,
    contract_address,
  } = payload;
  switch (type) {
    case UPDATE_WEB3:
      return {
        ...state,
        transaction,
        mediaContract,
        allMetadata,
        owner,
        contract_address,
      };
    default: {
      throw new Error(`Unknown action type ${type}`);
    }
  }
};

export function MediaProvider({children}: any) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const update = useCallback((payload: any) => {
    dispatch({
      type: UPDATE_WEB3,
      payload,
    });
  }, []);

  return (
    <MediaContext.Provider
      value={useMemo(() => [state, {update}], [state, update])}>
      {children}
    </MediaContext.Provider>
  );
}

export const useMedia = () => {
  const [state, {update}] = useMediaContext();
  const mediaContract = useContract(MEDIA_ADDRESS, MediaABI.abi);

  const loadMedia = async () => {
    const {data} = await axios.get('/api/media', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    update({...state, allMetadata: data.data});
  };

  const loadMediaBlockchainData = async (token_id: string) => {
    const owner = await mediaContract?.ownerOf(token_id);
    const contract_address = await mediaContract?.address;

    update({...state, owner, contract_address});
  };

  const setBid = async ({token_address}: {token_address: string}) => {
    const erc20 = useContract(token_address, ERC20ABI.abi);
    erc20?.approve(MEDIA_ADDRESS, MaxUint256);
    const transaction = await mediaContract?.setBid(state.media_id);
    const tx = await transaction?.wait(1);
    const bidder = await getBidder(tx);
    console.log(bidder);
  };

  const createMedia = async (
    upload: File,
    name: string,
    description: string,
    fee: any,
    account: string,
  ) => {
    const metadataJSON = JSON.stringify({
      description: description ? description : '',
      mimeType: upload.type,
      name,
    });

    const buffer: any = await getFileBuffer(upload);

    // Generate content hashes
    const contentHash = sha256FromBuffer(Buffer.from(buffer));
    const metadataHash = sha256FromBuffer(Buffer.from(metadataJSON));

    // Upload files to fleek
    let formData = new FormData();
    formData.append('upload', upload);
    formData.append('name', name);
    formData.append('metadata', metadataJSON);

    // Post upload endpoint
    const file = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Collect fileUrl and metadataUrl from Fleek
    const {fileUrl, metadataUrl} = file.data;

    // Construct mediaData object
    const mediaData = constructMediaData(
      fileUrl,
      metadataUrl,
      contentHash,
      metadataHash,
    );

    const shares = constructBidShares(
      0, // Creator share
      100 - parseFloat(fee), // Owner share
      parseFloat(fee), // Previous owner share
    );

    // Make transaction
    const tx = await mediaContract?.mint(mediaData, shares);
    const transaction = await tx.wait(2); // Wait 1 confirmation and throw user to next screen
    console.log(transaction);

    let tokenId: string = await getTokenId(transaction);

    update({...state, transaction});

    const saveRecord = await axios.post(
      '/api/media/create',
      {
        title: name,
        description,
        media_url: fileUrl,
        metadata_url: metadataUrl,
        mimeType: upload.type,
        creator: account,
        contentHash,
        metadataHash,
        tokenId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    console.log(saveRecord);
  };

  return [state, createMedia, loadMedia, loadMediaBlockchainData, setBid];
};
