export const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-white flex-grow-0" aria-labelledby="footerHeading">
      <h2 id="footerHeading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto pb-6">
        <div className="border-t border-gray-200 pt-4 flex justify-center">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {year} Rowket. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
