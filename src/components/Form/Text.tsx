import {FC} from 'react';

type TextProps = {
  label?: string;
  type?: string;
  name?: string;
  placeholder?: string;
};

export const Text: FC<TextProps> = ({label, type, name, placeholder}) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          type={type}
          name={name}
          id={name}
          className="shadow-sm px-3 h-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-indigo-300 rounded-md"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};
