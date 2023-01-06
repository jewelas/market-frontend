import {FC, Fragment} from 'react';
import Blockies from 'react-blockies';
import {shortenAddress} from 'utils';

type UserProps = {
  address: string | null | undefined;
  showAddress?: boolean;
};

export const User: FC<UserProps> = ({address, showAddress}) => {
  return (
    <Fragment>
      {address && (
        <div className="flex space-x-2 items-center">
          <Blockies
            seed={address}
            className="inline-block h-6 w-6 rounded-full"
          />
          {showAddress && (
            <p className="text-sm font-medium text-gray-500">
              {shortenAddress(address)}
            </p>
          )}
        </div>
      )}
    </Fragment>
  );
};
