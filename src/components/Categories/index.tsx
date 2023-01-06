const tabs = [
  {
    name: 'All',
    href: '?ref=all',
    current: true,
  },
  {
    name: 'Trending',
    href: '?ref=trending',
    current: false,
  },
  {
    name: 'All',
    href: '?ref=all',
    current: false,
  },
  {
    name: 'All',
    href: '?ref=all',
    current: false,
  },
];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export const Categories = () => {
  return (
    <>
      <div className="md:px-4 py-3 md:py-0 md:flex-grow order-3 md:order-2 overflow-scroll border-t-1 md:border-0">
        <div className="md:col-span-2">
          <nav className="md:flex space-x-6 md:justify-center">
            {tabs.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={classNames(
                  item.current ? '' : 'text-cyan-50 bg-opacity-0',
                  'inline-flex text-sm w-auto justify-center font-normal rounded-md bg-gray-300 px-3 py-2 hover:bg-opacity-10',
                )}
                aria-current={item.current ? 'page' : undefined}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};
