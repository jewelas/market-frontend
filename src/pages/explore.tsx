import React, {useEffect} from 'react';
import {Layout} from 'components/Layout';
import {AllMedia} from 'components/AllMedia';
import {ZeroState} from 'components/ZeroState';
import {useMedia} from 'contexts/Media.context';

const Explore = () => {
  const [{allMetadata}, , loadMedia] = useMedia();

  useEffect(() => loadMedia(), []);
  console.log('Hello World')

  return (
    <Layout title={'Rowket Marketplace'}>
      <div className="my-12 mx-auto px-4 md:px-12">
        {allMetadata.length > 0 ? (
          <AllMedia media={allMetadata} />
        ) : (
          <ZeroState title="No minted NFTs." hint="Why not try minting some?" />
        )}
      </div>
    </Layout>
  );
};

export default Explore;
