import {FC} from 'react';

type WalletOptionProps = {
  onClick?: () => void;
  id: string;
  active?: boolean;
  clickable?: boolean;
  color: string;
  link?: string | null;
  header: string;
  subheader: string | null;
  icon?: string;
};

export const WalletOption: FC<WalletOptionProps> = ({
  onClick,
  id,
  header,
  subheader,
  icon,
}) => {
  return (
    <div className="my-2">
      <div
        id={id}
        onClick={onClick}
        className=" bg-white border cursor-pointer overflow-hidden rounded-md px-6 py-4">
        <div className="flex">
          {icon && <img className="w-6 h-6 mr-2" src={icon} alt={header} />}
          <div className="">{header}</div>
        </div>
      </div>
      <small className="text-gray-400">{subheader}</small>
    </div>
  );
};
