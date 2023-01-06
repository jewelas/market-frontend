import {FC} from 'react';

type ZeroStateProps = {
  title?: string;
  hint?: string;
  ctaAction?: () => void;
  ctaText?: string;
};

export const ZeroState: FC<ZeroStateProps> = ({
  title,
  hint,
  ctaAction,
  ctaText,
}) => {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col justify-center items-center">
        <div className="py-6 text-center">
          {title && <p className="text-2xl font-bold text-red-500">{title}</p>}
          {hint && (
            <span className="text-gray-300 text-xl font-normal">{hint}</span>
          )}
        </div>
        {ctaAction && (
          <button
            onClick={ctaAction}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            {ctaText}{' '}
          </button>
        )}
      </div>
    </div>
  );
};
