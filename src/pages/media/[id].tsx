import {Layout} from 'components/Layout';
import React, {useEffect, useState} from 'react';
import {User} from 'components/User';
import {Table} from 'components/Table';
import {useContract} from 'hooks/useContract';
import {API_ENDPOINT, KET_ADDRESS, MEDIA_ADDRESS} from 'config';
import * as MediaABI from 'services/abis/Media.json';
import {GetServerSideProps} from 'next';
import {parseEther} from '@ethersproject/units';
import {useWeb3React} from '@web3-react/core';
import {useMarket} from 'contexts/Market.context';
import {ethers} from 'ethers';
import {constructBid, Decimal} from '@zoralabs/zdk';
import axios from 'axios';
import {Loading} from 'components/Loading';
import {useToasts} from 'react-toast-notifications';

const MediaDetail = ({id}: any) => {
  const [contractData, setContractData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const {account} = useWeb3React();
  const {addToast} = useToasts();
  const mediaContract = useContract(MEDIA_ADDRESS, MediaABI.abi);

  const [
    {
      media: {token, amount},
    },
    getPrice,
    approveToken,
  ] = useMarket();

  useEffect(() => {
    const loadContractData = async () => {
      setLoading(true);
      const {data} = await axios.get(`/api/media/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const {media, bids} = data.data;
      const owner_address = await mediaContract?.ownerOf(media?.media_id);
      const creator = await mediaContract?.tokenCreators(media?.media_id);
      const contract_address = await mediaContract?.address;
      setContractData({
        owner_address,
        contract_address,
        media,
        bids,
        creator,
        isOwner: account === owner_address,
      });
      setLoading(false);
    };
    loadContractData();
  }, [id, mediaContract]);

  useEffect(() => {
    const getTokenMarketInformation = async () => {
      await getPrice(contractData?.media?.media_id);
    };
    getTokenMarketInformation();
  }, [contractData]);

  const setAsk = async (e: any) => {
    e.preventDefault();
    const price = await window.prompt('Enter ask price');
    const transaction = await mediaContract?.setAsk(
      contractData?.media?.media_id,
      {
        amount: parseEther(price!),
        currency: KET_ADDRESS,
      },
    );
    await transaction?.wait(1);
    addToast('Asking price has been set.', {appearance: 'success'});
  };

  const removeAsk = async (e: any) => {
    e.preventDefault();
    const transaction = await mediaContract?.removeAsk(
      contractData?.media?.media_id,
    );
    await transaction?.wait(1);
    addToast('Asking price has been removed.', {appearance: 'success'});
  };

  const acceptBid = async (media: any) => {
    try {
      const bidder = media.bidder;
      const bid = constructBid(
        KET_ADDRESS,
        Decimal.new(media.price!).value,
        bidder,
        bidder,
        0,
      );
      const transaction = await mediaContract?.acceptBid(media?.media_id, bid);
      await transaction?.wait(2);
      addToast('Bid has been accepted', {appearance: 'success'});
    } catch (error) {
      console.log(error);
    }
  };

  const setBid = async (e: any) => {
    e.preventDefault();
    const price = await window.prompt('Enter bid price');
    try {
      await approveToken();
      const bid = constructBid(
        KET_ADDRESS,
        Decimal.new(price!).value,
        account!,
        account!,
        0,
      );
      const transaction = await mediaContract?.setBid(
        contractData?.media?.media_id,
        bid,
        {from: account},
      );
      await transaction?.wait(1);
      await axios.post(
        `${API_ENDPOINT}api/media/bid`,
        JSON.stringify({
          media_id: contractData?.media?.media_id,
          bidder: account,
          price,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      addToast('Your bid has been captured.', {appearance: 'success'});
    } catch (e) {
      addToast('An error occured. Please try again', {appearance: 'error'});
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Layout
      title={`${contractData?.media?.metadata?.title} | Rowket Marketplace`}>
      <>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <div className="flex flex-col md:flex-row -mx-4">
              <div className="md:flex-1 px-4">
                <div>
                  <div className="rounded-lg mb-4">
                    {contractData?.media?.metadata?.mime_type?.startsWith(
                      'image',
                    ) ? (
                      <img
                        className="rounded-lg w-full object-cover"
                        src={contractData?.media?.media_url}
                      />
                    ) : contractData?.media?.metadata?.mime_type?.startsWith(
                        'audio',
                      ) ? (
                      <audio className="object-cover h-64" controls>
                        <source
                          src={contractData?.media?.media_url}
                          type={contractData?.media?.metadata?.mime_type}
                        />
                      </audio>
                    ) : contractData?.media?.metadata?.mime_type?.startsWith(
                        'video',
                      ) ? (
                      <video className="w-full" autoPlay playsInline loop>
                        <source
                          src={contractData?.media?.media_url}
                          type={contractData?.media?.metadata?.mime_type}
                        />
                      </video>
                    ) : contractData?.media?.metadata?.mime_type === '' ? (
                      <div
                        style={{
                          width: 300,
                        }}
                        className="flex justify-center items-center h-64">
                        <div className="px-3 py-12">No media selected.</div>
                      </div>
                    ) : (
                      <div
                        style={{
                          width: 300,
                        }}
                        className="flex justify-center items-center h-64">
                        <div className="px-3 py-12">
                          Unsupported file type (
                          {contractData?.media?.metadata?.mime_type}). <br />
                          <a
                            href={contractData?.media?.metadata?.mime_type}
                            target="_blank"
                            rel="noopener noreferrer">
                            Direct link
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="md:flex-1 px-4">
                <h2 className="mb-2 leading-tight tracking-tight font-bold text-gray-800 text-2xl md:text-3xl">
                  {contractData?.media?.metadata?.title}
                </h2>
                <User address={contractData?.creator} showAddress />

                {token && amount && (
                  <div className="flex items-center space-x-4 my-4">
                    <div>
                      <div className="rounded-lg flex py-2">
                        <span className="font-bold text-indigo-600 text-3xl">
                          {ethers.utils.formatEther(amount)}
                        </span>
                        <span className="text-indigo-400 mr-1 mt-2">KET</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-4 my-4">
                  <p className="text-gray-500">
                    {contractData?.media?.metadata?.description}
                  </p>
                </div>

                {account && (
                  <div className="flex py-4 space-x-4">
                    {contractData?.isOwner && (
                      <button
                        type="button"
                        onClick={(e: any) => setAsk(e)}
                        className="h-14 px-6 py-2 outline-none font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white">
                        Set Ask
                      </button>
                    )}
                    {contractData?.isOwner && amount && token && (
                      <button
                        type="button"
                        onClick={(e: any) => removeAsk(e)}
                        className="h-14 px-6 py-2 outline-none font-semibold rounded-xl bg-red-600 hover:bg-red-500 text-white">
                        Remove Ask
                      </button>
                    )}
                    {amount && token && (
                      <button
                        type="button"
                        onClick={(e: any) => setBid(e)}
                        className="h-14 px-6 py-2 outline-none font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white">
                        Bid
                      </button>
                    )}
                  </div>
                )}
                <div className="overflow-hidden sm:rounded-lg pt-4">
                  <div className="border-t border-b border-gray-200 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">
                          NFT Contract Address
                        </dt>
                        <dd className="mt-1 text-sm text-right text-gray-900 sm:mt-0 sm:col-span-2">
                          {contractData?.contract_address}
                        </dd>
                      </div>
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">
                          Token ID
                        </dt>
                        <dd className="mt-1 text-sm text-right text-gray-900 sm:mt-0 sm:col-span-2">
                          {contractData?.media?.media_id}
                        </dd>
                      </div>
                      {/* <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">
                          Creator's Address
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {contractData.creator_address}
                        </dd>
                      </div> */}
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">
                          Owner Address
                        </dt>
                        <dd className="mt-1 text-sm text-right text-gray-900 sm:mt-0 sm:col-span-2">
                          {contractData?.owner_address}
                        </dd>
                      </div>
                      {/* <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">
                          Explorer
                        </dt>
                        <dd className="mt-1 text-sm text-right text-gray-900 sm:mt-0 sm:col-span-2">
                          -{' '}
                        </dd>
                      </div> */}
                    </dl>
                  </div>
                  <div className="mt-8 w-full">
                    <Table
                      title={'Bidding'}
                      data={contractData?.bids}
                      acceptBid={acceptBid}
                      isOwner={contractData?.isOwner}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </Layout>
  );
};
export const getServerSideProps: GetServerSideProps = async ({params}) => {
  return {
    props: {
      id: params?.id,
    },
  };
};
export default MediaDetail;
