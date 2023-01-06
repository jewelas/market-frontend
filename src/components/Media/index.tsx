import {PlayerComponent} from 'components/Player';
import React, {FC} from 'react';
import {User} from 'components/User';
import {MediaProps} from 'components/AllMedia';

export const Media: FC<{media: MediaProps}> = ({media}) => {
  const {
    _id,
    media_url,
    metadata: {title, mime_type},
  } = media;
  return (
    <div className="my-1 px-1 py-4 lg:px-4">
      <article className="overflow-hidden rounded-lg shadow-lg">
        <PlayerComponent url={media_url} mimetype={mime_type} />
        <a href={typeof _id !== 'undefined' ? `/media/${_id}` : '#'}>
          <header className="curosr-pointer flex items-center justify-between leading-tight p-2 md:p-4">
            <h1
              className="curosr-pointer text-lg truncate max-w-sm break-all"
              style={{
                width: 200,
              }}>
              {title}
            </h1>
          </header>
        </a>

        <footer className="flex items-center justify-between leading-none p-2 md:p-4">
          <div className="flex items-center no-underline hover:underline text-black">
            <User
              address={'0x5A3076e8bdE4Ec3aB90Fa022a2018b6D49153a9d'}
              showAddress
            />
          </div>
        </footer>
      </article>
    </div>
  );
};
