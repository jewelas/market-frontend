export const Welcome = () => {
  return (
    <div className="relative bg-gray-50 overflow-hidden">
      <main className="my-16 mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block xl:inline">Rowket Market</span>{' '}
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Rowket is a community driven NFTs marketplace centered around the
            distribution of fan art in the form of NFTs. Build with ❤️ on
            Binance Smart Chain.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                Get started
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
