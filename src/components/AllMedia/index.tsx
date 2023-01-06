import {Media} from 'components/Media';
import {FC} from 'react';

export type MediaProps = {
  media_url?: string;
  metadata: {
    title?: string;
    description?: string;
    mime_type?: string;
  };
  media_id?: string;
  _id?: string;
  metadata_url?: string;
  creator_address?: string;
  count?: number;
};

export type AllMediaProps = {
  media: MediaProps[];
  title?: string;
};

export const AllMedia: FC<AllMediaProps> = ({media}) => {
  return (
    <div className="flex justify-center lg:justify-start flex-wrap -mx-1 lg:-mx-4">
      {media.map((item, index) => (
        <Media key={index} media={item} />
      ))}
    </div>
  );
};
