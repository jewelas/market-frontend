import React, {useEffect} from 'react';
import {Layout} from 'components/Layout';
import {ZeroState} from 'components/ZeroState';
import {useUserHook} from 'contexts/User.context';
import {useRouter} from 'next/router';

const User = () => {
  const router = useRouter();
  const [, loadCurrentUser] = useUserHook();

  useEffect(() => loadCurrentUser(router.query.id), []);

  return (
    <Layout title={'Rowket Marketplace'}>
      <div className="md:container mx-auto my-12">
        {/* {data.length > 0 ? (
          <AllMedia data={data} title={'Recent artworks'} />
        ) : ( */}
        <ZeroState title="No minted NFTs." hint="Why not try minting some?" />
        {/* )} */}
      </div>
    </Layout>
  );
};

export default User;
