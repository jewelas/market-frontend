import {FC} from 'react';
import {AbstractConnector} from '@web3-react/abstract-connector';

type WalletPendingProps = {
  connector?: AbstractConnector;
  error?: boolean;
  setPendingError: (error: boolean) => void;
  tryActivation: (connector: AbstractConnector) => void;
};

export const WalletPending: FC<WalletPendingProps> = ({
  error,
  connector,
  setPendingError,
  tryActivation,
}) => {
  return (
    <div className="pt-4">
      {error ? (
        <div className="flex">
          <div className="mr-2">Error connecting.</div>
          <button
            type="button"
            className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={() => {
              setPendingError(false);
              connector && tryActivation(connector);
            }}>
            Try Again
          </button>
        </div>
      ) : (
        <>Connecting wallet...</>
      )}
    </div>
  );
};
