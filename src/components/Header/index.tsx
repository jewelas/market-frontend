import {FC, Fragment} from 'react';
import {Popover, Transition} from '@headlessui/react';
import {MenuIcon} from '@heroicons/react/outline';
import {shortenAddress} from 'utils';
import {User} from 'components/User';

type HeaderProps = {
  openWallet: () => any;
  account: string | null | undefined;
};

export const Header: FC<HeaderProps> = ({openWallet, account}) => {
  return (
    <Popover className="relative bg-white">
      {({open}) => (
        <>
          <div className="flex justify-between items-center px-4 py-4 sm:px-6 md:justify-start md:space-x-10 border-b border-gray-200">
            <div>
              <a href="/" className="flex">
                <span className="sr-only">Rowket</span>
                <img
                  className="h-8 w-auto sm:h-10"
                  src="/logo.png"
                  alt="Rowket Logo"
                />
              </a>
            </div>
            <div className="-mr-2 -my-2 md:hidden">
              <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                <span className="sr-only">Open menu</span>
                <MenuIcon className="h-6 w-6" aria-hidden="true" />
              </Popover.Button>
            </div>
            <div className="hidden md:flex-1 md:flex md:items-center md:justify-between">
              <Popover.Group as="nav" className="flex space-x-10">
                {/* <a
                  href="#"
                  className="text-base font-medium text-gray-500 hover:text-gray-900">
                  Trending
                </a>
                <a
                  href="/explore"
                  className="text-base font-medium text-gray-500 hover:text-gray-900">
                  Explore
                </a> */}
              </Popover.Group>
              {account ? (
                <div className="flex items-center space-x-6">
                  <a
                    href="/upload-artwork"
                    className="ml-8 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-gray-500 bg-white-600">
                    Upload Artwork
                  </a>
                  <div
                    onClick={openWallet}
                    className="flex cursor-pointer items-center">
                    <User address={account} />
                    <span className="ml-2 font-medium">
                      {shortenAddress(account)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center md:ml-12">
                  <button
                    onClick={openWallet}
                    className="ml-8 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    Connect Wallet
                  </button>
                </div>
              )}
            </div>
          </div>

          <Transition
            show={open}
            as={Fragment}
            enter="duration-200 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-100 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95">
            <Popover.Panel
              focus
              static
              className="absolute z-50 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
              <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
                <div className="pt-5 pb-6 px-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <img
                        className="h-8 w-auto"
                        src="/logo.png"
                        alt="Rowket"
                      />
                    </div>
                    <div className="-mr-2">
                      <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                        <span className="sr-only">Close menu</span>
                      </Popover.Button>
                    </div>
                  </div>
                </div>
                <div className="py-6 px-5">
                  <div className="py-3">
                    {/* <a
                      href="#"
                      className="text-base font-medium text-gray-500 hover:text-gray-900">
                      Trending
                    </a> */}
                  </div>
                  <div className="py-3">
                    {/* <a
                      href="/explore"
                      className="text-base font-medium text-gray-500 hover:text-gray-900">
                      Explore
                    </a> */}
                  </div>
                  {account ? (
                    <div className="py-3">
                      <a
                        href="/upload-artwork"
                        className="text-base font-medium text-gray-500 hover:text-gray-900">
                        Upload Artwork
                      </a>
                      <div className="pt-4 cursor-pointer">
                        <div
                          onClick={openWallet}
                          className="flex space-x-4 items-center">
                          <User address={account} />
                          <span>{shortenAddress(account)}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6">
                      <button
                        onClick={openWallet}
                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                        Connect Wallet
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};
